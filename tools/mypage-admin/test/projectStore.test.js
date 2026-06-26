import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
    deleteProject,
    listProjectImages,
    listProjects,
    readProject,
    saveProject
} from '../src/projectStore.js';

function project(id) {
    return {
        id,
        originalId: '',
        title: `项目 ${id}`,
        description: '项目简介',
        image: 'images/project.png',
        tags: 'AI, Web',
        link: 'https://example.com',
        category: 'AI 应用',
        date: '2026-06-26',
        content: '## 项目详情\n\n内容'
    };
}

async function writeProjectsFile(root) {
    await fs.mkdir(root, { recursive: true });
    await fs.writeFile(path.join(root, 'projectsData.js'), `export const projects = [
        {
            id: 'old-project',
            title: '旧项目',
            description: '旧简介',
            image: 'images/old.png',
            tags: ['HTML'],
            link: '#',
            category: 'Web应用',
            date: '2025-01-01',
            content: \`
                <h2>旧详情</h2>
                <p>内容</p>
            \`
        }
    ];
`);
}

test('reads, saves, rewrites, and deletes projects', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-projects-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await writeProjectsFile(root);

    const initial = await listProjects({ dataRoot: root });
    assert.equal(initial.length, 1);
    assert.equal(initial[0].id, 'old-project');
    assert.equal(initial[0].contentType, 'html');

    const saved = await saveProject(project('new-project'), { dataRoot: root });
    assert.deepEqual(saved.tags, ['AI', 'Web']);
    assert.equal(saved.contentType, 'markdown');
    assert.equal(saved.content, '## 项目详情\n\n内容');
    const raw = await fs.readFile(path.join(root, 'projectsData.js'), 'utf8');
    assert.match(raw, /export const projects =/);
    assert.match(raw, /new-project/);
    assert.match(raw, /"contentType": "markdown"/);

    await assert.rejects(saveProject(project('new-project'), { dataRoot: root }), /already exists/);
    await assert.rejects(saveProject({ ...project('renamed'), originalId: 'new-project' }, { dataRoot: root }), /locked/);

    await deleteProject('new-project', { dataRoot: root });
    await assert.rejects(readProject('new-project', { dataRoot: root }), /not found/);
});

test('validates required fields and lists public images', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-project-images-'));
    const dataRoot = path.join(root, 'data');
    const imageRoot = path.join(root, 'images');
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await writeProjectsFile(dataRoot);
    await fs.mkdir(imageRoot, { recursive: true });
    await fs.writeFile(path.join(imageRoot, 'cover.png'), 'png');
    await fs.writeFile(path.join(imageRoot, 'notes.txt'), 'txt');

    await assert.rejects(saveProject({ ...project('bad-project'), title: '' }, { dataRoot }), /title/);
    const images = await listProjectImages({ mypageRoot: root });
    assert.deepEqual(images.map(image => image.path), ['images/cover.png']);
});
