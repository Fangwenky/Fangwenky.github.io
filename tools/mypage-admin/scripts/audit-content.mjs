import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { articles } from '../../../mypage/data/articlesData.js';
import { articleTranslations } from '../../../mypage/data/i18nData.js';
import { articlesRoot, mypageRoot } from '../src/config.js';

const issues = [];
const ids = new Set();
const dirs = (await fs.readdir(articlesRoot, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

for (const article of articles) {
    if (ids.has(article.id)) issues.push(`Duplicate generated article id: ${article.id}`);
    ids.add(article.id);
    try {
        await fs.access(path.join(mypageRoot, article.image));
    } catch {
        issues.push(`Missing cover for ${article.id}: ${article.image}`);
    }
}

for (const dir of dirs) {
    const zhPath = path.join(articlesRoot, dir, 'index.zh.md');
    let zh;
    try {
        zh = matter(await fs.readFile(zhPath, 'utf8'));
    } catch {
        issues.push(`Missing Chinese article file: ${dir}/index.zh.md`);
        continue;
    }

    if (zh.data.id !== dir) {
        issues.push(`Article id mismatch: folder "${dir}" contains "${zh.data.id}"`);
    }
    if (zh.data.status === 'published' && !ids.has(dir)) {
        issues.push(`Published article is not generated: ${dir}`);
    }

    const enPath = path.join(articlesRoot, dir, 'index.en.md');
    try {
        const en = matter(await fs.readFile(enPath, 'utf8'));
        if (en.data.id !== dir) {
            issues.push(`English article id mismatch: folder "${dir}" contains "${en.data.id}"`);
        }
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
}

for (const article of articles) {
    if (!dirs.includes(article.id)) {
        issues.push(`Generated article has no content folder: ${article.id}`);
    }
}

for (const key of Object.keys(articleTranslations.en || {})) {
    if (!ids.has(key)) {
        issues.push(`English translation has no generated article: ${key}`);
    }
}

if (issues.length > 0) {
    console.error(issues.join('\n'));
    process.exitCode = 1;
} else {
    console.log(`Content audit passed: ${articles.length} generated articles, ${dirs.length} source folders.`);
}
