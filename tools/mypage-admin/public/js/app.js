import { api, uploadArticleImage } from './api.js';
import { clearRecovery, listRecoveries, loadRecovery, saveRecovery } from './drafts.js';
import { applyMarkdownCommand, insertAtCursor, previewDocument } from './editor.js';
import { PublishingController } from './publish.js';

const $ = selector => document.querySelector(selector);
const fields = [
    'articleId', 'articleDate', 'articleCategory', 'articleReadTime', 'articleCover',
    'articleStatus', 'articleFeatured', 'zhTitle', 'enTitle', 'zhExcerpt', 'enExcerpt',
    'zhTags', 'enTags'
];
const state = {
    articles: [],
    current: null,
    originalId: '',
    recoveryId: '',
    sourceUpdatedAt: '',
    activeLang: 'zh',
    bodies: { zh: '', en: '' },
    dirty: false,
    suspended: false,
    workspace: null,
    previewTimer: null,
    readTimeTimer: null
};

function notify(text, type = 'neutral') {
    const toast = $('#toast');
    toast.textContent = text;
    toast.dataset.type = type;
    toast.hidden = false;
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => { toast.hidden = true; }, 4200);
}

function message(text) {
    $('#message').textContent = text;
}

function tagsFromInput(value) {
    return String(value || '').split(/[,，]/).map(tag => tag.trim()).filter(Boolean);
}

function tagsToInput(tags) {
    return Array.isArray(tags) ? tags.join(', ') : '';
}

function englishReadTimeFrom(readTime) {
    const match = String(readTime || '').match(/\d+/);
    return match ? `${match[0]} min read` : '';
}

function setDirty(dirty = true) {
    if (state.suspended) return;
    state.dirty = dirty;
    $('#saveState').textContent = dirty ? '有未保存内容 · 已开启本地恢复' : '源码已保存';
    $('#saveState').classList.toggle('dirty', dirty);
    renderList();
}

function setEnabled(enabled) {
    $('#saveArticle').disabled = !enabled;
    $('#deleteArticle').disabled = !enabled || !state.originalId;
    $('#markdownEditor').disabled = !enabled;
    $('#chooseCover').disabled = !enabled;
    fields.forEach(id => { $(`#${id}`).disabled = !enabled || (id === 'articleId' && Boolean(state.originalId)); });
    document.querySelectorAll('.format-tools button, .format-tools input, .language-tabs button').forEach(control => { control.disabled = !enabled; });
}

function updatePublishButton() {
    const blocked = Boolean(state.workspace?.blockers?.length);
    const hasCandidate = Boolean(state.current) || Boolean(state.workspace?.publishableFiles?.length);
    $('#publishArticle').disabled = blocked || !hasCandidate;
}

function currentPayload() {
    state.bodies[state.activeLang] = $('#markdownEditor').value;
    const base = {
        id: $('#articleId').value.trim(),
        title: $('#zhTitle').value.trim(),
        excerpt: $('#zhExcerpt').value.trim(),
        date: $('#articleDate').value,
        tags: tagsFromInput($('#zhTags').value),
        category: $('#articleCategory').value.trim(),
        cover: $('#articleCover').value.trim(),
        readTime: $('#articleReadTime').value.trim(),
        status: $('#articleStatus').value,
        featured: $('#articleFeatured').checked,
        updatedAt: new Date().toISOString()
    };
    const english = {
        ...base,
        title: $('#enTitle').value.trim(),
        excerpt: $('#enExcerpt').value.trim(),
        tags: tagsFromInput($('#enTags').value),
        readTime: englishReadTimeFrom(base.readTime)
    };
    const hasEnglish = Boolean(english.title || english.excerpt || english.tags.length || state.bodies.en.trim());
    return {
        id: base.id,
        originalId: state.originalId,
        zh: { frontmatter: base, body: state.bodies.zh },
        en: hasEnglish ? { frontmatter: english, body: state.bodies.en } : null
    };
}

function applyPayload(payload) {
    const zh = payload.zh?.frontmatter || {};
    const en = payload.en?.frontmatter || {};
    state.bodies = { zh: payload.zh?.body || '', en: payload.en?.body || '' };
    $('#articleId').value = zh.id || payload.id || '';
    $('#articleDate').value = zh.date || new Date().toISOString().slice(0, 10);
    $('#articleCategory').value = zh.category || '学习笔记';
    $('#articleReadTime').value = zh.readTime || '3 分钟阅读';
    $('#articleCover').value = zh.cover || '';
    $('#articleStatus').value = zh.status === 'published' ? 'published' : 'draft';
    $('#articleFeatured').checked = Boolean(zh.featured);
    $('#zhTitle').value = zh.title || '';
    $('#zhExcerpt').value = zh.excerpt || '';
    $('#zhTags').value = tagsToInput(zh.tags);
    $('#enTitle').value = en.title || '';
    $('#enExcerpt').value = en.excerpt || '';
    $('#enTags').value = tagsToInput(en.tags);
    switchLanguage('zh', false);
}

async function renderPreview() {
    const markdown = $('#markdownEditor').value;
    const data = await api('/api/preview', { method: 'POST', body: JSON.stringify({ markdown }) });
    $('#previewFrame').srcdoc = previewDocument(data.html);
}

function schedulePreview() {
    clearTimeout(state.previewTimer);
    state.previewTimer = setTimeout(() => renderPreview().catch(error => message(error.message)), 180);
}

function updateMetrics() {
    const value = $('#markdownEditor').value;
    const count = state.activeLang === 'zh'
        ? value.replace(/\s+/g, '').length
        : value.trim().split(/\s+/).filter(Boolean).length;
    $('#wordCount').textContent = state.activeLang === 'zh' ? `${count} 字` : `${count} words`;
}

function scheduleReadTime() {
    if (state.activeLang !== 'zh' || !$('#autoReadTime').checked) return;
    clearTimeout(state.readTimeTimer);
    state.readTimeTimer = setTimeout(async () => {
        try {
            const result = await api('/api/read-time', {
                method: 'POST',
                body: JSON.stringify({ markdown: state.bodies.zh, lang: 'zh' })
            });
            if ($('#articleReadTime').value !== result.readTime) {
                $('#articleReadTime').value = result.readTime;
                setDirty();
            }
        } catch (error) {
            message(error.message);
        }
    }, 650);
}

function switchLanguage(lang, preserve = true) {
    if (preserve) state.bodies[state.activeLang] = $('#markdownEditor').value;
    state.activeLang = lang;
    $('#markdownEditor').value = state.bodies[lang] || '';
    document.querySelectorAll('.tab').forEach(tab => {
        const active = tab.dataset.lang === lang;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
    });
    updateMetrics();
    schedulePreview();
}

function statusText(status) {
    return status === 'published' ? '已发布' : status === 'invalid' ? '异常' : '草稿';
}

function renderList() {
    const query = $('#filterInput').value.trim().toLowerCase();
    const status = $('#statusFilter').value;
    const list = $('#articleList');
    const filtered = state.articles
        .filter(article => !status || article.status === status)
        .filter(article => !query || [article.title, article.category, ...(article.tags || [])].join(' ').toLowerCase().includes(query));
    list.innerHTML = filtered.map(article => {
        const active = state.originalId === article.id;
        const english = article.hasEnglish ? '中英正文' : article.hasEnglishMeta ? '英文元信息' : '仅中文';
        return `<button type="button" class="article-item ${active ? 'active' : ''}" data-id="${article.id}">
            <span class="article-item-top"><strong>${article.title}</strong>${active && state.dirty ? '<i>未保存</i>' : ''}</span>
            <span>${article.date || '无日期'} · ${statusText(article.status)}</span>
            <small>${article.category || '未分类'} · ${english}</small>
        </button>`;
    }).join('') || '<p class="empty-state">没有符合条件的文章。</p>';
    list.querySelectorAll('[data-id]').forEach(button => button.addEventListener('click', () => loadArticle(button.dataset.id)));
}

function renderRecoveries() {
    const recoveries = listRecoveries().filter(item => item.id.startsWith('new-'));
    $('#recoveryList').innerHTML = recoveries.length ? `
        <p class="list-label">未写入源码的恢复稿</p>
        ${recoveries.map(item => `<div class="recovery-row"><button type="button" class="recovery-item" data-recovery="${item.id}"><strong>${item.payload?.zh?.frontmatter?.title || '未命名文章'}</strong><span>${new Date(item.savedAt).toLocaleString()}</span></button><button type="button" class="discard-recovery" data-discard-recovery="${item.id}" aria-label="丢弃恢复稿">×</button></div>`).join('')}
    ` : '';
    document.querySelectorAll('[data-recovery]').forEach(button => button.addEventListener('click', () => openRecoveryDraft(button.dataset.recovery)));
    document.querySelectorAll('[data-discard-recovery]').forEach(button => button.addEventListener('click', () => {
        clearRecovery(button.dataset.discardRecovery);
        renderRecoveries();
        notify('已丢弃恢复稿', 'success');
    }));
}

async function loadArticles() {
    state.articles = await api('/api/articles');
    renderList();
    renderRecoveries();
}

async function confirmDiscardCurrent() {
    if (!state.dirty) return true;
    persistRecovery();
    return window.confirm('当前修改尚未写入源码，已经保存为浏览器恢复稿。继续切换文章？');
}

async function askRecovery(recovery) {
    const dialog = $('#recoveryDialog');
    $('#recoveryMessage').textContent = `恢复稿保存于 ${new Date(recovery.savedAt).toLocaleString()}，比源码更新。`;
    dialog.showModal();
    return new Promise(resolve => dialog.addEventListener('close', () => resolve(dialog.returnValue), { once: true }));
}

async function loadArticle(id) {
    if (!(await confirmDiscardCurrent())) return;
    const article = await api(`/api/articles/${encodeURIComponent(id)}`);
    state.suspended = true;
    state.current = article;
    state.originalId = article.id;
    state.recoveryId = article.id;
    state.sourceUpdatedAt = article.zh.frontmatter.updatedAt;
    applyPayload(article);
    $('#articleId').disabled = true;
    $('#editorTitle').textContent = article.zh.frontmatter.title || article.id;
    $('#currentState').textContent = statusText(article.zh.frontmatter.status);
    setEnabled(true);
    state.suspended = false;
    setDirty(false);
    updatePublishButton();
    renderList();
    message(`已加载：${article.zh.frontmatter.title}`);
    closeSidebar();

    const recovery = loadRecovery(id);
    if (recovery && new Date(recovery.savedAt) > new Date(state.sourceUpdatedAt || 0)) {
        const choice = await askRecovery(recovery);
        if (choice === 'restore') {
            applyPayload(recovery.payload);
            setDirty(true);
            notify('已恢复浏览器中的未保存内容', 'success');
        } else {
            clearRecovery(id);
            renderRecoveries();
        }
    }
}

function newArticle(recoveryId = `new-${crypto.randomUUID()}`) {
    state.suspended = true;
    state.current = { id: '' };
    state.originalId = '';
    state.recoveryId = recoveryId;
    state.sourceUpdatedAt = '';
    applyPayload({
        id: '',
        zh: {
            frontmatter: {
                id: '', title: '', excerpt: '', date: new Date().toISOString().slice(0, 10),
                tags: [], category: '学习笔记', cover: '', readTime: '3 分钟阅读',
                status: 'draft', featured: false
            },
            body: ''
        },
        en: null
    });
    $('#articleId').disabled = false;
    $('#editorTitle').textContent = '未命名文章';
    $('#currentState').textContent = '本地草稿';
    setEnabled(true);
    state.suspended = false;
    state.dirty = false;
    $('#saveState').textContent = '尚未写入源码';
    $('#saveState').classList.remove('dirty');
    updatePublishButton();
    renderList();
    $('#zhTitle').focus();
    message('新草稿尚未写入源码');
}

function openRecoveryDraft(id) {
    const recovery = loadRecovery(id);
    if (!recovery) return;
    newArticle(id);
    applyPayload(recovery.payload);
    setDirty(true);
    notify('已打开本地恢复稿', 'success');
}

function deriveId(title) {
    const ascii = String(title || '').toLowerCase().match(/[a-z0-9]+/g)?.join('-');
    const now = new Date();
    const time = now.toTimeString().slice(0, 8).replaceAll(':', '');
    return ascii || `article-${now.toISOString().slice(0, 10)}-${time}`;
}

function validateArticle() {
    if (!$('#articleId').value.trim()) $('#articleId').value = deriveId($('#zhTitle').value);
    state.bodies[state.activeLang] = $('#markdownEditor').value;
    if (!$('#articleForm').reportValidity()) throw new Error('请先补全标记为必填的文章信息。');
    if (!state.bodies.zh.trim()) {
        switchLanguage('zh');
        $('#markdownEditor').focus();
        throw new Error('中文正文不能为空。');
    }
}

async function saveArticle() {
    validateArticle();
    const previousRecovery = state.recoveryId;
    const saved = await api('/api/articles', { method: 'POST', body: JSON.stringify(currentPayload()) });
    clearRecovery(previousRecovery);
    state.suspended = true;
    state.current = saved;
    state.originalId = saved.id;
    state.recoveryId = saved.id;
    state.sourceUpdatedAt = saved.zh.frontmatter.updatedAt;
    applyPayload(saved);
    $('#articleId').disabled = true;
    $('#editorTitle').textContent = saved.zh.frontmatter.title;
    $('#currentState').textContent = statusText(saved.zh.frontmatter.status);
    state.suspended = false;
    setDirty(false);
    await Promise.all([loadArticles(), refreshWorkspace()]);
    message('已保存到 Markdown 源码');
    notify('文章已写入源码', 'success');
    return saved;
}

function persistRecovery() {
    if (!state.current || !state.dirty || !state.recoveryId) return;
    saveRecovery(state.recoveryId, { payload: currentPayload(), sourceUpdatedAt: state.sourceUpdatedAt });
    $('#saveState').textContent = '未保存 · 恢复稿已更新';
    renderRecoveries();
}

async function uploadImage(file, { asCover = false } = {}) {
    if (!state.originalId) throw new Error('请先保存文章，再上传图片。');
    if (!file.type.startsWith('image/')) throw new Error('只能上传图片文件。');
    const result = await uploadArticleImage(state.originalId, file);
    if (asCover) {
        $('#articleCover').value = result.path;
        setDirty();
    } else {
        insertAtCursor($('#markdownEditor'), result.markdown);
    }
    notify(`已上传 ${result.name}`, 'success');
    return result;
}

async function openAssets() {
    if (!state.originalId) throw new Error('请先保存文章，再选择文章图片。');
    const assets = await api(`/api/articles/${encodeURIComponent(state.originalId)}/assets`);
    $('#assetGrid').innerHTML = assets.length ? assets.map(asset => `
        <button type="button" data-asset-path="${asset.path}"><img src="${asset.url}" alt=""><span>${asset.name}</span></button>
    `).join('') : '<p class="empty-state">这篇文章还没有上传图片。</p>';
    $('#assetGrid').querySelectorAll('[data-asset-path]').forEach(button => button.addEventListener('click', () => {
        $('#articleCover').value = button.dataset.assetPath;
        setDirty();
        $('#assetDialog').close();
    }));
    $('#assetDialog').showModal();
}

async function deleteCurrentArticle() {
    if (!state.originalId) return;
    await api(`/api/articles/${encodeURIComponent(state.originalId)}`, { method: 'DELETE' });
    clearRecovery(state.originalId);
    state.current = null;
    state.originalId = '';
    state.recoveryId = '';
    setEnabled(false);
    $('#editorTitle').textContent = '文章已删除';
    $('#currentState').textContent = '待发布';
    $('#saveState').textContent = '删除将在下一次发布时同步';
    $('#markdownEditor').value = '';
    $('#previewFrame').srcdoc = previewDocument('<p>选择其他文章继续编辑，或直接发布这次删除。</p>');
    await Promise.all([loadArticles(), refreshWorkspace()]);
    notify('文章源码已删除，尚未提交', 'warning');
}

function updateWorkspaceUi(workspace) {
    state.workspace = workspace;
    $('#gitBranch').textContent = workspace.branch || 'detached';
    const sync = $('#syncState');
    if (workspace.blockers?.length) {
        sync.textContent = '发布受阻';
        sync.dataset.state = 'error';
        sync.title = workspace.blockers.join('\n');
    } else if (workspace.publishableFiles?.length) {
        sync.textContent = `${workspace.publishableFiles.length} 项待发布`;
        sync.dataset.state = 'pending';
    } else if (workspace.draftFiles?.length) {
        sync.textContent = '仅有本地草稿';
        sync.dataset.state = 'draft';
    } else {
        sync.textContent = '已同步';
        sync.dataset.state = 'success';
    }
    updatePublishButton();
}

async function refreshWorkspace(fetch = false) {
    const workspace = await api(`/api/workspace/status${fetch ? '?fetch=1' : ''}`);
    updateWorkspaceUi(workspace);
    return workspace;
}

async function preparePublish() {
    if (state.current) {
        if (state.dirty) await saveArticle();
        if ($('#articleStatus').value === 'draft') {
            const confirmed = window.confirm('发布会把当前文章状态改为“已发布”，并同步到公开 GitHub。继续？');
            if (!confirmed) return;
            $('#articleStatus').value = 'published';
            setDirty();
            await saveArticle();
        }
    }
    await publishing.prepare($('#zhTitle').value.trim() || 'content update');
}

const publishing = new PublishingController({
    dialog: $('#publishDialog'),
    notify,
    onSuccess: async () => {
        setDirty(false);
        await Promise.all([loadArticles(), refreshWorkspace(true)]);
    }
});

function setSidebar(open) {
    document.body.classList.toggle('sidebar-open', open);
    $('#sidebarToggle').setAttribute('aria-expanded', String(open));
    $('#sidebarToggle').setAttribute('aria-label', open ? '关闭文章库' : '打开文章库');
}

function closeSidebar() {
    if (window.matchMedia('(max-width: 900px)').matches) setSidebar(false);
}

fields.forEach(id => {
    const element = $(`#${id}`);
    element.addEventListener('input', () => {
        if (id === 'zhTitle' && !state.originalId) $('#editorTitle').textContent = element.value || '未命名文章';
        if (id === 'articleStatus') $('#currentState').textContent = statusText(element.value);
        setDirty();
    });
    element.addEventListener('blur', () => element.checkValidity?.());
});

$('#markdownEditor').addEventListener('input', () => {
    state.bodies[state.activeLang] = $('#markdownEditor').value;
    setDirty();
    updateMetrics();
    schedulePreview();
    scheduleReadTime();
});

$('#markdownEditor').addEventListener('paste', event => {
    const image = [...(event.clipboardData?.files || [])].find(file => file.type.startsWith('image/'));
    if (!image) return;
    event.preventDefault();
    uploadImage(image).catch(error => notify(error.message, 'error'));
});

$('#markdownEditor').addEventListener('dragover', event => event.preventDefault());
$('#markdownEditor').addEventListener('drop', event => {
    const image = [...(event.dataTransfer?.files || [])].find(file => file.type.startsWith('image/'));
    if (!image) return;
    event.preventDefault();
    uploadImage(image).catch(error => notify(error.message, 'error'));
});

document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => applyMarkdownCommand($('#markdownEditor'), button.dataset.command)));
document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => switchLanguage(button.dataset.lang)));
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    const view = button.dataset.view;
    $('.workspace').dataset.view = view;
    document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('active', item === button));
}));

$('#newArticle').addEventListener('click', async () => { if (await confirmDiscardCurrent()) newArticle(); });
$('#sidebarToggle').addEventListener('click', () => setSidebar(!document.body.classList.contains('sidebar-open')));
$('#sidebarBackdrop').addEventListener('click', () => setSidebar(false));
$('#refreshArticles').addEventListener('click', () => Promise.all([loadArticles(), refreshWorkspace(true)]).then(() => notify('文章库已刷新', 'success')).catch(error => notify(error.message, 'error')));
$('#saveArticle').addEventListener('click', () => saveArticle().catch(error => notify(error.message, 'error')));
$('#publishArticle').addEventListener('click', () => preparePublish().catch(error => notify(error.message, 'error')));
$('#filterInput').addEventListener('input', renderList);
$('#statusFilter').addEventListener('change', renderList);
$('#imageUpload').addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (file) uploadImage(file).catch(error => notify(error.message, 'error'));
    event.target.value = '';
});
$('#chooseCover').addEventListener('click', () => openAssets().catch(error => notify(error.message, 'error')));
$('#closeAssets').addEventListener('click', () => $('#assetDialog').close());
$('#deleteArticle').addEventListener('click', () => $('#deleteDialog').showModal());
$('#deleteDialog').addEventListener('close', () => {
    if ($('#deleteDialog').returnValue === 'delete') deleteCurrentArticle().catch(error => notify(error.message, 'error'));
});

document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (!$('#saveArticle').disabled) saveArticle().catch(error => notify(error.message, 'error'));
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        applyMarkdownCommand($('#markdownEditor'), 'bold');
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'i') {
        event.preventDefault();
        applyMarkdownCommand($('#markdownEditor'), 'italic');
    }
});

window.addEventListener('beforeunload', event => {
    if (!state.dirty) return;
    persistRecovery();
    event.preventDefault();
});

setInterval(persistRecovery, 2000);

async function init() {
    setEnabled(false);
    const session = await api('/api/session');
    updateWorkspaceUi(session.workspace);
    await loadArticles();
    message(`后台已连接 · ${session.deployment.githubPagesUrl}`);
    if (state.articles.length) await loadArticle(state.articles[0].id);
    else newArticle();
}

init().catch(error => {
    message(error.message);
    notify(error.message, 'error');
});
