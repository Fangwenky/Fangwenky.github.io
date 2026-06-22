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
