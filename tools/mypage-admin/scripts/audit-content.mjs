import fs from 'node:fs/promises';
import path from 'node:path';
import { parseFrontmatter } from '../src/frontmatter.js';
import { articles } from '../../../mypage/data/articlesData.js';
import { articleTranslations } from '../../../mypage/data/i18nData.js';
import { projects } from '../../../mypage/data/projectsData.js';
import { articlesRoot, mypageRoot } from '../src/config.js';

const issues = [];
const ids = new Set();
const projectIds = new Set();
const publicFilePath = value => {
    const decoded = decodeURIComponent(String(value || ''));
    const resolved = path.resolve(mypageRoot, decoded);
    if (resolved !== mypageRoot && !resolved.startsWith(`${mypageRoot}${path.sep}`)) {
        throw new Error('Path escapes the public site root.');
    }
    return { decoded, resolved };
};
const dirs = (await fs.readdir(articlesRoot, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

for (const article of articles) {
    if (ids.has(article.id)) issues.push(`Duplicate generated article id: ${article.id}`);
    ids.add(article.id);
    try {
        await fs.access(publicFilePath(article.image).resolved);
    } catch {
        issues.push(`Missing cover for ${article.id}: ${article.image}`);
    }
}

for (const dir of dirs) {
    const zhPath = path.join(articlesRoot, dir, 'index.zh.md');
    let zh;
    try {
        zh = parseFrontmatter(await fs.readFile(zhPath, 'utf8'));
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
        const en = parseFrontmatter(await fs.readFile(enPath, 'utf8'));
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

for (const project of projects) {
    if (projectIds.has(project.id)) issues.push(`Duplicate project id: ${project.id}`);
    projectIds.add(project.id);

    for (const field of ['id', 'title', 'description', 'image', 'category', 'date', 'content']) {
        if (!String(project[field] || '').trim()) issues.push(`Missing project field "${field}": ${project.id || '(unknown id)'}`);
    }

    if (project.id && !/^[a-zA-Z0-9_-]+$/.test(project.id)) {
        issues.push(`Invalid project id: ${project.id}`);
    }
    if (!['html', 'markdown'].includes(project.contentType)) {
        issues.push(`Invalid project content type for ${project.id}: ${project.contentType}`);
    }
    let projectImage;
    try {
        projectImage = publicFilePath(project.image);
    } catch {
        projectImage = { decoded: '', resolved: '' };
    }
    const sharedImage = /^images\/[^/]+\.(png|jpe?g|webp|gif|svg)$/i.test(projectImage.decoded);
    const privatePrefix = `content/projects/${project.id}/assets/`;
    const privateRelative = projectImage.decoded.startsWith(privatePrefix) ? projectImage.decoded.slice(privatePrefix.length) : '';
    const privateImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(privateRelative)
        && privateRelative.split('/').every(segment => segment && segment !== '.' && segment !== '..');
    if (!sharedImage && !privateImage) {
        issues.push(`Invalid project image path for ${project.id}: ${project.image}`);
    }

    try {
        await fs.access(projectImage.resolved);
    } catch {
        issues.push(`Missing project image for ${project.id}: ${project.image}`);
    }

    if (project.link && project.link !== '#' && !project.link.startsWith('/') && !project.link.startsWith('./')) {
        try {
            const url = new URL(project.link);
            if (!['http:', 'https:'].includes(url.protocol)) throw new Error('invalid protocol');
        } catch {
            issues.push(`Invalid project link for ${project.id}: ${project.link}`);
        }
    }
}

if (issues.length > 0) {
    console.error(issues.join('\n'));
    process.exitCode = 1;
} else {
    console.log(`Content audit passed: ${articles.length} generated articles, ${dirs.length} source folders, ${projects.length} projects.`);
}
