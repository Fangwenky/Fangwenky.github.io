import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import express from 'express';
import multer from 'multer';
import {
    adminToken,
    defaultHost,
    defaultPort,
    deployConfig,
    mypageRoot,
    openBrowser,
    publicRoot
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
import { createDeployService } from './deployService.js';
import { createGitService } from './gitService.js';
import {
    deleteProject,
    listProjectImages,
    listProjects,
    readProject,
    saveProject,
    saveProjectImage
} from './projectStore.js';
import { renderMarkdown } from './markdown.js';
import { createPublishService } from './publishService.js';
import { generateStaticData } from './staticGenerator.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
const allowedImageTypes = new Map([
    ['image/png', ['.png']],
    ['image/jpeg', ['.jpg', '.jpeg']],
    ['image/webp', ['.webp']],
    ['image/gif', ['.gif']]
]);
const gitService = createGitService();
const deployService = createDeployService();
const publishService = createPublishService({ gitService, deployService });

app.use(express.json({ limit: '4mb' }));
app.use('/mypage', express.static(mypageRoot));
app.use('/content', express.static(path.join(mypageRoot, 'content')));
app.use(express.static(publicRoot));

function requireToken(req, res, next) {
    const token = req.get('x-admin-token') || req.query.token;
    if (token !== adminToken) {
        res.status(401).json({ error: 'Invalid admin token.' });
        return;
    }
    res.set('cache-control', 'no-store');
    next();
}

function asyncHandler(handler) {
    return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function validateImageUpload(file) {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = allowedImageTypes.get(file.mimetype);
    if (!allowedExtensions || !allowedExtensions.includes(extension)) {
        throw new Error('Only PNG, JPG, WebP, and GIF images can be uploaded.');
    }

    const header = file.buffer.subarray(0, 12);
    const isPng = file.mimetype === 'image/png'
        && header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
    const isJpeg = file.mimetype === 'image/jpeg'
        && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const isWebp = file.mimetype === 'image/webp'
        && header.toString('ascii', 0, 4) === 'RIFF'
        && header.toString('ascii', 8, 12) === 'WEBP';
    const isGif = file.mimetype === 'image/gif'
        && ['GIF87a', 'GIF89a'].includes(header.toString('ascii', 0, 6));
    if (!isPng && !isJpeg && !isWebp && !isGif) {
        throw new Error('Uploaded file does not match its image type.');
    }
}

async function listAssets(id) {
    try {
        const entries = await fs.readdir(assetsDir(id), { withFileTypes: true });
        return entries
            .filter(entry => entry.isFile())
            .map(entry => ({
                name: entry.name,
                path: `content/articles/${id}/assets/${entry.name}`,
                url: `/content/articles/${id}/assets/${encodeURIComponent(entry.name)}`
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

app.get('/api/session', requireToken, asyncHandler(async (req, res) => {
    const workspace = await gitService.workspaceStatus();
    res.json({
        ok: true,
        workspace,
        deployment: {
            githubPagesUrl: deployConfig.githubPagesUrl,
            vpsUrl: deployConfig.vpsUrl,
            sshHost: deployConfig.sshHost,
            deployRoot: deployConfig.deployRoot
        }
    });
}));

app.get('/api/workspace/status', requireToken, asyncHandler(async (req, res) => {
    res.json(await gitService.workspaceStatus({ fetch: req.query.fetch === '1' }));
}));

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
    res.json(await saveArticle(payload));
}));

app.delete('/api/articles/:id', requireToken, asyncHandler(async (req, res) => {
    await deleteArticle(req.params.id);
    res.json({ ok: true });
}));

app.get('/api/projects', requireToken, asyncHandler(async (req, res) => {
    res.json(await listProjects());
}));

app.get('/api/projects/assets', requireToken, asyncHandler(async (req, res) => {
    res.json(await listProjectImages());
}));

app.get('/api/projects/:id', requireToken, asyncHandler(async (req, res) => {
    res.json(await readProject(req.params.id));
}));

app.post('/api/projects', requireToken, asyncHandler(async (req, res) => {
    const payload = req.body;
    if (!payload.id && payload.title) payload.id = slugify(payload.title);
    res.json(await saveProject(payload));
}));

app.delete('/api/projects/:id', requireToken, asyncHandler(async (req, res) => {
    await deleteProject(req.params.id);
    res.json({ ok: true });
}));

app.get('/api/articles/:id/assets', requireToken, asyncHandler(async (req, res) => {
    res.json(await listAssets(req.params.id));
}));

app.post('/api/articles/:id/upload', requireToken, upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) throw new Error('No image uploaded.');
    validateImageUpload(req.file);
    const extension = path.extname(req.file.originalname).toLowerCase() || '.png';
    const safeBase = slugify(path.basename(req.file.originalname, extension));
    const fileName = `${Date.now()}-${safeBase}${extension}`;
    const dir = assetsDir(req.params.id);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, fileName), req.file.buffer);
    const imagePath = `content/articles/${req.params.id}/assets/${fileName}`;
    res.json({
        name: fileName,
        path: imagePath,
        url: `/content/articles/${req.params.id}/assets/${encodeURIComponent(fileName)}`,
        markdown: `![${safeBase}](${imagePath})`
    });
}));

app.post('/api/projects/upload', requireToken, upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) throw new Error('No image uploaded.');
    validateImageUpload(req.file);
    const extension = path.extname(req.file.originalname).toLowerCase() || '.png';
    const safeBase = slugify(path.basename(req.file.originalname, extension));
    const fileName = `${Date.now()}-${safeBase}${extension}`;
    res.json(await saveProjectImage(fileName, req.file.buffer));
}));

app.post('/api/preview', requireToken, (req, res) => {
    res.json({ html: renderMarkdown(String(req.body.markdown || '')) });
});

app.post('/api/project-preview', requireToken, (req, res) => {
    res.json({ html: renderMarkdown(String(req.body.markdown || '')) });
});

app.post('/api/read-time', requireToken, (req, res) => {
    res.json({ readTime: estimateReadTime(req.body.markdown || '', req.body.lang || 'zh') });
});

app.post('/api/generate', requireToken, asyncHandler(async (req, res) => {
    res.json(await generateStaticData());
}));

app.post('/api/publish/prepare', requireToken, asyncHandler(async (req, res) => {
    res.json(await publishService.prepare());
}));

app.post('/api/publish/jobs', requireToken, (req, res) => {
    res.status(202).json(publishService.startPublish(req.body || {}));
});

app.get('/api/publish/jobs/:id', requireToken, (req, res) => {
    res.json(publishService.getJob(req.params.id));
});

app.post('/api/publish/jobs/:id/retry', requireToken, (req, res) => {
    res.status(202).json(publishService.retryPush(req.params.id));
});

app.post('/api/deploy/jobs', requireToken, asyncHandler(async (req, res) => {
    res.status(202).json(await publishService.startDeployOnly());
}));

app.use((error, req, res, next) => {
    console.error(error);
    res.status(400).json({ error: error.message || 'Unexpected admin error.' });
});

const server = app.listen(defaultPort, defaultHost, () => {
    const url = `http://${defaultHost}:${defaultPort}/?token=${adminToken}`;
    console.log(`mypage admin: ${url}`);
    console.log(`one-time token: ${adminToken}`);
    if (openBrowser && process.platform === 'darwin') {
        execFile('open', [url], error => {
            if (error) console.error(`Could not open browser: ${error.message}`);
        });
    }
});

export { app, server, validateImageUpload };
