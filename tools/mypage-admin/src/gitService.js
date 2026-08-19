import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { generatedPaths, projectPaths, repoRoot } from './config.js';
import { parseFrontmatter } from './frontmatter.js';

const execFileAsync = promisify(execFile);
const articlePrefix = 'mypage/content/articles/';

function normalizePath(filePath) {
    return String(filePath || '').replaceAll('\\', '/');
}

function parsePorcelain(raw = '') {
    const chunks = raw.split('\0');
    const entries = [];
    for (let index = 0; index < chunks.length; index += 1) {
        const chunk = chunks[index];
        if (!chunk) continue;
        const status = chunk.slice(0, 2);
        const file = normalizePath(chunk.slice(3));
        if (status.includes('R') || status.includes('C')) {
            const originalFile = normalizePath(chunks[index + 1]);
            entries.push({ status, file, originalFile });
            index += 1;
        } else {
            entries.push({ status, file });
        }
    }
    return entries;
}

function articleIdFromPath(filePath) {
    if (!filePath.startsWith(articlePrefix)) return null;
    return filePath.slice(articlePrefix.length).split('/')[0] || null;
}

function isPublishedMarkdown(raw) {
    if (!raw) return false;
    try {
        return parseFrontmatter(raw).data.status === 'published';
    } catch (error) {
        return false;
    }
}

async function lineCount(filePath) {
    try {
        const value = await fs.readFile(filePath, 'utf8');
        return value ? value.split('\n').length : 0;
    } catch (error) {
        return 0;
    }
}

export function createGitService(options = {}) {
    const cwd = options.repoRoot || repoRoot;
    const runGit = options.runGit || (args => execFileAsync('git', args, { cwd, maxBuffer: 20 * 1024 * 1024 }));

    async function git(args) {
        return runGit(args);
    }

    async function statusEntries(paths = []) {
        const args = ['status', '--porcelain=v1', '-z', '--untracked-files=all'];
        if (paths.length) args.push('--', ...paths);
        const { stdout } = await git(args);
        return parsePorcelain(stdout);
    }

    async function baseArticlePublished(id) {
        try {
            const { stdout } = await git(['show', `HEAD:${articlePrefix}${id}/index.zh.md`]);
            return isPublishedMarkdown(stdout);
        } catch (error) {
            return false;
        }
    }

    async function currentArticlePublished(id) {
        try {
            const raw = await fs.readFile(path.join(cwd, articlePrefix, id, 'index.zh.md'), 'utf8');
            return isPublishedMarkdown(raw);
        } catch (error) {
            return false;
        }
    }

    async function publicationScope() {
        const entries = await statusEntries(['mypage/content/articles', ...generatedPaths, ...projectPaths]);
        const ids = [...new Set(entries.map(entry => articleIdFromPath(entry.file)).filter(Boolean))];
        const publishIds = [];
        const draftIds = [];

        for (const id of ids) {
            const [currentPublished, basePublished] = await Promise.all([
                currentArticlePublished(id),
                baseArticlePublished(id)
            ]);
            (currentPublished || basePublished ? publishIds : draftIds).push(id);
        }

        const articlePaths = publishIds.map(id => `${articlePrefix}${id}`.replace(/\/$/, ''));
        const draftPaths = draftIds.map(id => `${articlePrefix}${id}`.replace(/\/$/, ''));
        const publishPaths = [...articlePaths, ...generatedPaths, ...projectPaths];
        const isWithin = (file, roots) => roots.some(root => file === root || file.startsWith(`${root}/`));

        const publishableFiles = entries.filter(entry => isWithin(entry.file, publishPaths));
        const publishFiles = [...new Set(publishableFiles.flatMap(entry => [entry.file, entry.originalFile])
            .filter(file => file && isWithin(file, publishPaths)))];

        return {
            publishIds,
            draftIds,
            publishPaths,
            publishFiles,
            draftPaths,
            publishableFiles,
            draftFiles: entries.filter(entry => isWithin(entry.file, draftPaths))
        };
    }

    async function aheadBehind() {
        const { stdout } = await git(['rev-list', '--left-right', '--count', 'origin/main...HEAD']);
        const [behind = '0', ahead = '0'] = stdout.trim().split(/\s+/);
        return { behind: Number(behind), ahead: Number(ahead) };
    }

    async function workspaceStatus({ fetch = false } = {}) {
        if (fetch) await git(['fetch', 'origin', 'main']);
        const [{ stdout: branchOutput }, staged, counts, scope] = await Promise.all([
            git(['branch', '--show-current']),
            git(['diff', '--cached', '--name-only', '-z']),
            aheadBehind(),
            publicationScope()
        ]);
        const branch = branchOutput.trim();
        const stagedFiles = staged.stdout.split('\0').filter(Boolean);
        const blockers = [];
        if (branch !== 'main') blockers.push(`Current branch is "${branch || 'detached'}", expected "main".`);
        if (stagedFiles.length) blockers.push(`The Git index already contains staged files: ${stagedFiles.join(', ')}`);
        if (counts.behind > 0) blockers.push(`Local main is behind origin/main by ${counts.behind} commit(s).`);
        if (counts.ahead > 0) blockers.push(`Local main has ${counts.ahead} unpushed commit(s).`);
        return { branch, stagedFiles, ...counts, ...scope, blockers, ready: blockers.length === 0 };
    }

    async function diffSummary(scope) {
        const files = scope.publishableFiles;
        const { stdout } = await git(['diff', '--numstat', '--', ...scope.publishPaths]);
        const stats = new Map(stdout.trim().split('\n').filter(Boolean).map(line => {
            const [added, deleted, file] = line.split('\t');
            return [normalizePath(file), { added: Number(added) || 0, deleted: Number(deleted) || 0 }];
        }));

        const summary = [];
        for (const entry of files) {
            let stat = stats.get(entry.file) || { added: 0, deleted: 0 };
            if (entry.status === '??') stat = { added: await lineCount(path.join(cwd, entry.file)), deleted: 0 };
            summary.push({ ...entry, ...stat });
        }
        return summary;
    }

    async function fingerprint(scope) {
        const hash = crypto.createHash('sha256');
        const { stdout: head } = await git(['rev-parse', 'HEAD']);
        hash.update(head.trim());
        for (const entry of [...scope.publishableFiles].sort((a, b) => a.file.localeCompare(b.file))) {
            hash.update(`${entry.status}:${entry.file}\n`);
            try {
                hash.update(await fs.readFile(path.join(cwd, entry.file)));
            } catch (error) {
                if (error.code !== 'ENOENT') throw error;
            }
        }
        return hash.digest('hex');
    }

    async function stage(paths) {
        if (paths.length) await git(['add', '--', ...paths]);
        const { stdout } = await git(['diff', '--cached', '--name-only', '-z']);
        return stdout.split('\0').filter(Boolean);
    }

    async function unstage(paths) {
        if (paths.length) await git(['restore', '--staged', '--', ...paths]);
    }

    async function commit(message) {
        const safeMessage = String(message || 'Publish content update').replace(/[\r\n]+/g, ' ').trim();
        await git(['commit', '-m', safeMessage]);
        return headSha();
    }

    async function headSha() {
        const { stdout } = await git(['rev-parse', 'HEAD']);
        return stdout.trim();
    }

    async function push() {
        await git(['push', 'origin', 'HEAD:main']);
    }

    return {
        git,
        statusEntries,
        publicationScope,
        workspaceStatus,
        diffSummary,
        fingerprint,
        stage,
        unstage,
        commit,
        headSha,
        push
    };
}

export { articleIdFromPath, isPublishedMarkdown, parsePorcelain };
