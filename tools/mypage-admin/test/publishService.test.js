import assert from 'node:assert/strict';
import test from 'node:test';
import { createPublishService } from '../src/publishService.js';

function workspace() {
    return {
        ready: true,
        blockers: [],
        branch: 'main',
        publishIds: ['note'],
        publishPaths: ['mypage/content/articles/note', 'mypage/data/articlesData.js'],
        publishableFiles: [{ status: ' M', file: 'mypage/content/articles/note/index.zh.md' }],
        draftFiles: [{ status: ' M', file: 'mypage/content/articles/draft/index.zh.md' }]
    };
}

async function waitForJob(service, id) {
    for (let index = 0; index < 50; index += 1) {
        const job = service.getJob(id);
        if (['success', 'error'].includes(job.state)) return job;
        await new Promise(resolve => setTimeout(resolve, 5));
    }
    throw new Error('job timeout');
}

test('prepares a fingerprinted release and runs commit, push, deploy in order', async () => {
    const calls = [];
    const git = {
        workspaceStatus: async () => workspace(),
        diffSummary: async () => [{ status: ' M', file: 'note.md', added: 2, deleted: 1 }],
        fingerprint: async () => 'same',
        stage: async paths => { calls.push(['stage', paths]); return ['mypage/content/articles/note/index.zh.md']; },
        unstage: async () => {},
        commit: async () => { calls.push(['commit']); return '1234567890abcdef'; },
        push: async () => { calls.push(['push']); },
        headSha: async () => '1234567890abcdef'
    };
    const deploy = { deploy: async sha => { calls.push(['deploy', sha]); return { sha }; } };
    const service = createPublishService({ gitService: git, deployService: deploy, generate: async () => ({ articleCount: 1 }), audit: async () => {} });
    const prepared = await service.prepare();
    assert.equal(prepared.ready, true);
    assert.equal(prepared.excludedDraftFiles.length, 1);
    const started = service.startPublish({ confirmationId: prepared.confirmationId, title: 'Note' });
    const job = await waitForJob(service, started.id);
    assert.equal(job.state, 'success');
    assert.deepEqual(calls.map(call => call[0]), ['stage', 'commit', 'push', 'deploy']);
});

test('rejects a confirmation when files changed after preview', async () => {
    let fingerprint = 'before';
    const git = {
        workspaceStatus: async () => workspace(),
        diffSummary: async () => [],
        fingerprint: async () => fingerprint,
        stage: async () => { throw new Error('should not stage'); },
        unstage: async () => {},
        commit: async () => '',
        push: async () => {},
        headSha: async () => ''
    };
    const service = createPublishService({ gitService: git, deployService: { deploy: async () => ({}) }, generate: async () => ({}), audit: async () => {} });
    const prepared = await service.prepare();
    fingerprint = 'after';
    const started = service.startPublish({ confirmationId: prepared.confirmationId, title: 'Changed' });
    const job = await waitForJob(service, started.id);
    assert.equal(job.state, 'error');
    assert.match(job.error, /changed after the publish preview/);
});

test('unstages the exact publishing scope when commit fails', async () => {
    let unstaged = [];
    const git = {
        workspaceStatus: async () => workspace(),
        diffSummary: async () => [],
        fingerprint: async () => 'same',
        stage: async () => ['mypage/content/articles/note/index.zh.md'],
        unstage: async paths => { unstaged = paths; },
        commit: async () => { throw new Error('commit failed'); },
        push: async () => {},
        headSha: async () => ''
    };
    const service = createPublishService({ gitService: git, deployService: { deploy: async () => ({}) }, generate: async () => ({}), audit: async () => {} });
    const prepared = await service.prepare();
    const started = service.startPublish({ confirmationId: prepared.confirmationId, title: 'Broken' });
    const job = await waitForJob(service, started.id);
    assert.equal(job.state, 'error');
    assert.deepEqual(unstaged, workspace().publishPaths);
});
