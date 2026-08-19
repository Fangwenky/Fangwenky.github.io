import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { projectPreviewDocument } from '../public/js/editor.js';
import { escapeHTML } from '../public/js/html.js';
import { cleanupFolderFiles, materializeFolderFiles } from '../src/uploadService.js';

test('escapes imported metadata before rendering admin HTML', () => {
    assert.equal(escapeHTML('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
    const preview = projectPreviewDocument({
        title: '"><script>alert(1)</script>',
        description: '<img src=x onerror=alert(1)>',
        image: 'x" onerror="alert(1)',
        tags: ['<svg onload=alert(1)>'],
        content: '<p>sanitized content</p>'
    });
    assert(!preview.includes('<script>alert(1)</script>'));
    assert(!preview.includes('<img src=x onerror=alert(1)>'));
    assert.match(preview, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});

test('materializes folder uploads from disk and enforces the total size before reading', async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mypage-upload-test-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    const first = path.join(root, 'first');
    const second = path.join(root, 'second');
    await fs.writeFile(first, 'abc');
    await fs.writeFile(second, 'defg');
    const files = [{ path: first, size: 3 }, { path: second, size: 4 }];

    const materialized = await materializeFolderFiles(files, 7);
    assert.equal(materialized.map(file => file.buffer.toString()).join(''), 'abcdefg');
    await assert.rejects(materializeFolderFiles(files, 6), /100 MB total upload limit/);
    await cleanupFolderFiles(files);
    await assert.rejects(fs.access(first), error => error.code === 'ENOENT');
    await assert.rejects(fs.access(second), error => error.code === 'ENOENT');
});
