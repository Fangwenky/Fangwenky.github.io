import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { deployConfig, mypageRoot, repoRoot } from './config.js';

const execFileAsync = promisify(execFile);

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

function publicFileUrl(baseUrl, filePath, sha) {
    const encodedPath = filePath.split('/').map(part => encodeURIComponent(part)).join('/');
    return `${baseUrl.replace(/\/$/, '')}/${encodedPath}?commit=${encodeURIComponent(sha)}`;
}

function githubPagesManifest(manifest) {
    const publicExtensions = new Set([
        '.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.svg',
        '.webp', '.gif', '.ico', '.txt', '.woff', '.woff2'
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

    async function remote(script) {
        return run('ssh', ['-o', 'BatchMode=yes', config.sshHost, script]);
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

    async function rollback(oldTarget) {
        if (!oldTarget) return;
        const base = config.deployRoot;
        await remote(`set -eu; base=${shellQuote(base)}; old=${shellQuote(oldTarget)}; test -d "$old"; ln -sfn "$old" "$base/current.rollback"; mv -Tf "$base/current.rollback" "$base/current"`);
    }

    async function deployVps(sha, manifest, onStep = () => {}) {
        const releaseName = `${timestamp()}-${sha.slice(0, 8)}`;
        const releasePath = `${config.deployRoot}/releases/${releaseName}`;
        onStep('vps-upload', 'running', `Uploading ${releaseName}`);
        await remote(`mkdir -p ${shellQuote(releasePath)}`);
        await run('rsync', [
            '-rlptz', '--delete', '--exclude', '.DS_Store',
            `${sourceRoot.replace(/\/$/, '')}/`,
            `${config.sshHost}:${releasePath}/`
        ]);
        await remote(`printf %s ${shellQuote(`${JSON.stringify(manifest, null, 2)}\n`)} > ${shellQuote(`${releasePath}/deploy-manifest.json`)}`);
        onStep('vps-upload', 'success', releasePath);
        onStep('vps-activate', 'running', 'Verifying and switching current release');
        const activation = await activateRelease(releasePath, manifest.treeHash, sha);
        onStep('vps-activate', 'success', releasePath);
        return activation;
    }

    async function deploy(sha, onStep = () => {}) {
        const manifest = await createDeploymentManifest(sourceRoot, sha);
        const activation = await deployVps(sha, manifest, onStep);

        try {
            onStep('github-verify', 'running', 'Waiting for GitHub Pages');
            const github = await waitForFileSet(config.githubPagesUrl, githubPagesManifest(manifest));
            onStep('github-verify', 'success', github.url);

            onStep('vps-verify', 'running', 'Checking public VPS URL');
            const vps = await waitForManifest(config.vpsUrl, manifest, 45_000);
            onStep('vps-verify', 'success', vps.url);
            return { sha, release: activation.releasePath, github, vps };
        } catch (error) {
            if (String(error.message).includes(config.vpsUrl)) {
                await rollback(activation.oldTarget);
                onStep('vps-verify', 'error', `${error.message} Previous release restored.`);
            }
            throw error;
        }
    }

    return { config, deploy, deployVps, waitForHash, waitForFileSet, waitForManifest, rollback };
}

export { createDeploymentManifest, shellQuote, sha256 };
