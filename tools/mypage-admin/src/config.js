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

export const managedPaths = [
    'mypage/content/articles',
    'mypage/data/articlesData.js',
    'mypage/data/i18nData.js'
];
