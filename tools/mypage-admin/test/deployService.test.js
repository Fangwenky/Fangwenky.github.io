import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createDeployService, shellQuote } from '../src/deployService.js';

test('quotes remote shell values safely', () => {
    assert.equal(shellQuote("a'b"), "'a'\\''b'");
});

test('uploads, activates, and verifies both public targets', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-deploy-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await fs.mkdir(path.join(root, 'data'), { recursive: true });
    const content = Buffer.from('export const articles = [];\n');
    await fs.writeFile(path.join(root, 'data/articlesData.js'), content);
    const expected = crypto.createHash('sha256').update(content).digest('hex');
    const calls = [];
    const run = async (command, args) => {
        calls.push([command, ...args]);
        if (command === 'ssh' && args.at(-1).includes('OLD_TARGET=')) {
            return { stdout: 'OLD_TARGET=/old\nRELEASE=/release\n', stderr: '' };
        }
        return { stdout: '', stderr: '' };
    };
    const fetch = async () => new Response(content, { status: 200 });
    const service = createDeployService({
        mypageRoot: root,
        run,
        fetch,
        sleep: async () => {},
        verificationTimeoutMs: 20,
        verificationIntervalMs: 1,
        config: {
            sshHost: 'root@example.com', deployRoot: '/var/www/site',
            vpsUrl: 'https://site.example.com', githubPagesUrl: 'https://pages.example.com'
        }
    });
    const result = await service.deploy('1234567890abcdef');
    assert.equal(result.github.hash, expected);
    assert.equal(result.vps.hash, expected);
    assert(calls.some(call => call[0] === 'rsync'));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('chmod 0755')));
});
