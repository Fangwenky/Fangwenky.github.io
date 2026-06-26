import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { dataRoot, mypageRoot } from './config.js';
import { slugify } from './contentStore.js';

const projectsFileName = 'projectsData.js';
const projectImageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

export function projectsDataPath(root = dataRoot) {
    return path.join(root, projectsFileName);
}

export function imagesRoot(root = mypageRoot) {
    return path.join(root, 'images');
}

export function normalizeProjectId(value = '') {
    return slugify(value);
}

export function normalizeTags(tags) {
    if (Array.isArray(tags)) return Array.from(tags, tag => String(tag).trim()).filter(Boolean);
    if (typeof tags === 'string') return tags.split(/[,，]/).map(tag => tag.trim()).filter(Boolean);
    return [];
}

function parseProjectsSource(raw) {
    const source = raw.replace(/export\s+const\s+projects\s*=/, 'const projects =');
    const script = new vm.Script(`${source}\nprojects;`, { filename: projectsFileName });
    const projects = script.runInNewContext(Object.create(null), { timeout: 1000 });
    if (!Array.isArray(projects)) throw new Error('projectsData.js must export an array named projects.');
    return projects;
}

function projectRecord(project = {}, options = {}) {
    const contentType = project.contentType === 'markdown' || options.forceMarkdown ? 'markdown' : 'html';
    return {
        id: normalizeProjectId(project.id),
        title: String(project.title || '').trim(),
        description: String(project.description || '').trim(),
        image: String(project.image || '').trim(),
        tags: normalizeTags(project.tags),
        link: String(project.link || '').trim(),
        category: String(project.category || '').trim(),
        date: String(project.date || new Date().toISOString().slice(0, 10)).trim(),
        contentType,
        content: String(project.content || '').trim()
    };
}

function validateProject(project) {
    const missing = [];
    ['id', 'title', 'description', 'image', 'category', 'date', 'content'].forEach(key => {
        if (!project[key]) missing.push(key);
    });
    if (missing.length) throw new Error(`Missing required project fields: ${missing.join(', ')}`);
    if (!/^[a-zA-Z0-9_-]+$/.test(project.id)) {
        throw new Error('Project id can only contain letters, numbers, hyphen, and underscore.');
    }
    if (project.link && project.link !== '#' && !project.link.startsWith('/') && !project.link.startsWith('./')) {
        try {
            const url = new URL(project.link);
            if (!['http:', 'https:'].includes(url.protocol)) throw new Error('invalid protocol');
        } catch (error) {
            throw new Error('Project link must be empty, #, relative, or HTTP(S).');
        }
    }
}

function serializeProjects(projects) {
    return `export const projects = ${JSON.stringify(projects, null, 4)};\n`;
}

export async function readProjects(options = {}) {
    const root = options.dataRoot || dataRoot;
    const raw = await fs.readFile(projectsDataPath(root), 'utf8');
    return parseProjectsSource(raw).map(projectRecord);
}

export async function writeProjects(projects, options = {}) {
    const root = options.dataRoot || dataRoot;
    await fs.mkdir(root, { recursive: true });
    await fs.writeFile(projectsDataPath(root), serializeProjects(projects.map(project => projectRecord(project, { forceMarkdown: project.contentType === 'markdown' }))), 'utf8');
}

export async function listProjects(options = {}) {
    const projects = await readProjects(options);
    return projects
        .map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            date: project.date,
            tags: project.tags,
            category: project.category,
            image: project.image,
            link: project.link,
            contentType: project.contentType
        }))
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

export async function readProject(id, options = {}) {
    const projects = await readProjects(options);
    const project = projects.find(item => item.id === id);
    if (!project) throw new Error(`Project ${id} was not found.`);
    return project;
}

export async function saveProject(payload, options = {}) {
    const projects = await readProjects(options).catch(error => {
        if (error.code === 'ENOENT') return [];
        throw error;
    });
    const project = projectRecord({ ...payload, contentType: 'markdown' }, { forceMarkdown: true });
    validateProject(project);
    const originalId = String(payload.originalId || '').trim();
    if (originalId && originalId !== project.id) {
        throw new Error('Project ID is locked after the first save.');
    }

    const index = projects.findIndex(item => item.id === project.id);
    if (!originalId && index !== -1) throw new Error(`Project ID "${project.id}" already exists.`);
    if (originalId && index === -1) throw new Error(`Project ${originalId} was not found.`);

    if (index === -1) projects.push(project);
    else projects[index] = project;
    projects.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    await writeProjects(projects, options);
    return readProject(project.id, options);
}

export async function deleteProject(id, options = {}) {
    const projects = await readProjects(options);
    const nextProjects = projects.filter(project => project.id !== id);
    if (nextProjects.length === projects.length) throw new Error(`Project ${id} was not found.`);
    await writeProjects(nextProjects, options);
}

export async function listProjectImages(options = {}) {
    const root = options.mypageRoot || mypageRoot;
    const dir = imagesRoot(root);
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
        .filter(entry => entry.isFile() && projectImageExtensions.has(path.extname(entry.name).toLowerCase()))
        .map(entry => ({
            name: entry.name,
            path: `images/${entry.name}`,
            url: `/mypage/images/${encodeURIComponent(entry.name)}`
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveProjectImage(fileName, buffer, options = {}) {
    const root = options.mypageRoot || mypageRoot;
    const dir = imagesRoot(root);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, fileName), buffer);
    return {
        name: fileName,
        path: `images/${fileName}`,
        url: `/mypage/images/${encodeURIComponent(fileName)}`
    };
}
