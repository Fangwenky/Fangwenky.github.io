import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import { articlesRoot, dataRoot } from './config.js';
import { listArticleIds, readArticle } from './contentStore.js';

function toJsString(value) {
    return JSON.stringify(value, null, 4);
}

function htmlFromMarkdown(markdown) {
    return marked.parse(String(markdown || '').trim());
}

function articleRecord(article) {
    const fm = article.zh.frontmatter;
    return {
        id: fm.id,
        title: fm.title,
        excerpt: fm.excerpt,
        date: fm.date,
        tags: fm.tags,
        image: fm.cover,
        readTime: fm.readTime,
        category: fm.category,
        type: 'html',
        content: htmlFromMarkdown(article.zh.body)
    };
}

function englishRecord(article) {
    if (!article.en.exists) return null;
    const fm = article.en.frontmatter;
    const record = {
        title: fm.title,
        excerpt: fm.excerpt,
        tags: fm.tags,
        category: fm.category,
        readTime: fm.readTime
    };
    if (article.en.body.trim()) {
        record.type = 'html';
        record.content = htmlFromMarkdown(article.en.body);
    }
    return record;
}

function replaceArticleTranslations(existing, generatedBlock) {
    const start = existing.indexOf('export const articleTranslations =');
    if (start === -1) {
        return `${existing.trim()}\n\n${generatedBlock}\n`;
    }
    return `${existing.slice(0, start).trimEnd()}\n\n${generatedBlock}\n`;
}

export async function generateStaticData() {
    await fs.mkdir(dataRoot, { recursive: true });
    const ids = await listArticleIds();
    const allArticles = [];
    const english = {};

    for (const id of ids) {
        const article = await readArticle(id);
        if (article.zh.frontmatter.status !== 'published') continue;
        allArticles.push(articleRecord(article));
        const en = englishRecord(article);
        if (en) english[id] = en;
    }

    allArticles.sort((a, b) => new Date(a.date) - new Date(b.date));

    const articlesData = `export const articles = ${toJsString(allArticles)};\n`;
    await fs.writeFile(path.join(dataRoot, 'articlesData.js'), articlesData, 'utf8');

    const i18nPath = path.join(dataRoot, 'i18nData.js');
    const existingI18n = await fs.readFile(i18nPath, 'utf8');
    const articleTranslationsBlock = `export const articleTranslations = ${toJsString({ en: english })};`;
    await fs.writeFile(i18nPath, replaceArticleTranslations(existingI18n, articleTranslationsBlock), 'utf8');

    return { articleCount: allArticles.length, englishCount: Object.keys(english).length, articlesRoot };
}
