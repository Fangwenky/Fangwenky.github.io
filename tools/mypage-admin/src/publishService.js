import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { repoRoot } from './config.js';
import { generateStaticData } from './staticGenerator.js';

const execFileAsync = promisify(execFile);
const confirmationTtlMs = 10 * 60 * 1000;

function publicJob(job) {
    return JSON.parse(JSON.stringify(job));
}

export function createPublishService(options = {}) {
    const git = options.gitService;
    const deploy = options.deployService;
    if (!git || !deploy) throw new Error('Publish service requires Git and deploy services.');

    const generate = options.generate || (() => generateStaticData());
    const audit = options.audit || (() => execFileAsync('node', ['tools/mypage-admin/scripts/audit-content.mjs'], {
        cwd: options.repoRoot || repoRoot,
        maxBuffer: 20 * 1024 * 1024
    }));
    const confirmations = new Map();
    const jobs = new Map();
    let activeJobId = null;

    function updateStep(job, id, state, detail = '') {
        const step = job.steps.find(item => item.id === id);
        if (step) Object.assign(step, { state, detail, updatedAt: new Date().toISOString() });
    }

    function deploymentSteps() {
        return [
            { id: 'git-commit', label: '提交源码', state: 'pending' },
            { id: 'git-push', label: '推送 GitHub', state: 'pending' },
            { id: 'vps-upload', label: '上传 VPS release', state: 'pending' },
            { id: 'vps-activate', label: '切换 VPS', state: 'pending' },
            { id: 'github-verify', label: '验证 GitHub Pages', state: 'pending' },
            { id: 'vps-verify', label: '验证 VPS', state: 'pending' }
        ];
    }

    function createJob(kind = 'publish') {
        if (activeJobId && ['queued', 'running'].includes(jobs.get(activeJobId)?.state)) {
            throw new Error('Another publish task is already running.');
        }
        const id = crypto.randomUUID();
        const job = {
            id,
            kind,
            state: 'queued',
            phase: '',
            steps: deploymentSteps(),
            createdAt: new Date().toISOString(),
            commit: '',
            result: null,
            error: ''
        };
        jobs.set(id, job);
        activeJobId = id;
        return job;
    }

    async function prepare() {
        const initial = await git.workspaceStatus({ fetch: true });
        if (!initial.ready) throw new Error(initial.blockers.join(' '));

        const generated = await generate();
        await audit();
        const workspace = await git.workspaceStatus();
        if (!workspace.ready) throw new Error(workspace.blockers.join(' '));
        if (workspace.publishableFiles.length === 0) {
            return {
                ready: false,
                generated,
                message: '没有可发布的公开内容变更。文章草稿会继续保留在本机。',
                excludedDraftFiles: workspace.draftFiles
            };
        }

        const [files, fingerprint] = await Promise.all([
            git.diffSummary(workspace),
            git.fingerprint(workspace)
        ]);
        const confirmationId = crypto.randomUUID();
        const expiresAt = Date.now() + confirmationTtlMs;
        confirmations.set(confirmationId, {
            confirmationId,
            expiresAt,
            fingerprint,
            publishPaths: workspace.publishPaths,
            files
        });

        return {
            ready: true,
            confirmationId,
            expiresAt: new Date(expiresAt).toISOString(),
            branch: workspace.branch,
            files,
            excludedDraftFiles: workspace.draftFiles,
            generated
        };
    }

    async function validateConfirmation(confirmationId) {
        const confirmation = confirmations.get(confirmationId);
        if (!confirmation || confirmation.expiresAt < Date.now()) {
            confirmations.delete(confirmationId);
            throw new Error('Publish confirmation expired. Prepare the release again.');
        }
        const workspace = await git.workspaceStatus({ fetch: true });
        if (!workspace.ready) throw new Error(workspace.blockers.join(' '));
        const fingerprint = await git.fingerprint(workspace);
        if (fingerprint !== confirmation.fingerprint) {
            throw new Error('Files changed after the publish preview. Prepare the release again.');
        }
        return { confirmation, workspace };
    }

    async function runPublish(job, confirmationId, title) {
        job.state = 'running';
        let stagedPaths = [];
        let committed = false;
        try {
            const { confirmation, workspace } = await validateConfirmation(confirmationId);
            updateStep(job, 'git-commit', 'running', 'Staging published article changes');
            const stagedFiles = await git.stage(confirmation.publishPaths);
            stagedPaths = confirmation.publishPaths;
            if (!stagedFiles.length) throw new Error('No files were staged for publishing.');
            const allowed = file => confirmation.publishPaths.some(root => file === root || file.startsWith(`${root}/`));
            const unexpected = stagedFiles.filter(file => !allowed(file));
            if (unexpected.length) {
                await git.unstage(confirmation.publishPaths);
                throw new Error(`Unexpected staged files: ${unexpected.join(', ')}`);
            }

            job.phase = 'commit';
            const sha = await git.commit(`Publish content: ${title || workspace.publishIds.join(', ') || 'site update'}`);
            committed = true;
            job.commit = sha;
            updateStep(job, 'git-commit', 'success', sha.slice(0, 8));

            job.phase = 'push';
            updateStep(job, 'git-push', 'running', 'Pushing origin/main');
            await git.push();
            updateStep(job, 'git-push', 'success', sha.slice(0, 8));

            job.phase = 'deploy';
            const result = await deploy.deploy(sha, (id, state, detail) => updateStep(job, id, state, detail));
            job.result = result;
            job.phase = 'complete';
            job.state = 'success';
            confirmations.delete(confirmationId);
        } catch (error) {
            if (!committed && stagedPaths.length) {
                try {
                    await git.unstage(stagedPaths);
                } catch {
                    // Preserve the original publishing error; workspace status exposes cleanup issues.
                }
            }
            job.state = 'error';
            job.error = error.message || String(error);
            const current = job.steps.find(step => step.state === 'running');
            if (current) updateStep(job, current.id, 'error', job.error);
        } finally {
            activeJobId = null;
            job.finishedAt = new Date().toISOString();
        }
    }

    function startPublish({ confirmationId, title }) {
        if (!confirmationId) throw new Error('Missing publish confirmation.');
        const job = createJob('publish');
        void runPublish(job, confirmationId, title);
        return publicJob(job);
    }

    async function runPushRetry(job, sourceJob) {
        job.state = 'running';
        job.commit = sourceJob.commit;
        updateStep(job, 'git-commit', 'success', sourceJob.commit.slice(0, 8));
        try {
            job.phase = 'push';
            updateStep(job, 'git-push', 'running', 'Retrying origin/main');
            await git.push();
            updateStep(job, 'git-push', 'success', sourceJob.commit.slice(0, 8));
            job.phase = 'deploy';
            job.result = await deploy.deploy(sourceJob.commit, (id, state, detail) => updateStep(job, id, state, detail));
            job.phase = 'complete';
            job.state = 'success';
        } catch (error) {
            job.state = 'error';
            job.error = error.message || String(error);
            const current = job.steps.find(step => step.state === 'running');
            if (current) updateStep(job, current.id, 'error', job.error);
        } finally {
            activeJobId = null;
            job.finishedAt = new Date().toISOString();
        }
    }

    function retryPush(sourceJobId) {
        const sourceJob = jobs.get(sourceJobId);
        if (!sourceJob || sourceJob.phase !== 'push' || !sourceJob.commit) {
            throw new Error('This task cannot retry a Git push.');
        }
        const job = createJob('push-retry');
        void runPushRetry(job, sourceJob);
        return publicJob(job);
    }

    async function runDeployOnly(job, sha) {
        job.state = 'running';
        job.commit = sha;
        updateStep(job, 'git-commit', 'success', sha.slice(0, 8));
        updateStep(job, 'git-push', 'success', sha.slice(0, 8));
        try {
            job.phase = 'deploy';
            job.result = await deploy.deploy(sha, (id, state, detail) => updateStep(job, id, state, detail));
            job.phase = 'complete';
            job.state = 'success';
        } catch (error) {
            job.state = 'error';
            job.error = error.message || String(error);
            const current = job.steps.find(step => step.state === 'running');
            if (current) updateStep(job, current.id, 'error', job.error);
        } finally {
            activeJobId = null;
            job.finishedAt = new Date().toISOString();
        }
    }

    async function startDeployOnly() {
        const workspace = await git.workspaceStatus({ fetch: true });
        if (!workspace.ready || workspace.ahead !== 0 || workspace.behind !== 0) {
            throw new Error(workspace.blockers?.join(' ') || 'Current HEAD is not synchronized with origin/main.');
        }
        const sha = await git.headSha();
        const job = createJob('deploy-only');
        void runDeployOnly(job, sha);
        return publicJob(job);
    }

    function getJob(id) {
        const job = jobs.get(id);
        if (!job) throw new Error('Publish task not found.');
        return publicJob(job);
    }

    return { prepare, startPublish, retryPush, startDeployOnly, getJob };
}
