import crypto from 'node:crypto';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import multer from 'multer';

export const maxFolderUploadBytes = 100 * 1024 * 1024;
export const folderUploadRoot = path.join(os.tmpdir(), 'mypage-admin-folder-uploads');

export function createFolderUpload(root = folderUploadRoot) {
    fsSync.mkdirSync(root, { recursive: true, mode: 0o700 });
    return multer({
        storage: multer.diskStorage({
            destination: root,
            filename: (req, file, callback) => callback(null, crypto.randomUUID())
        }),
        limits: { fileSize: 25 * 1024 * 1024, files: 201, fields: 4 }
    });
}

export async function materializeFolderFiles(files = [], maxBytes = maxFolderUploadBytes) {
    const totalBytes = files.reduce((sum, file) => sum + Number(file.size || 0), 0);
    if (totalBytes > maxBytes) throw new Error('The folder exceeds the 100 MB total upload limit.');
    return Promise.all(files.map(async file => ({
        ...file,
        buffer: file.buffer || await fs.readFile(file.path)
    })));
}

export async function cleanupFolderFiles(files = []) {
    await Promise.all(files.map(file => file.path ? fs.rm(file.path, { force: true }) : Promise.resolve()));
}
