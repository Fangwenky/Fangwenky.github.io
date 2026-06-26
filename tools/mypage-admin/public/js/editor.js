function replaceSelection(textarea, replacement, selectionStart = null, selectionEnd = null) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.setRangeText(replacement, start, end, 'end');
    textarea.focus();
    if (selectionStart !== null) {
        textarea.setSelectionRange(start + selectionStart, start + (selectionEnd ?? selectionStart));
    }
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function wrap(textarea, before, after = before, fallback = '文本') {
    const selected = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd) || fallback;
    replaceSelection(textarea, `${before}${selected}${after}`, before.length, before.length + selected.length);
}

function prefixLines(textarea, prefix) {
    const start = textarea.value.lastIndexOf('\n', textarea.selectionStart - 1) + 1;
    const endBreak = textarea.value.indexOf('\n', textarea.selectionEnd);
    const end = endBreak === -1 ? textarea.value.length : endBreak;
    const selected = textarea.value.slice(start, end);
    const replacement = selected.split('\n').map((line, index) => typeof prefix === 'function' ? prefix(line, index) : `${prefix}${line}`).join('\n');
    textarea.setSelectionRange(start, end);
    replaceSelection(textarea, replacement);
}

export function applyMarkdownCommand(textarea, command) {
    const commands = {
        heading: () => prefixLines(textarea, '## '),
        bold: () => wrap(textarea, '**'),
        italic: () => wrap(textarea, '*'),
        quote: () => prefixLines(textarea, '> '),
        unordered: () => prefixLines(textarea, '- '),
        ordered: () => prefixLines(textarea, (line, index) => `${index + 1}. ${line}`),
        code: () => wrap(textarea, '`', '`', 'code'),
        codeblock: () => wrap(textarea, '```\n', '\n```', 'code'),
        link: () => {
            const label = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd) || '链接文字';
            const url = window.prompt('链接地址', 'https://');
            if (url) replaceSelection(textarea, `[${label}](${url})`, 1, 1 + label.length);
        },
        table: () => replaceSelection(textarea, '| 列 1 | 列 2 |\n| --- | --- |\n| 内容 | 内容 |\n')
    };
    commands[command]?.();
}

export function insertAtCursor(textarea, value) {
    replaceSelection(textarea, value);
}

export function previewDocument(html) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/">
    <link rel="stylesheet" href="/mypage/style.css">
    <style>
        html { background: var(--bg); }
        body { min-width: 0; padding: 28px; background: var(--bg); }
        .article-detail-content { margin: 0 auto; }
        @media (max-width: 560px) { body { padding: 18px; } }
    </style>
</head>
<body><article class="article-detail-content">${html}</article></body>
</html>`;
}

export function projectPreviewDocument(project = {}) {
    const title = project.title || '未命名项目';
    const description = project.description || '';
    const image = project.image || 'images/avatar.jpg';
    const tags = (project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/mypage/">
    <link rel="stylesheet" href="/mypage/style.css">
    <style>
        html { background: var(--bg); }
        body { min-width: 0; padding: 28px; background: var(--bg); }
        .project-preview-shell { max-width: 980px; margin: 0 auto; }
        .project-preview-hero { margin-bottom: 28px; overflow: hidden; border-radius: 24px; background: var(--card-bg, #fff); box-shadow: var(--shadow-md, 0 18px 45px rgba(15, 23, 42, 0.1)); }
        .project-preview-hero img { display: block; width: 100%; max-height: 360px; object-fit: cover; }
        .project-preview-copy { padding: 24px; }
        .project-preview-copy h1 { margin: 0 0 10px; }
        .project-preview-copy p { color: var(--text-light, #667085); }
        .article-tags { margin-top: 14px; }
        @media (max-width: 560px) { body { padding: 18px; } }
    </style>
</head>
<body>
    <article class="project-preview-shell">
        <header class="project-preview-hero">
            <img src="${image}" alt="${title}">
            <div class="project-preview-copy">
                <h1>${title}</h1>
                <p>${description}</p>
                <div class="article-tags">${tags}</div>
            </div>
        </header>
        <section class="article-detail-content">${project.content || '<p>在这里预览项目详情。</p>'}</section>
    </article>
</body>
</html>`;
}
