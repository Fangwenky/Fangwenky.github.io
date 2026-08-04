import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
    articleDir,
    estimateReadTime,
    normalizeTags as normalizeArticleTags,
    saveArticle,
    slugify
} from './contentStore.js';
import { articlesRoot, dataRoot, mypageRoot } from './config.js';
import { parseFrontmatter } from './frontmatter.js';
import {
    projectAssetsDir,
    readProjects,
    saveProject
} from './projectStore.js';

const ASSET_FOLDER = '图片和附件';
const allowedAssetExtensions = new Set([
    '.png', '.jpg', '.jpeg', '.webp', '.gif',
    '.pdf', '.txt', '.csv', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.zip', '.rar', '.7z', '.tar', '.gz',
    '.mp3', '.m4a', '.wav', '.mp4', '.mov'
]);
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const maxTotalBytes = 100 * 1024 * 1024;

function normalizedPath(value) {
    const result = String(value || '').normalize('NFC').replaceAll('\\', '/').replace(/^\.\//, '');
    const segments = result.split('/');
    if (!result || result.startsWith('/') || segments.some(segment => !segment || segment === '.' || segment === '..' || segment.includes('\0'))) {
        throw new Error(`Invalid folder path: ${value || '(empty)'}`);
    }
    return segments.join('/');
}

function stripSelectedFolder(paths) {
    const split = paths.map(value => normalizedPath(value).split('/'));
    const rootName = split[0]?.[0] || '';
    const hasBrowserRoot = split.every(parts => parts.length > 1 && parts[0] === rootName);
    return {
        folderName: hasBrowserRoot ? rootName : '',
        paths: split.map(parts => (hasBrowserRoot ? parts.slice(1) : parts).join('/'))
    };
}

function safeAssetRelativePath(value) {
    const relative = normalizedPath(value);
    const extension = path.posix.extname(relative).toLowerCase();
    if (!allowedAssetExtensions.has(extension)) {
        throw new Error(`Unsupported attachment type: ${relative}. Please use images, PDF, Office files, archives, audio, video, TXT, or CSV.`);
    }
    if (relative.split('/').some(segment => segment.startsWith('.'))) {
        throw new Error(`Hidden attachment paths are not allowed: ${relative}`);
    }
    return relative;
}

export function inspectFolderUpload(files = []) {
    if (!Array.isArray(files) || files.length === 0) throw new Error('The selected folder is empty.');
    const visible = files.filter(file => {
        const relativePath = String(file.relativePath || file.originalname || '');
        return !relativePath.split(/[\\/]/).some(part => part === '.DS_Store' || part === '__MACOSX');
    });
    if (visible.length === 0) throw new Error('The selected folder does not contain importable files.');

    const totalBytes = visible.reduce((sum, file) => sum + Number(file.buffer?.length || file.size || 0), 0);
    if (totalBytes > maxTotalBytes) throw new Error('The folder exceeds the 100 MB total upload limit.');

    const stripped = stripSelectedFolder(visible.map(file => file.relativePath || file.originalname));
    const normalizedFiles = visible.map((file, index) => ({ ...file, importPath: stripped.paths[index] }));
    const markdownFiles = normalizedFiles.filter(file => !file.importPath.includes('/') && path.posix.extname(file.importPath).toLowerCase() === '.md');
    if (markdownFiles.length !== 1) {
        throw new Error('The folder must contain exactly one .md file at its top level.');
    }

    const unexpected = normalizedFiles.filter(file => file !== markdownFiles[0] && !file.importPath.startsWith(`${ASSET_FOLDER}/`));
    if (unexpected.length) {
        throw new Error(`Files other than the top-level .md must be inside "${ASSET_FOLDER}": ${unexpected[0].importPath}`);
    }

    const seen = new Set();
    const assets = normalizedFiles
        .filter(file => file !== markdownFiles[0])
        .map(file => {
            const relativePath = safeAssetRelativePath(file.importPath.slice(ASSET_FOLDER.length + 1));
            if (seen.has(relativePath)) throw new Error(`Duplicate attachment path: ${relativePath}`);
            seen.add(relativePath);
            return { relativePath, buffer: file.buffer };
        });

    return {
        folderName: stripped.folderName,
        markdownName: markdownFiles[0].importPath,
        markdown: markdownFiles[0].buffer.toString('utf8'),
        assets
    };
}

function markdownTitle(markdown, fallback) {
    const heading = String(markdown).match(/^#\s+(.+)$/m)?.[1];
    return String(heading || fallback || '').replace(/[*_`~]/g, '').trim();
}

function plainMarkdown(markdown) {
    return String(markdown || '')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
        .replace(/^#{1,6}\s+.+$/gm, ' ')
        .replace(/^\s*(?:[-*>]|\d+\.)\s+/gm, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[*_`~|]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function inferredExcerpt(markdown) {
    const text = plainMarkdown(markdown);
    return text.length > 160 ? `${text.slice(0, 157)}...` : text || '导入的 Markdown 内容';
}

function normalizedDate(value) {
    if (value instanceof Date && !Number.isNaN(value.valueOf())) return value.toISOString().slice(0, 10);
    const string = String(value || '').trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(string) ? string : new Date().toISOString().slice(0, 10);
}

function inferredId(value, kind, markdown) {
    const requested = String(value || '').trim();
    if (/^[a-zA-Z0-9_-]+$/.test(requested)) return requested;
    const ascii = requested.toLowerCase().match(/[a-z0-9]+/g)?.join('-');
    if (ascii) return ascii.slice(0, 80);
    const digest = crypto.createHash('sha256').update(markdown).digest('hex').slice(0, 8);
    return `${kind}-${new Date().toISOString().slice(0, 10)}-${digest}`;
}

function publicAssetPath(kind, id, relativePath) {
    const encoded = relativePath.split('/').map(encodeURIComponent).join('/');
    return `content/${kind === 'article' ? 'articles' : 'projects'}/${id}/assets/${encoded}`;
}

function localAssetReference(destination) {
    let value = String(destination || '').trim().replace(/^<|>$/g, '');
    try {
        value = decodeURIComponent(value);
    } catch (error) {
        // Keep the source spelling so a malformed external URL is not rewritten.
    }
    value = value.normalize('NFC').replaceAll('\\', '/').replace(/^\.\//, '');
    return value.startsWith(`${ASSET_FOLDER}/`) ? value.slice(ASSET_FOLDER.length + 1) : null;
}

function rewriteImportedAssetDestination(destination, kind, id, paths) {
    const relative = localAssetReference(destination);
    if (relative === null) return destination;
    if (!paths.has(relative)) throw new Error(`Markdown references a missing attachment: ${ASSET_FOLDER}/${relative}`);
    return publicAssetPath(kind, id, relative);
}

export function rewriteImportedAssetLinks(markdown, kind, id, assets) {
    const paths = new Set(assets.map(asset => asset.relativePath));
    const rewrite = destination => rewriteImportedAssetDestination(destination, kind, id, paths);

    return String(markdown)
        .replace(/(!?\[[^\]]*]\()\s*(<[^>]+>|[^)\s]+)([^)]*\))/g, (match, start, destination, end) => `${start}${rewrite(destination)}${end}`)
        .replace(/^(\s*\[[^\]]+]:\s*)(<[^>]+>|\S+)/gm, (match, start, destination) => `${start}${rewrite(destination)}`);
}

async function writeAssets(dir, assets) {
    for (const asset of assets) {
        const target = path.join(dir, ...asset.relativePath.split('/'));
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, asset.buffer);
    }
}

function firstImage(assets) {
    return assets.find(asset => imageExtensions.has(path.posix.extname(asset.relativePath).toLowerCase()));
}

async function articleIdAvailable(id, root) {
    try {
        await fs.access(articleDir(id, root));
        return false;
    } catch (error) {
        if (error.code === 'ENOENT') return true;
        throw error;
    }
}

async function availableArticleId(baseId, root, explicit) {
    if (await articleIdAvailable(baseId, root)) return baseId;
    if (explicit) throw new Error(`Article ID "${baseId}" already exists.`);
    for (let suffix = 2; suffix < 1000; suffix += 1) {
        const candidate = `${baseId}-${suffix}`;
        if (await articleIdAvailable(candidate, root)) return candidate;
    }
    throw new Error(`Could not create a unique article ID for "${baseId}".`);
}

async function availableProjectId(baseId, root, explicit) {
    let projects;
    try {
        projects = await readProjects({ dataRoot: root });
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        projects = [];
    }
    const ids = new Set(projects.map(project => project.id));
    if (!ids.has(baseId)) return baseId;
    if (explicit) throw new Error(`Project ID "${baseId}" already exists.`);
    for (let suffix = 2; suffix < 1000; suffix += 1) {
        const candidate = `${baseId}-${suffix}`;
        if (!ids.has(candidate)) return candidate;
    }
    throw new Error(`Could not create a unique project ID for "${baseId}".`);
}

export async function importContentFolder(mode, files, options = {}) {
    if (!['article', 'project'].includes(mode)) throw new Error('Import mode must be article or project.');
    const source = inspectFolderUpload(files);
    const parsed = parseFrontmatter(source.markdown);
    const rawBody = parsed.content.trim();
    if (!rawBody) throw new Error('The Markdown body is empty.');
    const title = String(parsed.data.title || markdownTitle(rawBody, path.basename(source.markdownName, '.md') || source.folderName)).trim();
    const idSource = parsed.data.id || title || source.folderName;
    const explicitId = Boolean(parsed.data.id);
    const rootArticles = options.articlesRoot || articlesRoot;
    const rootData = options.dataRoot || dataRoot;
    const rootMypage = options.mypageRoot || mypageRoot;
    const baseId = inferredId(slugify(idSource), mode, rawBody);
    const id = mode === 'article'
        ? await availableArticleId(baseId, rootArticles, explicitId)
        : await availableProjectId(baseId, rootData, explicitId);
    const body = rewriteImportedAssetLinks(rawBody, mode, id, source.assets);
    const image = firstImage(source.assets);
    const importedCover = rewriteImportedAssetDestination(
        String(parsed.data.cover || parsed.data.image || ''),
        mode,
        id,
        new Set(source.assets.map(asset => asset.relativePath))
    );
    const cover = importedCover || (image ? publicAssetPath(mode, id, image.relativePath) : 'images/avatar.jpg');
    const warnings = image ? [] : ['未找到可用图片，已使用默认头像作为封面。'];

    if (mode === 'article') {
        const targetDir = articleDir(id, rootArticles);
        let articleSaved = false;
        try {
            const article = await saveArticle({
                id,
                originalId: '',
                zh: {
                    frontmatter: {
                        id,
                        title,
                        excerpt: String(parsed.data.excerpt || parsed.data.description || inferredExcerpt(rawBody)).trim(),
                        date: normalizedDate(parsed.data.date),
                        tags: normalizeArticleTags(parsed.data.tags).length ? normalizeArticleTags(parsed.data.tags) : ['导入'],
                        category: String(parsed.data.category || '未分类').trim(),
                        cover,
                        readTime: String(parsed.data.readTime || estimateReadTime(body, 'zh')).trim(),
                        status: 'draft',
                        featured: Boolean(parsed.data.featured),
                        updatedAt: new Date().toISOString()
                    },
                    body
                },
                en: null
            }, { root: rootArticles });
            articleSaved = true;
            await writeAssets(path.join(targetDir, 'assets'), source.assets);
            return { mode, id, title, assetCount: source.assets.length, warnings, content: article };
        } catch (error) {
            if (articleSaved) await fs.rm(targetDir, { recursive: true, force: true });
            throw error;
        }
    }

    const assetDir = projectAssetsDir(id, rootMypage);
    try {
        await writeAssets(assetDir, source.assets);
        const project = await saveProject({
            id,
            originalId: '',
            title,
            description: String(parsed.data.description || parsed.data.excerpt || inferredExcerpt(rawBody)).trim(),
            image: cover,
            tags: normalizeArticleTags(parsed.data.tags).length ? normalizeArticleTags(parsed.data.tags) : ['导入'],
            link: String(parsed.data.link || '').trim(),
            category: String(parsed.data.category || '项目').trim(),
            date: normalizedDate(parsed.data.date),
            contentType: 'markdown',
            content: body
        }, { dataRoot: rootData });
        return { mode, id, title, assetCount: source.assets.length, warnings, content: project };
    } catch (error) {
        await fs.rm(assetDir, { recursive: true, force: true });
        throw error;
    }
}

export { ASSET_FOLDER, allowedAssetExtensions };
