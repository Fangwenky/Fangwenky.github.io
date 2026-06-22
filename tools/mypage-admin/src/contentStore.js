import fs from 'node:fs/promises';
import path from 'node:path';
import { articlesRoot } from './config.js';
import { parseFrontmatter, stringifyFrontmatter } from './frontmatter.js';
import { renderMarkdown as renderMarkdownSafe } from './markdown.js';

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

export function normalizeArticleId(value = '') {
    return slugify(value);
}

export function normalizeTags(tags) {
    if (Array.isArray(tags)) return tags.map(tag => String(tag).trim()).filter(Boolean);
    if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim()).filter(Boolean);
    return [];
}

export function articleDir(id, root = articlesRoot) {
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
        throw new Error('Article id can only contain letters, numbers, hyphen, and underscore.');
    }
    return path.join(root, id);
}

export function markdownPath(id, lang, root = articlesRoot) {
    return path.join(articleDir(id, root), `index.${lang}.md`);
}

export function assetsDir(id, root = articlesRoot) {
    return path.join(articleDir(id, root), 'assets');
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

export async function ensureContentRoot(root = articlesRoot) {
    await fs.mkdir(root, { recursive: true });
}

export async function listArticleIds(root = articlesRoot) {
    await ensureContentRoot(root);
    const entries = await fs.readdir(root, { withFileTypes: true });
    return entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
}

export async function readLanguageFile(id, lang, root = articlesRoot) {
    try {
        const raw = await fs.readFile(markdownPath(id, lang, root), 'utf8');
        const parsed = parseFrontmatter(raw);
        const frontmatter = normalizeFrontmatter(parsed.data, id);
        if (frontmatter.id !== id) {
            throw new Error(`Article id mismatch: folder "${id}" contains "${frontmatter.id}".`);
        }
        return {
            exists: true,
            lang,
            frontmatter,
            body: parsed.content.trim()
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { exists: false, lang, frontmatter: null, body: '' };
        }
        throw error;
    }
}

export async function readArticle(id, options = {}) {
    const root = options.root || articlesRoot;
    const zh = await readLanguageFile(id, 'zh', root);
    if (!zh.exists) throw new Error(`Article ${id} is missing index.zh.md.`);
    const en = await readLanguageFile(id, 'en', root);
    return { id, zh, en };
}

export async function listArticles(options = {}) {
    const root = options.root || articlesRoot;
    const ids = await listArticleIds(root);
    const articles = [];
    for (const id of ids) {
        try {
            const article = await readArticle(id, { root });
            articles.push({
                id,
                title: article.zh.frontmatter.title,
                date: article.zh.frontmatter.date,
                status: article.zh.frontmatter.status,
                tags: article.zh.frontmatter.tags,
                category: article.zh.frontmatter.category,
                hasEnglishMeta: article.en.exists,
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
    const zhBody = String(payload.zh?.body || payload.body || '').trim();
    const enBody = String(payload.en?.body || '').trim();
    const en = Object.keys(enSource).length > 0
        ? normalizeFrontmatter({ ...zh, ...enSource, id: zh.id }, zh.id)
        : null;

    if (en && enBody) {
        en.title = en.title || zh.title;
        en.excerpt = en.excerpt || zh.excerpt;
        en.category = en.category || zh.category;
        en.tags = en.tags.length > 0 ? en.tags : zh.tags;
        en.readTime = en.readTime || zh.readTime;
    }

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

export async function saveArticle(payload, options = {}) {
    const root = options.root || articlesRoot;
    const { zh, en, zhBody, enBody } = validateArticlePayload(payload);
    const originalId = String(payload.originalId || '').trim();
    if (originalId && originalId !== zh.id) {
        throw new Error('Article ID is locked after the first save.');
    }
    const dir = articleDir(zh.id, root);
    if (!originalId) {
        try {
            await fs.access(markdownPath(zh.id, 'zh', root));
            throw new Error(`Article ID "${zh.id}" already exists.`);
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
    }
    await fs.mkdir(dir, { recursive: true });
    await fs.mkdir(path.join(dir, 'assets'), { recursive: true });

    await fs.writeFile(markdownPath(zh.id, 'zh', root), stringifyFrontmatter(`${zhBody}\n`, pickFrontmatter(zh)), 'utf8');

    if (en && (enBody || en.title || en.excerpt)) {
        await fs.writeFile(markdownPath(zh.id, 'en', root), stringifyFrontmatter(`${enBody}\n`, pickFrontmatter(en)), 'utf8');
    } else {
        await fs.rm(markdownPath(zh.id, 'en', root), { force: true });
    }

    return readArticle(zh.id, { root });
}

export async function deleteArticle(id, options = {}) {
    await fs.rm(articleDir(id, options.root || articlesRoot), { recursive: true, force: true });
}

export async function renderMarkdown(markdown) {
    return renderMarkdownSafe(markdown);
}

export function estimateReadTime(markdown, lang = 'zh') {
    const text = String(markdown || '').replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`[\]()!-]/g, ' ');
    const words = lang === 'zh'
        ? text.replace(/\s+/g, '').length / 2
        : text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return lang === 'zh' ? `${minutes} 分钟阅读` : `${minutes} min read`;
}
