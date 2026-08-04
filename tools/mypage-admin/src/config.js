import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const adminRoot = path.resolve(__dirname, '..');
export const repoRoot = path.resolve(adminRoot, '..', '..');
export const mypageRoot = path.join(repoRoot, 'mypage');
export const articlesRoot = path.join(mypageRoot, 'content', 'articles');
export const dataRoot = path.join(mypageRoot, 'data');
export const publicRoot = path.join(adminRoot, 'public');
export const defaultHost = '127.0.0.1';
export const defaultPort = Number(process.env.MYPAGE_ADMIN_PORT || 8787);
export const adminToken = process.env.MYPAGE_ADMIN_TOKEN || Math.random().toString(36).slice(2, 10);
export const openBrowser = process.argv.includes('--open') || process.env.MYPAGE_ADMIN_OPEN === '1';

export const deployConfig = {
    sshHost: process.env.MYPAGE_DEPLOY_HOST || 'root@107.175.115.136',
    deployRoot: process.env.MYPAGE_DEPLOY_ROOT || '/var/www/fangwenky-home',
    vpsUrl: process.env.MYPAGE_DEPLOY_URL || 'https://fangwenky.dpdns.org',
    githubPagesUrl: process.env.MYPAGE_GITHUB_PAGES_URL || 'https://fangwenky.github.io/mypage'
};

export const managedPaths = [
    'mypage/content/articles',
    'mypage/data/articlesData.js',
    'mypage/data/i18nData.js',
    'mypage/data/projectsData.js',
    'mypage/content/projects',
    'mypage/images'
];

export const generatedPaths = [
    'mypage/data/articlesData.js',
    'mypage/data/i18nData.js'
];

export const projectPaths = [
    'mypage/data/projectsData.js',
    'mypage/content/projects',
    'mypage/images'
];
