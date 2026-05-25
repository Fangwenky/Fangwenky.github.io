import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import express from 'express';
import multer from 'multer';
import { marked } from 'marked';
import {
    adminToken,
    articlesRoot,
    defaultHost,
    defaultPort,
    managedPaths,
    mypageRoot,
    publicRoot,
    repoRoot
} from './config.js';
import {
    assetsDir,
    deleteArticle,
    estimateReadTime,
    listArticles,
    readArticle,
    saveArticle,
    slugify
} from './contentStore.js';
import { generateStaticData } from './staticGenerator.js';

const execFileAsync = promisify(execFile);
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

app.use(express.json({ limit: '2mb' }));
app.use('/mypage', express.static(mypageRoot));
app.use('/content', express.static(path.join(mypageRoot, 'content')));
app.use(express.static(publicRoot));

function requireToken(req, res, next) {
    const token = req.get('x-admin-token') || req.query.token;
    if (token !== adminToken) {
        res.status(401).json({ error: 'Invalid admin token.' });
        return;
    }
    next();
}

function asyncHandler(handler) {
    return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

async function git(args, options = {}) {
    return execFileAsync('git', args, { cwd: repoRoot, ...options });
}

function isManagedPath(filePath) {
    return managedPaths.some(prefix => filePath === prefix || filePath.startsWith(`${prefix}/`));
}

async function assertNoUnmanagedChanges() {
    const { stdout } = await git(['status', '--porcelain']);
    const changes = stdout.trim().split('\n').filter(Boolean).map(line => line.slice(3));
    const unmanaged = changes.filter(file => !isManagedPath(file));
    if (unmanaged.length > 0) {
        throw new Error(`Unrelated worktree changes block publishing: ${unmanaged.join(', ')}`);
    }
}

async function publishArticle(title) {
    await assertNoUnmanagedChanges();
    const generated = await generateStaticData();
    await execFileAsync('node', ['--check', 'mypage/data/articlesData.js'], { cwd: repoRoot });
    await execFileAsync('node', ['--check', 'mypage/data/i18nData.js'], { cwd: repoRoot });
    await git(['diff', '--check', '--', ...managedPaths]);
    await git(['add', ...managedPaths]);

    const { stdout: staged } = await git(['diff', '--cached', '--name-only']);
    if (!staged.trim()) {
        return { generated, committed: false, pushed: false, message: 'No changes to publish.' };
    }

    await git(['commit', '-m', `Publish article: ${title}`]);
    await git(['push']);
    return { generated, committed: true, pushed: true };
}

app.get('/api/session', requireToken, (req, res) => {
    res.json({ ok: true });
});

app.get('/api/articles', requireToken, asyncHandler(async (req, res) => {
    res.json(await listArticles());
}));

app.get('/api/articles/:id', requireToken, asyncHandler(async (req, res) => {
    res.json(await readArticle(req.params.id));
}));

app.post('/api/articles', requireToken, asyncHandler(async (req, res) => {
    const payload = req.body;
    if (!payload.id && payload.zh?.frontmatter?.title) {
        payload.id = slugify(payload.zh.frontmatter.title);
        payload.zh.frontmatter.id = payload.id;
    }
    const article = await saveArticle(payload);
    res.json(article);
}));

app.delete('/api/articles/:id', requireToken, asyncHandler(async (req, res) => {
    await deleteArticle(req.params.id);
    res.json({ ok: true });
}));

app.post('/api/articles/:id/upload', requireToken, upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) throw new Error('No image uploaded.');
    const extension = path.extname(req.file.originalname).toLowerCase() || '.png';
    const safeBase = slugify(path.basename(req.file.originalname, extension));
    const fileName = `${Date.now()}-${safeBase}${extension}`;
    const dir = assetsDir(req.params.id);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, fileName), req.file.buffer);
    const imagePath = `content/articles/${req.params.id}/assets/${fileName}`;
    res.json({
        path: imagePath,
        markdown: `![${safeBase}](${imagePath})`
    });
}));

app.post('/api/preview', requireToken, (req, res) => {
    res.json({ html: marked.parse(String(req.body.markdown || '')) });
});

app.post('/api/read-time', requireToken, (req, res) => {
    res.json({ readTime: estimateReadTime(req.body.markdown || '', req.body.lang || 'zh') });
});

app.post('/api/generate', requireToken, asyncHandler(async (req, res) => {
    res.json(await generateStaticData());
}));

app.post('/api/publish', requireToken, asyncHandler(async (req, res) => {
    const title = req.body.title || 'content update';
    res.json(await publishArticle(title));
}));

app.use((error, req, res, next) => {
    res.status(400).json({ error: error.message || 'Unexpected admin error.' });
});

app.listen(defaultPort, defaultHost, () => {
    console.log(`mypage admin: http://${defaultHost}:${defaultPort}/?token=${adminToken}`);
    console.log(`one-time token: ${adminToken}`);
});
