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
    const archiveHash = 'a'.repeat(64);
    const calls = [];
    const run = async (command, args) => {
        calls.push([command, ...args]);
        if (command === 'scp') await new Promise(resolve => setTimeout(resolve, 12));
        if (command === 'ssh' && args.at(-1).includes('REMOTE_ARCHIVE_HASH=')) {
            return { stdout: `REMOTE_ARCHIVE_HASH=${archiveHash}\n`, stderr: '' };
        }
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
        deploymentLockHeartbeatMs: 2,
        snapshotFactory: async () => ({ root, cleanup: async () => {} }),
        archiveFactory: async () => ({ path: '/tmp/fake-site.tar.gz', sha256: archiveHash, cleanup: async () => {} }),
        config: {
            sshHost: 'root@example.com', deployRoot: '/var/www/site',
            vpsUrl: 'https://site.example.com', githubPagesUrl: 'https://pages.example.com'
        }
    });
    const result = await service.deploy('1234567890abcdef');
    assert.equal(result.github.fileCount, 2);
    assert.equal(result.vps.fileCount, 2);
    assert.notEqual(result.github.hash, expectedArticleHash);
    assert(calls.some(call => call[0] === 'scp'));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes("-name '._*'")));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('chmod 0755')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('deploy-manifest.json')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('SERVED_TREE_HASH')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('sleep 1')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('VPS_DEPLOY_LOCK=')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('VPS_DEPLOY_LOCK_HEARTBEAT=')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('rmdir "$lock"')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('find "$releases"') && call.at(-1).includes('deploy-manifest.json')));
    const scpTarget = calls.find(call => call[0] === 'scp').at(-1);
    assert.match(scpTarget, /uploads\/\d{14}-12345678-[a-f0-9]{8}\.tar\.gz$/);
});

test('creates transfer archives without macOS AppleDouble metadata', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-archive-metadata-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await fs.writeFile(path.join(root, 'index.html'), 'site\n');
    const manifest = await createDeploymentManifest(root, 'abcdef1234567890');
    const archiveContent = Buffer.from('fake archive');
    const archiveHash = crypto.createHash('sha256').update(archiveContent).digest('hex');
    const calls = [];
    const run = async (command, args, runOptions = {}) => {
        calls.push({ command, args, runOptions });
        const script = args.at(-1);
        if (command === 'tar') {
            await fs.writeFile(args[2], archiveContent);
            return { stdout: '', stderr: '' };
        }
        if (command === 'ssh' && script.includes('REMOTE_ARCHIVE_HASH=')) {
            return { stdout: `REMOTE_ARCHIVE_HASH=${archiveHash}\n`, stderr: '' };
        }
        if (command === 'ssh' && script.includes('REMOTE_TREE_HASH=')) {
            return { stdout: `REMOTE_TREE_HASH=${manifest.treeHash}\n`, stderr: '' };
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

    const tarCall = calls.find(call => call.command === 'tar');
    assert(tarCall.args.includes('--no-xattrs'));
    assert.equal(tarCall.runOptions.env.COPYFILE_DISABLE, '1');
    const extractScript = calls.find(call => call.command === 'ssh' && call.args.at(-1).includes('tar -xzf')).args.at(-1);
    assert(extractScript.includes("find \"$release\" -type f -name '._*' -delete"));
    assert(extractScript.includes('find "$release" -type f -name .DS_Store -delete'));
    assert(!extractScript.includes('('));
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

test('waits for a transient release hash to stabilize before activation', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-vps-retry-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await fs.writeFile(path.join(root, 'index.html'), 'site\n');
    const manifest = await createDeploymentManifest(root, 'abcdef1234567890');
    const archiveHash = 'b'.repeat(64);
    const calls = [];
    let hashChecks = 0;
    const run = async (command, args) => {
        calls.push([command, ...args]);
        const script = args.at(-1);
        if (command === 'ssh' && script.includes('REMOTE_ARCHIVE_HASH=')) {
            return { stdout: `REMOTE_ARCHIVE_HASH=${archiveHash}\n`, stderr: '' };
        }
        if (command === 'ssh' && script.includes('REMOTE_TREE_HASH=')) {
            hashChecks += 1;
            return { stdout: `REMOTE_TREE_HASH=${hashChecks < 3 ? 'bad-hash' : manifest.treeHash}\n`, stderr: '' };
        }
        if (command === 'ssh' && script.includes('OLD_TARGET=')) {
            return { stdout: 'OLD_TARGET=/old\nRELEASE=/release\n', stderr: '' };
        }
        return { stdout: '', stderr: '' };
    };
    const service = createDeployService({
        mypageRoot: root,
        run,
        sleep: async () => {},
        uploadHashAttempts: 3,
        archiveFactory: async () => ({ path: '/tmp/fake-site.tar.gz', sha256: archiveHash, cleanup: async () => {} }),
        config: {
            sshHost: 'root@example.com', deployRoot: '/var/www/site',
            vpsUrl: 'https://site.example.com', githubPagesUrl: 'https://pages.example.com'
        }
    });

    await service.deployVps('abcdef1234567890', manifest, () => {}, root);
    assert.equal(calls.filter(call => call[0] === 'scp').length, 1);
    assert.equal(calls.filter(call => call[0] === 'ssh' && call.at(-1).includes('tar -xzf')).length, 1);
    assert.equal(hashChecks, 3);
});

test('releases the remote lock when an upload fails', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-vps-lock-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await fs.writeFile(path.join(root, 'index.html'), 'site\n');
    const calls = [];
    const run = async (command, args) => {
        calls.push([command, ...args]);
        if (command === 'scp') throw new Error('simulated upload failure');
        return { stdout: '', stderr: '' };
    };
    const service = createDeployService({
        run,
        snapshotFactory: async () => ({ root, cleanup: async () => {} }),
        archiveFactory: async () => ({ path: '/tmp/fake-site.tar.gz', sha256: 'c'.repeat(64), cleanup: async () => {} }),
        config: {
            sshHost: 'root@example.com', deployRoot: '/var/www/site',
            vpsUrl: 'https://site.example.com', githubPagesUrl: 'https://pages.example.com'
        }
    });

    await assert.rejects(service.deploy('abcdef1234567890'), /simulated upload failure/);
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('VPS_DEPLOY_LOCK=')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('rm -rf -- "$release"')));
    assert(calls.some(call => call[0] === 'ssh' && call.at(-1).includes('rmdir "$lock"')));
});
