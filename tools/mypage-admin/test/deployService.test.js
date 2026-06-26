import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createDeploymentManifest, createDeployService, shellQuote } from '../src/deployService.js';

test('quotes remote shell values safely', () => {
    assert.equal(shellQuote("a'b"), "'a'\\''b'");
});

test('uploads, activates, and verifies both public targets', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-deploy-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await fs.mkdir(path.join(root, 'data'), { recursive: true });
    const content = Buffer.from('export const articles = [];\n');
    await fs.writeFile(path.join(root, 'data/articlesData.js'), content);
    await fs.writeFile(path.join(root, 'script.js'), 'console.log("site");\n');
    const expectedArticleHash = crypto.createHash('sha256').update(content).digest('hex');
    const calls = [];
    const run = async (command, args) => {
        calls.push([command, ...args]);
        if (command === 'ssh' && args.at(-1).includes('OLD_TARGET=')) {
            return { stdout: 'OLD_TARGET=/old\nRELEASE=/release\n', stderr: '' };
        }
        return { stdout: '', stderr: '' };
    };
    const fetch = async url => {
        if (String(url).includes('deploy-manifest.json')) {
            return Response.json(await createDeploymentManifest(root, '1234567890abcdef'));
        }
        if (String(url).includes('data/articlesData.js')) {
            return new Response(content, { status: 200 });
        }
        if (String(url).includes('script.js')) {
            return new Response('console.log("site");\n', { status: 200 });
        }
        return new Response('', { status: 404 });
    };
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
    assert.equal(result.github.fileCount, 2);
    assert.equal(result.vps.fileCount, 2);
    assert.notEqual(result.github.hash, expectedArticleHash);
    assert(calls.some(call => call[0] === 'rsync'));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('chmod 0755')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('deploy-manifest.json')));
});
