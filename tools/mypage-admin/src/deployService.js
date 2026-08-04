import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { deployConfig, mypageRoot, repoRoot } from './config.js';

const execFileAsync = promisify(execFile);
const treeHashCommand = `find . -type f ! -name deploy-manifest.json ! -name .DS_Store -print0 | sort -z | xargs -0 sha256sum | sed 's#  \\./#  #' | sha256sum | awk '{print $1}'`;

function shellQuote(value) {
    return `'${String(value).replaceAll("'", "'\\''")}'`;
}

function timestamp() {
    return new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
}

async function sha256(filePath) {
    const buffer = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function walkFiles(root) {
    const files = [];
    async function visit(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.name === '.DS_Store' || entry.name === 'deploy-manifest.json') continue;
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await visit(fullPath);
            } else if (entry.isFile()) {
                files.push(path.relative(root, fullPath).replaceAll(path.sep, '/'));
            }
        }
    }
    await visit(root);
    return files.sort();
}

async function createDeploymentManifest(root, sha) {
    const files = [];
    for (const file of await walkFiles(root)) {
        files.push({ path: file, sha256: await sha256(path.join(root, file)) });
    }
    const treeInput = files.map(file => `${file.sha256}  ${file.path}\n`).join('');
    const treeHash = crypto.createHash('sha256').update(treeInput).digest('hex');
    return { version: 1, sha, treeHash, files };
}

async function createGitSnapshot(sha, options = {}) {
    const run = options.run || ((command, args) => execFileAsync(command, args, {
        cwd: options.repoRoot || repoRoot,
        maxBuffer: 20 * 1024 * 1024
    }));
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-deploy-'));
    const archivePath = path.join(tempRoot, 'mypage.tar');
    const snapshotRoot = path.join(tempRoot, 'site');
    try {
        await fs.mkdir(snapshotRoot);
        await run('git', ['archive', '--format=tar', '--output', archivePath, sha, 'mypage']);
        await run('tar', ['-xf', archivePath, '-C', snapshotRoot, '--strip-components=1']);
        await fs.rm(archivePath, { force: true });
        return {
            root: snapshotRoot,
            cleanup: () => fs.rm(tempRoot, { recursive: true, force: true })
        };
    } catch (error) {
        await fs.rm(tempRoot, { recursive: true, force: true });
        throw error;
    }
}

function publicFileUrl(baseUrl, filePath, sha) {
    const encodedPath = filePath.split('/').map(part => encodeURIComponent(part)).join('/');
    return `${baseUrl.replace(/\/$/, '')}/${encodedPath}?commit=${encodeURIComponent(sha)}`;
}

function githubPagesManifest(manifest) {
    const publicExtensions = new Set([
        '.html', '.css', '.js', '.json', '.txt'
    ]);
    return {
        ...manifest,
        files: manifest.files.filter(file => publicExtensions.has(path.extname(file.path).toLowerCase()))
    };
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function createDeployService(options = {}) {
    const config = { ...deployConfig, ...(options.config || {}) };
    const sourceRoot = options.mypageRoot || mypageRoot;
    const cwd = options.repoRoot || repoRoot;
    const run = options.run || ((command, args, runOptions = {}) => execFileAsync(command, args, {
        cwd,
        maxBuffer: 20 * 1024 * 1024,
        ...runOptions
    }));
    const fetchImpl = options.fetch || globalThis.fetch;
    const sleep = options.sleep || delay;
    const verificationTimeoutMs = options.verificationTimeoutMs || 180_000;
    const verificationIntervalMs = options.verificationIntervalMs || 5_000;
    const deploymentLockWaitSeconds = options.deploymentLockWaitSeconds || 360;
    const deploymentLockStaleSeconds = options.deploymentLockStaleSeconds || 900;

    async function createCommitSnapshot(sha) {
        if (options.snapshotFactory) return options.snapshotFactory(sha);
        return createGitSnapshot(sha, { run });
    }

    async function remote(script) {
        return run('ssh', ['-o', 'BatchMode=yes', config.sshHost, script]);
    }

    async function acquireDeploymentLock(token) {
        const base = config.deployRoot;
        const script = `set -eu; base=${shellQuote(base)}; token=${shellQuote(token)}; wait_limit=${shellQuote(deploymentLockWaitSeconds)}; stale_after=${shellQuote(deploymentLockStaleSeconds)}; lock="$base/.deploy-lock"; mkdir -p "$base"; i=0; while ! mkdir "$lock" 2>/dev/null; do now=$(date +%s); updated=$(stat -c %Y "$lock" 2>/dev/null || printf 0); if [ "$updated" -gt 0 ] && [ $((now - updated)) -gt "$stale_after" ]; then stale="$base/.deploy-lock.stale.$token"; if mv "$lock" "$stale" 2>/dev/null; then rm -f "$stale/owner"; rmdir "$stale" 2>/dev/null || true; continue; fi; fi; if [ "$i" -ge "$wait_limit" ]; then owner=$(cat "$lock/owner" 2>/dev/null || printf unknown); printf 'VPS_DEPLOY_LOCK_TIMEOUT owner=%s\n' "$owner" >&2; exit 1; fi; i=$((i + 1)); sleep 1; done; printf '%s\n' "$token" > "$lock/owner"; printf 'VPS_DEPLOY_LOCK=%s\n' "$token"`;
        await remote(script);
    }

    async function releaseDeploymentLock(token) {
        const base = config.deployRoot;
        const script = `set -eu; base=${shellQuote(base)}; token=${shellQuote(token)}; lock="$base/.deploy-lock"; if [ -f "$lock/owner" ] && [ "$(cat "$lock/owner")" = "$token" ]; then rm -f "$lock/owner"; rmdir "$lock"; fi`;
        await remote(script);
    }

    async function fetchHash(url) {
        const response = await fetchImpl(url, {
            headers: { 'cache-control': 'no-cache' },
            signal: AbortSignal.timeout(15_000)
        });
        if (!response.ok) throw new Error(`Verification returned HTTP ${response.status}: ${url}`);
        const body = Buffer.from(await response.arrayBuffer());
        return crypto.createHash('sha256').update(body).digest('hex');
    }

    async function waitForHash(baseUrl, expectedHash, sha, maxMs = verificationTimeoutMs) {
        const deadline = Date.now() + maxMs;
        let lastError = null;
        const url = `${baseUrl.replace(/\/$/, '')}/data/articlesData.js?commit=${encodeURIComponent(sha)}`;
        do {
            try {
                const actualHash = await fetchHash(url);
                if (actualHash === expectedHash) return { url, hash: actualHash };
                lastError = new Error(`Published file hash does not match ${expectedHash}.`);
            } catch (error) {
                lastError = error;
            }
            await sleep(verificationIntervalMs);
        } while (Date.now() < deadline);
        throw new Error(`Timed out verifying ${baseUrl}: ${lastError?.message || 'unknown error'}`);
    }

    async function fetchJson(url) {
        const response = await fetchImpl(url, {
            headers: { 'cache-control': 'no-cache' },
            signal: AbortSignal.timeout(15_000)
        });
        if (!response.ok) throw new Error(`Verification returned HTTP ${response.status}: ${url}`);
        return response.json();
    }

    async function verifyFileSet(baseUrl, manifest) {
        for (const file of manifest.files) {
            const url = publicFileUrl(baseUrl, file.path, manifest.sha);
            const actualHash = await fetchHash(url);
            if (actualHash !== file.sha256) {
                throw new Error(`File hash mismatch for ${file.path}: expected ${file.sha256}, got ${actualHash}.`);
            }
        }
        return { url: baseUrl, hash: manifest.treeHash, fileCount: manifest.files.length };
    }

    async function waitForFileSet(baseUrl, manifest, maxMs = verificationTimeoutMs) {
        const deadline = Date.now() + maxMs;
        let lastError = null;
        do {
            try {
                return await verifyFileSet(baseUrl, manifest);
            } catch (error) {
                lastError = error;
            }
            await sleep(verificationIntervalMs);
        } while (Date.now() < deadline);
        throw new Error(`Timed out verifying ${baseUrl}: ${lastError?.message || 'unknown error'}`);
    }

    async function waitForManifest(baseUrl, manifest, maxMs = verificationTimeoutMs) {
        const deadline = Date.now() + maxMs;
        const url = `${baseUrl.replace(/\/$/, '')}/deploy-manifest.json?commit=${encodeURIComponent(manifest.sha)}`;
        let lastError = null;
        do {
            try {
                const actual = await fetchJson(url);
                if (actual.sha === manifest.sha && actual.treeHash === manifest.treeHash) {
                    return { url, hash: actual.treeHash, fileCount: actual.files?.length || 0 };
                }
                lastError = new Error(`Deployment manifest does not match ${manifest.treeHash}.`);
            } catch (error) {
                lastError = error;
            }
            await sleep(verificationIntervalMs);
        } while (Date.now() < deadline);
        throw new Error(`Timed out verifying ${baseUrl}: ${lastError?.message || 'unknown error'}`);
    }

    async function activateRelease(releasePath, expectedTreeHash, sha) {
        const targetUrl = new URL(config.vpsUrl);
        const host = targetUrl.hostname;
        const base = config.deployRoot;
        const treeCommand = `find . -type f ! -name deploy-manifest.json ! -name .DS_Store -print0 | sort -z | xargs -0 sha256sum | sed 's#  \\./#  #' | sha256sum | awk '{print $1}'`;
        const manifestUrl = `https://${host}/deploy-manifest.json?commit=${sha}`;
        const extractTreeHash = `sed -n 's/.*"treeHash": *"\\([^"]*\\)".*/\\1/p' | head -n 1`;
        const script = `set -eu; base=${shellQuote(base)}; release=${shellQuote(releasePath)}; expected=${shellQuote(expectedTreeHash)}; host=${shellQuote(host)}; old=""; if [ -e "$base/current" ] || [ -L "$base/current" ]; then old=$(readlink -f "$base/current" || true); fi; chown -R root:root "$release"; find "$release" -type d -exec chmod 0755 {} +; find "$release" -type f -exec chmod 0644 {} +; actual=$(cd "$release" && ${treeCommand}); if [ "$actual" != "$expected" ]; then printf 'LOCAL_TREE_HASH=%s EXPECTED=%s\\n' "$actual" "$expected" >&2; exit 1; fi; ln -sfn "$release" "$base/current.next"; mv -Tf "$base/current.next" "$base/current"; served=""; i=0; while [ "$i" -lt 15 ]; do served=$(curl -ksS --resolve "$host:443:127.0.0.1" ${shellQuote(manifestUrl)} | ${extractTreeHash}); [ "$served" = "$expected" ] && break; i=$((i + 1)); sleep 1; done; if [ "$served" != "$expected" ]; then printf 'SERVED_TREE_HASH=%s EXPECTED=%s\\n' "$served" "$expected" >&2; if [ -n "$old" ]; then ln -sfn "$old" "$base/current.rollback"; mv -Tf "$base/current.rollback" "$base/current"; fi; exit 1; fi; printf 'OLD_TARGET=%s\\n' "$old"; printf 'RELEASE=%s\\n' "$release"`;
        const { stdout } = await remote(script);
        const oldTarget = stdout.split('\n').find(line => line.startsWith('OLD_TARGET='))?.slice(11) || '';
        return { oldTarget, releasePath };
    }

    async function rollback(oldTarget, expectedCurrent = '') {
        if (!oldTarget) return;
        const base = config.deployRoot;
        await remote(`set -eu; base=${shellQuote(base)}; old=${shellQuote(oldTarget)}; expected=${shellQuote(expectedCurrent)}; test -d "$old"; current=$(readlink -f "$base/current" || true); if [ -n "$expected" ] && [ "$current" != "$expected" ]; then printf 'ROLLBACK_SKIPPED_CURRENT=%s\n' "$current"; exit 0; fi; ln -sfn "$old" "$base/current.rollback"; mv -Tf "$base/current.rollback" "$base/current"`);
    }

    async function remoteTreeHash(releasePath) {
        const { stdout } = await remote(`set -eu; release=${shellQuote(releasePath)}; test -d "$release"; actual=$(cd "$release" && ${treeHashCommand}); printf 'REMOTE_TREE_HASH=%s\n' "$actual"`);
        return stdout.split('\n').find(line => line.startsWith('REMOTE_TREE_HASH='))?.slice(17) || '';
    }

    async function syncRelease(uploadRoot, releasePath, checksum = false) {
        const args = ['-rlptz', '--delete', '--exclude', '.DS_Store'];
        if (checksum) args.push('--checksum');
        args.push(
            `${uploadRoot.replace(/\/$/, '')}/`,
            `${config.sshHost}:${releasePath}/`
        );
        await run('rsync', args);
    }

    async function deployVps(sha, manifest, onStep = () => {}, uploadRoot = sourceRoot) {
        const releaseName = `${timestamp()}-${sha.slice(0, 8)}-${crypto.randomBytes(4).toString('hex')}`;
        const releasePath = `${config.deployRoot}/releases/${releaseName}`;
        onStep('vps-upload', 'running', `Uploading ${releaseName}`);
        await remote(`set -eu; releases=${shellQuote(`${config.deployRoot}/releases`)}; release=${shellQuote(releasePath)}; mkdir -p "$releases"; mkdir "$release"`);
        await syncRelease(uploadRoot, releasePath);
        let actualTreeHash = await remoteTreeHash(releasePath);
        if (actualTreeHash !== manifest.treeHash) {
            onStep('vps-upload', 'running', `Hash mismatch; retrying ${releaseName} with checksum verification`);
            await syncRelease(uploadRoot, releasePath, true);
            actualTreeHash = await remoteTreeHash(releasePath);
        }
        if (actualTreeHash !== manifest.treeHash) {
            throw new Error(`Uploaded VPS release hash mismatch: expected ${manifest.treeHash}, got ${actualTreeHash || 'empty hash'}.`);
        }
        await remote(`printf %s ${shellQuote(`${JSON.stringify(manifest, null, 2)}\n`)} > ${shellQuote(`${releasePath}/deploy-manifest.json`)}`);
        onStep('vps-upload', 'success', releasePath);
        onStep('vps-activate', 'running', 'Verifying and switching current release');
        const activation = await activateRelease(releasePath, manifest.treeHash, sha);
        onStep('vps-activate', 'success', releasePath);
        return activation;
    }

    async function deploy(sha, onStep = () => {}) {
        const snapshot = await createCommitSnapshot(sha);
        try {
            const manifest = await createDeploymentManifest(snapshot.root, sha);
            const lockToken = `${sha.slice(0, 12)}-${crypto.randomUUID()}`;
            let lockHeld = false;
            let deploymentError = null;
            let activation;
            let vps;
            try {
                onStep('vps-upload', 'running', 'Waiting for the VPS deployment lock');
                await acquireDeploymentLock(lockToken);
                lockHeld = true;
                activation = await deployVps(sha, manifest, onStep, snapshot.root);
                onStep('vps-verify', 'running', 'Checking public VPS URL');
                try {
                    vps = await waitForManifest(config.vpsUrl, manifest, 45_000);
                    onStep('vps-verify', 'success', vps.url);
                } catch (error) {
                    await rollback(activation.oldTarget, activation.releasePath);
                    onStep('vps-verify', 'error', `${error.message} Previous release restored.`);
                    throw error;
                }
            } catch (error) {
                deploymentError = error;
                throw error;
            } finally {
                if (lockHeld) {
                    try {
                        await releaseDeploymentLock(lockToken);
                    } catch (lockError) {
                        if (!deploymentError) throw lockError;
                    }
                }
            }

            onStep('github-verify', 'running', 'Waiting for GitHub Pages');
            const github = await waitForFileSet(config.githubPagesUrl, githubPagesManifest(manifest));
            onStep('github-verify', 'success', github.url);
            return { sha, release: activation.releasePath, github, vps };
        } finally {
            await snapshot.cleanup();
        }
    }

    return { config, deploy, deployVps, waitForHash, waitForFileSet, waitForManifest, rollback };
}

export { createDeploymentManifest, createGitSnapshot, shellQuote, sha256 };
