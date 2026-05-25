import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { articlesRoot } from './config.js';

const REQUIRED_FIELDS = ['id', 'title', 'excerpt', 'date', 'tags', 'category', 'cover', 'readTime', 'status'];
const OPTIONAL_FIELDS = ['featured', 'updatedAt'];

export function slugify(value = '') {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/['"]/g, '')
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || `article-${Date.now()}`;
}

export function normalizeTags(tags) {
    if (Array.isArray(tags)) return tags.map(tag => String(tag).trim()).filter(Boolean);
    if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim()).filter(Boolean);
    return [];
}

export function articleDir(id) {
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
        throw new Error('Article id can only contain letters, numbers, hyphen, and underscore.');
    }
    return path.join(articlesRoot, id);
}

export function markdownPath(id, lang) {
    return path.join(articleDir(id), `index.${lang}.md`);
}

export function assetsDir(id) {
    return path.join(articleDir(id), 'assets');
}

export function normalizeFrontmatter(data = {}, fallbackId = '') {
    const id = slugify(data.id || fallbackId);
    return {
        id,
        title: String(data.title || '').trim(),
        excerpt: String(data.excerpt || '').trim(),
        date: String(data.date || new Date().toISOString().slice(0, 10)).trim(),
        tags: normalizeTags(data.tags),
        category: String(data.category || '').trim(),
        cover: String(data.cover || '').trim(),
        readTime: String(data.readTime || '').trim(),
        status: data.status === 'published' ? 'published' : 'draft',
        featured: Boolean(data.featured),
        updatedAt: String(data.updatedAt || new Date().toISOString()).trim()
    };
}

export function pickFrontmatter(data) {
    const picked = {};
    [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].forEach(key => {
        if (data[key] !== undefined) picked[key] = data[key];
    });
    return picked;
}

export async function ensureContentRoot() {
    await fs.mkdir(articlesRoot, { recursive: true });
}

export async function listArticleIds() {
    await ensureContentRoot();
    const entries = await fs.readdir(articlesRoot, { withFileTypes: true });
    return entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
}

export async function readLanguageFile(id, lang) {
    try {
        const raw = await fs.readFile(markdownPath(id, lang), 'utf8');
        const parsed = matter(raw);
        return {
            exists: true,
            lang,
            frontmatter: normalizeFrontmatter(parsed.data, id),
            body: parsed.content.trim()
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { exists: false, lang, frontmatter: null, body: '' };
        }
        throw error;
    }
}

export async function readArticle(id) {
    const zh = await readLanguageFile(id, 'zh');
    if (!zh.exists) throw new Error(`Article ${id} is missing index.zh.md.`);
    const en = await readLanguageFile(id, 'en');
    return { id, zh, en };
}

export async function listArticles() {
    const ids = await listArticleIds();
    const articles = [];
    for (const id of ids) {
        try {
            const article = await readArticle(id);
            articles.push({
                id,
                title: article.zh.frontmatter.title,
                date: article.zh.frontmatter.date,
                status: article.zh.frontmatter.status,
                tags: article.zh.frontmatter.tags,
                category: article.zh.frontmatter.category,
                hasEnglish: article.en.exists && article.en.body.trim().length > 0,
                updatedAt: article.zh.frontmatter.updatedAt
            });
        } catch (error) {
            articles.push({ id, title: id, status: 'invalid', error: error.message });
        }
    }
    return articles.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

export function validateArticlePayload(payload) {
    const zh = normalizeFrontmatter(payload.zh?.frontmatter || payload.frontmatter || {}, payload.id);
    const enSource = payload.en?.frontmatter || {};
    const en = Object.keys(enSource).length > 0 ? normalizeFrontmatter({ ...zh, ...enSource, id: zh.id }, zh.id) : null;
    const zhBody = String(payload.zh?.body || payload.body || '').trim();
    const enBody = String(payload.en?.body || '').trim();

    const missing = [];
    ['id', 'title', 'excerpt', 'date', 'category', 'cover', 'readTime'].forEach(key => {
        if (!zh[key] || (Array.isArray(zh[key]) && zh[key].length === 0)) missing.push(key);
    });
    if (zh.tags.length === 0) missing.push('tags');
    if (!zhBody) missing.push('body');
    if (missing.length > 0) {
        throw new Error(`Missing required Chinese article fields: ${missing.join(', ')}`);
    }

    return { zh, en, zhBody, enBody };
}

export async function saveArticle(payload) {
    const { zh, en, zhBody, enBody } = validateArticlePayload(payload);
    const dir = articleDir(zh.id);
    await fs.mkdir(dir, { recursive: true });
    await fs.mkdir(path.join(dir, 'assets'), { recursive: true });

    await fs.writeFile(markdownPath(zh.id, 'zh'), matter.stringify(`${zhBody}\n`, pickFrontmatter(zh)), 'utf8');

    if (en && (enBody || en.title || en.excerpt)) {
        await fs.writeFile(markdownPath(zh.id, 'en'), matter.stringify(`${enBody}\n`, pickFrontmatter(en)), 'utf8');
    }

    return readArticle(zh.id);
}

export async function deleteArticle(id) {
    await fs.rm(articleDir(id), { recursive: true, force: true });
}

export async function renderMarkdown(markdown) {
    return marked.parse(String(markdown || ''));
}

export function estimateReadTime(markdown, lang = 'zh') {
    const text = String(markdown || '').replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`[\]()!-]/g, ' ');
    const words = lang === 'zh'
        ? text.replace(/\s+/g, '').length / 2
        : text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return lang === 'zh' ? `${minutes} 分钟阅读` : `${minutes} min read`;
}
