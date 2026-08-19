import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import test from 'node:test';
import { createGitService, parsePorcelain } from '../src/gitService.js';

const execFileAsync = promisify(execFile);

async function git(cwd, args) {
    return execFileAsync('git', args, { cwd });
}

async function writeArticle(root, id, status, body) {
    const dir = path.join(root, 'mypage/content/articles', id);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.zh.md'), `---\nid: ${id}\ntitle: ${id}\nstatus: ${status}\n---\n${body}\n`);
}

async function makeRepository(t) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-git-'));
    const remote = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-remote-'));
    t.after(() => Promise.all([fs.rm(root, { recursive: true, force: true }), fs.rm(remote, { recursive: true, force: true })]));
    await git(remote, ['init', '--bare', '--initial-branch=main']);
    await git(root, ['init', '--initial-branch=main']);
    await git(root, ['config', 'user.name', 'Test']);
    await git(root, ['config', 'user.email', 'test@example.com']);
    await writeArticle(root, 'public-note', 'published', 'old');
    await writeArticle(root, 'existing-draft', 'draft', 'old draft');
    await fs.mkdir(path.join(root, 'mypage/data'), { recursive: true });
    await fs.mkdir(path.join(root, 'mypage/images'), { recursive: true });
    await fs.writeFile(path.join(root, 'mypage/data/articlesData.js'), 'old\n');
    await fs.writeFile(path.join(root, 'mypage/data/i18nData.js'), 'old\n');
    await fs.writeFile(path.join(root, 'mypage/data/projectsData.js'), 'old\n');
    await fs.writeFile(path.join(root, 'mypage/images/existing.png'), 'old\n');
    await git(root, ['add', '.']);
    await git(root, ['commit', '-m', 'baseline']);
    await git(root, ['remote', 'add', 'origin', remote]);
    await git(root, ['push', '-u', 'origin', 'main']);
    return root;
}

test('parses nul-delimited porcelain output', () => {
    assert.deepEqual(parsePorcelain(' M file.txt\0?? new.txt\0R  renamed.txt\0original.txt\0'), [
        { status: ' M', file: 'file.txt' },
        { status: '??', file: 'new.txt' },
        { status: 'R ', file: 'renamed.txt', originalFile: 'original.txt' }
    ]);
});

test('publishes public article changes but excludes pure drafts and unrelated files', async t => {
    const root = await makeRepository(t);
    await writeArticle(root, 'public-note', 'published', 'new public body');
    await writeArticle(root, 'existing-draft', 'draft', 'new private body');
    await fs.mkdir(path.join(root, '.claude'), { recursive: true });
    await fs.writeFile(path.join(root, '.claude/local.txt'), 'local');
    await fs.writeFile(path.join(root, 'mypage/data/articlesData.js'), 'new\n');
    await fs.writeFile(path.join(root, 'mypage/data/projectsData.js'), 'project change\n');
    await fs.writeFile(path.join(root, 'mypage/images/new-project.png'), 'image');
    await fs.mkdir(path.join(root, 'mypage/content/projects/new-project/assets'), { recursive: true });
    await fs.writeFile(path.join(root, 'mypage/content/projects/new-project/assets/guide.pdf'), 'attachment');

    const service = createGitService({ repoRoot: root });
    const status = await service.workspaceStatus();
    assert.equal(status.ready, true);
    assert(status.publishableFiles.some(file => file.file.includes('public-note')));
    assert(status.publishableFiles.some(file => file.file === 'mypage/data/projectsData.js'));
    assert(status.publishableFiles.some(file => file.file === 'mypage/images/new-project.png'));
    assert(status.publishableFiles.some(file => file.file === 'mypage/content/projects/new-project/assets/guide.pdf'));
    assert(status.publishFiles.includes('mypage/content/articles/public-note/index.zh.md'));
    assert(!status.publishFiles.some(file => file.includes('existing-draft')));
    assert(status.draftFiles.some(file => file.file.includes('existing-draft')));
    assert(!status.publishableFiles.some(file => file.file.includes('.claude')));

    await fs.writeFile(path.join(root, 'unrelated.txt'), 'staged');
    await git(root, ['add', 'unrelated.txt']);
    const blocked = await service.workspaceStatus();
    assert.equal(blocked.ready, false);
    assert.match(blocked.blockers.join(' '), /staged files/);
});

test('blocks an older unpushed local commit', async t => {
    const root = await makeRepository(t);
    await fs.writeFile(path.join(root, 'local.txt'), 'commit');
    await git(root, ['add', 'local.txt']);
    await git(root, ['commit', '-m', 'local only']);
    const status = await createGitService({ repoRoot: root }).workspaceStatus();
    assert.equal(status.ahead, 1);
    assert.equal(status.ready, false);
});
