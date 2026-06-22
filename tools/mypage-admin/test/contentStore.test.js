import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { deleteArticle, readArticle, saveArticle } from '../src/contentStore.js';
import { generateStaticData } from '../src/staticGenerator.js';

function payload(id, status = 'draft') {
    return {
        id,
        originalId: '',
        zh: {
            frontmatter: {
                id,
                title: `标题 ${id}`,
                excerpt: '摘要',
                date: '2026-06-22',
                tags: ['AI'],
                category: '学习笔记',
                cover: 'images/cover.svg',
                readTime: '3 分钟阅读',
                status,
                featured: true,
                updatedAt: '2026-06-22T00:00:00.000Z'
            },
            body: '# 正文\n\n内容'
        },
        en: null
    };
}

test('saves Markdown, keeps English optional, and locks an existing id', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-content-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));

    const saved = await saveArticle(payload('locked-id'), { root });
    assert.equal(saved.zh.frontmatter.featured, true);
    assert.equal(saved.en.exists, false);
    await assert.rejects(saveArticle(payload('locked-id'), { root }), /already exists/);
    await assert.rejects(
        saveArticle({ ...payload('new-id'), originalId: 'locked-id' }, { root }),
        /locked/
    );

    await deleteArticle('locked-id', { root });
    await assert.rejects(readArticle('locked-id', { root }), /missing index\.zh\.md/);
});

test('static generation publishes only published sources', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-generate-'));
    const articlesRoot = path.join(root, 'articles');
    const dataRoot = path.join(root, 'data');
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await fs.mkdir(dataRoot, { recursive: true });
    await fs.writeFile(path.join(dataRoot, 'i18nData.js'), 'export const uiText = {};\n\nexport const articleTranslations = { en: {} };\n');

    await saveArticle(payload('public-note', 'published'), { root: articlesRoot });
    await saveArticle(payload('private-draft', 'draft'), { root: articlesRoot });
    const result = await generateStaticData({ articlesRoot, dataRoot });
    const generated = await fs.readFile(path.join(dataRoot, 'articlesData.js'), 'utf8');

    assert.equal(result.articleCount, 1);
    assert.match(generated, /public-note/);
    assert.doesNotMatch(generated, /private-draft/);
});
