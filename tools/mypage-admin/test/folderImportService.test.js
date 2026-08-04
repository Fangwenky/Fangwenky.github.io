import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { importContentFolder, inspectFolderUpload } from '../src/folderImportService.js';
import { readArticle } from '../src/contentStore.js';
import { deleteProject, readProject } from '../src/projectStore.js';

function uploaded(relativePath, content) {
    return {
        relativePath,
        originalname: path.basename(relativePath),
        buffer: Buffer.isBuffer(content) ? content : Buffer.from(content)
    };
}

async function fixture(t) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-folder-import-'));
    const mypageRoot = path.join(root, 'mypage');
    const articlesRoot = path.join(mypageRoot, 'content', 'articles');
    const dataRoot = path.join(mypageRoot, 'data');
    await fs.mkdir(dataRoot, { recursive: true });
    await fs.writeFile(path.join(dataRoot, 'projectsData.js'), 'export const projects = [];\n');
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    return { root, mypageRoot, articlesRoot, dataRoot };
}

test('imports an article folder, rewrites Markdown links, and keeps it as a draft', async t => {
    const roots = await fixture(t);
    const files = [
        uploaded('文章文件夹/note.md', `---
id: imported-note
title: 文件夹导入测试
category: 学习笔记
tags: [Markdown, 导入]
cover: 图片和附件/封面 图.png
---
# 文件夹导入测试

这是可以用作摘要的第一段内容。

![封面](<图片和附件/封面 图.png>)
[下载资料](图片和附件/资料.pdf)
`),
        uploaded('文章文件夹/图片和附件/封面 图.png', Buffer.from([0x89, 0x50, 0x4e, 0x47])),
        uploaded('文章文件夹/图片和附件/资料.pdf', '%PDF-test')
    ];

    const result = await importContentFolder('article', files, roots);
    const article = await readArticle(result.id, { root: roots.articlesRoot });

    assert.equal(result.id, 'imported-note');
    assert.equal(result.assetCount, 2);
    assert.equal(article.zh.frontmatter.status, 'draft');
    assert.equal(article.zh.frontmatter.cover, 'content/articles/imported-note/assets/%E5%B0%81%E9%9D%A2%20%E5%9B%BE.png');
    assert.match(article.zh.body, /content\/articles\/imported-note\/assets\/%E5%B0%81%E9%9D%A2%20%E5%9B%BE\.png/);
    assert.match(article.zh.body, /content\/articles\/imported-note\/assets\/%E8%B5%84%E6%96%99\.pdf/);
    assert.equal(await fs.readFile(path.join(roots.articlesRoot, 'imported-note', 'assets', '资料.pdf'), 'utf8'), '%PDF-test');
});

test('imports a project folder and removes its private assets with the project', async t => {
    const roots = await fixture(t);
    const files = [
        uploaded(`项目文件夹/project.md`, `---
id: folder-project
title: 文件夹项目
description: 从 Markdown 文件夹导入的项目
image: 图片和附件/cover.png
category: Web
tags: [Node.js]
---
# 文件夹项目

![截图](图片和附件/cover.png)
`),
        uploaded('项目文件夹/图片和附件/cover.png', Buffer.from([0x89, 0x50, 0x4e, 0x47]))
    ];

    const result = await importContentFolder('project', files, roots);
    const project = await readProject(result.id, { dataRoot: roots.dataRoot });
    const assetPath = path.join(roots.mypageRoot, 'content', 'projects', result.id, 'assets', 'cover.png');

    assert.equal(project.image, 'content/projects/folder-project/assets/cover.png');
    assert.match(project.content, /content\/projects\/folder-project\/assets\/cover\.png/);
    assert.equal((await fs.stat(assetPath)).isFile(), true);

    await deleteProject(result.id, { dataRoot: roots.dataRoot, mypageRoot: roots.mypageRoot });
    await assert.rejects(fs.access(assetPath), error => error.code === 'ENOENT');
});

test('rejects ambiguous folders and unsafe attachment types', () => {
    assert.throws(() => inspectFolderUpload([
        uploaded('folder/one.md', '# one'),
        uploaded('folder/two.md', '# two')
    ]), /exactly one \.md/);

    assert.throws(() => inspectFolderUpload([
        uploaded('folder/one.md', '# one'),
        uploaded('folder/图片和附件/page.html', '<script>alert(1)</script>')
    ]), /Unsupported attachment type/);
});
