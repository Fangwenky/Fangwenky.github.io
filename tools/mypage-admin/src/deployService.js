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

    async function activateRelease(releasePath, expectedHash, sha) {
        const targetUrl = new URL(config.vpsUrl);
        const host = targetUrl.hostname;
        const base = config.deployRoot;
        const script = `set -eu; base=${shellQuote(base)}; release=${shellQuote(releasePath)}; expected=${shellQuote(expectedHash)}; host=${shellQuote(host)}; old=""; if [ -e "$base/current" ] || [ -L "$base/current" ]; then old=$(readlink -f "$base/current" || true); fi; chown -R root:root "$release"; find "$release" -type d -exec chmod 0755 {} +; find "$release" -type f -exec chmod 0644 {} +; actual=$(sha256sum "$release/data/articlesData.js" | awk '{print $1}'); [ "$actual" = "$expected" ]; ln -sfn "$release" "$base/current.next"; mv -Tf "$base/current.next" "$base/current"; served=$(curl -ksS --resolve "$host:443:127.0.0.1" "https://$host/data/articlesData.js?commit=${sha}" | sha256sum | awk '{print $1}'); if [ "$served" != "$expected" ]; then if [ -n "$old" ]; then ln -sfn "$old" "$base/current.rollback"; mv -Tf "$base/current.rollback" "$base/current"; fi; exit 1; fi; printf 'OLD_TARGET=%s\\n' "$old"; printf 'RELEASE=%s\\n' "$release"`;
        const { stdout } = await remote(script);
        const oldTarget = stdout.split('\n').find(line => line.startsWith('OLD_TARGET='))?.slice(11) || '';
        return { oldTarget, releasePath };
    }

    async function rollback(oldTarget) {
        if (!oldTarget) return;
        const base = config.deployRoot;
        await remote(`set -eu; base=${shellQuote(base)}; old=${shellQuote(oldTarget)}; test -d "$old"; ln -sfn "$old" "$base/current.rollback"; mv -Tf "$base/current.rollback" "$base/current"`);
    }

    async function deployVps(sha, expectedHash, onStep = () => {}) {
        const releaseName = `${timestamp()}-${sha.slice(0, 8)}`;
        const releasePath = `${config.deployRoot}/releases/${releaseName}`;
        onStep('vps-upload', 'running', `Uploading ${releaseName}`);
        await remote(`mkdir -p ${shellQuote(releasePath)}`);
        await run('rsync', [
            '-rlptz', '--delete', '--exclude', '.DS_Store',
            `${sourceRoot.replace(/\/$/, '')}/`,
            `${config.sshHost}:${releasePath}/`
        ]);
        onStep('vps-upload', 'success', releasePath);
        onStep('vps-activate', 'running', 'Verifying and switching current release');
        const activation = await activateRelease(releasePath, expectedHash, sha);
        onStep('vps-activate', 'success', releasePath);
        return activation;
    }

    async function deploy(sha, onStep = () => {}) {
        const generatedFile = path.join(sourceRoot, 'data', 'articlesData.js');
        const expectedHash = await sha256(generatedFile);
        const activation = await deployVps(sha, expectedHash, onStep);

        try {
            onStep('github-verify', 'running', 'Waiting for GitHub Pages');
            const github = await waitForHash(config.githubPagesUrl, expectedHash, sha);
            onStep('github-verify', 'success', github.url);

            onStep('vps-verify', 'running', 'Checking public VPS URL');
            const vps = await waitForHash(config.vpsUrl, expectedHash, sha, 45_000);
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

    return { config, deploy, deployVps, waitForHash, rollback };
}

export { shellQuote, sha256 };
