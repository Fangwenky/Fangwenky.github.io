import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { createDeploymentManifest, createDeployService, createGitSnapshot, shellQuote } from '../src/deployService.js';

const execFileAsync = promisify(execFile);

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
    const expectedManifest = await createDeploymentManifest(root, '1234567890abcdef');
    const calls = [];
    const run = async (command, args) => {
        calls.push([command, ...args]);
        if (command === 'ssh' && args.at(-1).includes('REMOTE_TREE_HASH=')) {
            return { stdout: `REMOTE_TREE_HASH=${expectedManifest.treeHash}\n`, stderr: '' };
        }
        if (command === 'ssh' && args.at(-1).includes('OLD_TARGET=')) {
            return { stdout: 'OLD_TARGET=/old\nRELEASE=/release\n', stderr: '' };
        }
        return { stdout: '', stderr: '' };
    };
    const fetch = async url => {
        if (String(url).includes('deploy-manifest.json')) {
            return Response.json(expectedManifest);
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
        snapshotFactory: async () => ({ root, cleanup: async () => {} }),
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
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('SERVED_TREE_HASH')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('sleep 1')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('VPS_DEPLOY_LOCK=')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('rmdir "$lock"')));
    const rsyncTarget = calls.find(call => call[0] === 'rsync').at(-1);
    assert.match(rsyncTarget, /12345678-[a-f0-9]{8}\/$/);
});

test('creates deployment snapshots from the committed Git tree, not the mutable worktree', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-git-snapshot-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await fs.mkdir(path.join(root, 'mypage'), { recursive: true });
    await fs.writeFile(path.join(root, 'mypage/index.html'), 'committed\n');
    await execFileAsync('git', ['init'], { cwd: root });
    await execFileAsync('git', ['config', 'user.name', 'Test'], { cwd: root });
    await execFileAsync('git', ['config', 'user.email', 'test@example.com'], { cwd: root });
    await execFileAsync('git', ['add', 'mypage/index.html'], { cwd: root });
    await execFileAsync('git', ['commit', '-m', 'snapshot'], { cwd: root });
    const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: root });
    await fs.writeFile(path.join(root, 'mypage/index.html'), 'uncommitted\n');

    const snapshot = await createGitSnapshot(stdout.trim(), { repoRoot: root });
    t.after(() => snapshot.cleanup());
    assert.equal(await fs.readFile(path.join(snapshot.root, 'index.html'), 'utf8'), 'committed\n');
});

test('retries a mismatched VPS upload with checksum verification', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-vps-retry-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await fs.writeFile(path.join(root, 'index.html'), 'site\n');
    const manifest = await createDeploymentManifest(root, 'abcdef1234567890');
    const calls = [];
    let hashChecks = 0;
    const run = async (command, args) => {
        calls.push([command, ...args]);
        const script = args.at(-1);
        if (command === 'ssh' && script.includes('REMOTE_TREE_HASH=')) {
            hashChecks += 1;
            return { stdout: `REMOTE_TREE_HASH=${hashChecks === 1 ? 'bad-hash' : manifest.treeHash}\n`, stderr: '' };
        }
        if (command === 'ssh' && script.includes('OLD_TARGET=')) {
            return { stdout: 'OLD_TARGET=/old\nRELEASE=/release\n', stderr: '' };
        }
        return { stdout: '', stderr: '' };
    };
    const service = createDeployService({
        mypageRoot: root,
        run,
        config: {
            sshHost: 'root@example.com', deployRoot: '/var/www/site',
            vpsUrl: 'https://site.example.com', githubPagesUrl: 'https://pages.example.com'
        }
    });

    await service.deployVps('abcdef1234567890', manifest, () => {}, root);
    const rsyncCalls = calls.filter(call => call[0] === 'rsync');
    assert.equal(rsyncCalls.length, 2);
    assert.equal(rsyncCalls[0].includes('--checksum'), false);
    assert.equal(rsyncCalls[1].includes('--checksum'), true);
});

test('releases the remote lock when an upload fails', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-vps-lock-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await fs.writeFile(path.join(root, 'index.html'), 'site\n');
    const calls = [];
    const run = async (command, args) => {
        calls.push([command, ...args]);
        if (command === 'rsync') throw new Error('simulated upload failure');
        return { stdout: '', stderr: '' };
    };
    const service = createDeployService({
        run,
        snapshotFactory: async () => ({ root, cleanup: async () => {} }),
        config: {
            sshHost: 'root@example.com', deployRoot: '/var/www/site',
            vpsUrl: 'https://site.example.com', githubPagesUrl: 'https://pages.example.com'
        }
    });

    await assert.rejects(service.deploy('abcdef1234567890'), /simulated upload failure/);
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('VPS_DEPLOY_LOCK=')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('rmdir "$lock"')));
});
