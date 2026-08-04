import { api, importContentFolder, uploadArticleImage, uploadProjectImage } from './api.js';
import { clearRecovery, listRecoveries, loadRecovery, saveRecovery } from './drafts.js';
import { applyMarkdownCommand, insertAtCursor, previewDocument, projectPreviewDocument } from './editor.js';
import { PublishingController } from './publish.js';

const $ = selector => document.querySelector(selector);
const desktopSidebarKey = 'mypageAdminSidebarCollapsed';
const fields = [
    'articleId', 'articleDate', 'articleCategory', 'articleReadTime', 'articleCover',
    'articleStatus', 'articleFeatured', 'zhTitle', 'enTitle', 'zhExcerpt', 'enExcerpt',
    'zhTags', 'enTags', 'projectTitle', 'projectDescription', 'projectTags', 'projectLink'
];
const projectRecoveryNamespace = 'project';
const state = {
    mode: 'article',
    articles: [],
    projects: [],
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
    fields.forEach(id => {
        const element = $(`#${id}`);
        const articleOnly = ['articleReadTime', 'articleStatus', 'articleFeatured', 'zhTitle', 'enTitle', 'zhExcerpt', 'enExcerpt', 'zhTags', 'enTags'].includes(id);
        const projectOnly = ['projectTitle', 'projectDescription', 'projectTags', 'projectLink'].includes(id);
        element.disabled = !enabled
            || (id === 'articleId' && Boolean(state.originalId))
            || (state.mode === 'project' && articleOnly)
            || (state.mode === 'article' && projectOnly);
    });
    document.querySelectorAll('.format-tools button, .format-tools input').forEach(control => { control.disabled = !enabled; });
    document.querySelectorAll('.language-tabs button').forEach(control => { control.disabled = !enabled || state.mode === 'project'; });
}

function updatePublishButton() {
    const blocked = Boolean(state.workspace?.blockers?.length);
    const hasCandidate = Boolean(state.current) || Boolean(state.workspace?.publishableFiles?.length);
    $('#publishArticle').disabled = blocked || !hasCandidate;
}

function articlePayload() {
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

function projectPayload() {
    return {
        id: $('#articleId').value.trim(),
        originalId: state.originalId,
        title: $('#projectTitle').value.trim(),
        description: $('#projectDescription').value.trim(),
        image: $('#articleCover').value.trim(),
        tags: tagsFromInput($('#projectTags').value),
        link: $('#projectLink').value.trim(),
        category: $('#articleCategory').value.trim(),
        date: $('#articleDate').value,
        contentType: 'markdown',
        content: $('#markdownEditor').value.trim()
    };
}

function currentPayload() {
    return state.mode === 'project' ? projectPayload() : articlePayload();
}

function applyPayload(payload) {
    if (state.mode === 'project') {
        applyProjectPayload(payload);
        return;
    }
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

function applyProjectPayload(project = {}) {
    state.bodies = { zh: project.content || '', en: '' };
    $('#articleId').value = project.id || '';
    $('#articleDate').value = project.date || new Date().toISOString().slice(0, 10);
    $('#articleCategory').value = project.category || '项目';
    $('#articleCover').value = project.image || '';
    $('#projectTitle').value = project.title || '';
    $('#projectDescription').value = project.description || '';
    $('#projectTags').value = tagsToInput(project.tags);
    $('#projectLink').value = project.link || '';
    state.activeLang = 'zh';
    $('#markdownEditor').value = state.bodies.zh;
    updateMetrics();
    schedulePreview();
}

async function renderPreview() {
    if (state.mode === 'project') {
        const payload = projectPayload();
        const data = await api('/api/project-preview', { method: 'POST', body: JSON.stringify({ markdown: payload.content }) });
        $('#previewFrame').srcdoc = projectPreviewDocument({ ...payload, content: data.html });
        return;
    }
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
    if (state.mode === 'project') return;
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
    if (state.mode === 'project') return;
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
    if (state.mode === 'project') {
        const filteredProjects = state.projects
            .filter(project => !query || [project.title, project.description, project.category, ...(project.tags || [])].join(' ').toLowerCase().includes(query));
        list.innerHTML = filteredProjects.map(project => {
            const active = state.originalId === project.id;
            return `<button type="button" class="article-item ${active ? 'active' : ''}" data-id="${project.id}">
                <span class="article-item-top"><strong>${project.title}</strong>${active && state.dirty ? '<i>未保存</i>' : ''}</span>
                <span>${project.date || '无日期'} · ${project.category || '未分类'}</span>
                <small>${(project.tags || []).join(', ') || '无标签'}</small>
            </button>`;
        }).join('') || '<p class="empty-state">没有符合条件的项目。</p>';
        list.querySelectorAll('[data-id]').forEach(button => button.addEventListener('click', () => loadProject(button.dataset.id)));
        return;
    }
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
    const recoveries = listRecoveries(state.mode === 'project' ? projectRecoveryNamespace : '').filter(item => item.id.startsWith('new-'));
    const label = state.mode === 'project' ? '未写入源码的项目恢复稿' : '未写入源码的恢复稿';
    $('#recoveryList').innerHTML = recoveries.length ? `
        <p class="list-label">${label}</p>
        ${recoveries.map(item => `<div class="recovery-row"><button type="button" class="recovery-item" data-recovery="${item.id}"><strong>${item.payload?.title || item.payload?.zh?.frontmatter?.title || '未命名内容'}</strong><span>${new Date(item.savedAt).toLocaleString()}</span></button><button type="button" class="discard-recovery" data-discard-recovery="${item.id}" aria-label="丢弃恢复稿">×</button></div>`).join('')}
    ` : '';
    document.querySelectorAll('[data-recovery]').forEach(button => button.addEventListener('click', () => openRecoveryDraft(button.dataset.recovery)));
    document.querySelectorAll('[data-discard-recovery]').forEach(button => button.addEventListener('click', () => {
        clearRecovery(button.dataset.discardRecovery, state.mode === 'project' ? projectRecoveryNamespace : '');
        renderRecoveries();
        notify('已丢弃恢复稿', 'success');
    }));
}

async function loadArticles() {
    state.articles = await api('/api/articles');
    renderList();
    renderRecoveries();
}

async function loadProjects() {
    state.projects = await api('/api/projects');
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

async function loadProject(id) {
    if (!(await confirmDiscardCurrent())) return;
    const project = await api(`/api/projects/${encodeURIComponent(id)}`);
    state.suspended = true;
    state.current = project;
    state.originalId = project.id;
    state.recoveryId = project.id;
    state.sourceUpdatedAt = '';
    applyProjectPayload(project);
    $('#articleId').disabled = true;
    $('#editorTitle').textContent = project.title || project.id;
    $('#currentState').textContent = '项目';
    setEnabled(true);
    state.suspended = false;
    setDirty(false);
    updatePublishButton();
    renderList();
    message(`已加载项目：${project.title}`);
    closeSidebar();

    const recovery = loadRecovery(id, projectRecoveryNamespace);
    if (recovery) {
        const choice = await askRecovery(recovery);
        if (choice === 'restore') {
            applyProjectPayload(recovery.payload);
            setDirty(true);
            notify('已恢复浏览器中的项目恢复稿', 'success');
        } else {
            clearRecovery(id, projectRecoveryNamespace);
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

function newProject(recoveryId = `new-${crypto.randomUUID()}`) {
    state.suspended = true;
    state.current = { id: '' };
    state.originalId = '';
    state.recoveryId = recoveryId;
    state.sourceUpdatedAt = '';
    applyProjectPayload({
        id: '',
        title: '',
        description: '',
        image: '',
        tags: [],
        link: '',
        category: '项目',
        date: new Date().toISOString().slice(0, 10),
        contentType: 'markdown',
        content: '## 项目亮点\n\n写下这个项目解决的问题、你的实现方式和最终效果。'
    });
    $('#articleId').disabled = false;
    $('#editorTitle').textContent = '未命名项目';
    $('#currentState').textContent = '本地项目';
    setEnabled(true);
    state.suspended = false;
    state.dirty = false;
    $('#saveState').textContent = '尚未写入源码';
    $('#saveState').classList.remove('dirty');
    updatePublishButton();
    renderList();
    $('#projectTitle').focus();
    message('新项目尚未写入源码');
}

function openRecoveryDraft(id) {
    const namespace = state.mode === 'project' ? projectRecoveryNamespace : '';
    const recovery = loadRecovery(id, namespace);
    if (!recovery) return;
    if (state.mode === 'project') newProject(id);
    else newArticle(id);
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

function validateProject() {
    if (!$('#articleId').value.trim()) $('#articleId').value = deriveId($('#projectTitle').value).replace(/^article-/, 'project-');
    if (!$('#projectTitle').value.trim()) throw new Error('项目标题不能为空。');
    if (!$('#projectDescription').value.trim()) throw new Error('项目简介不能为空。');
    if (!$('#articleCategory').value.trim()) throw new Error('项目分类不能为空。');
    if (!$('#articleCover').value.trim()) throw new Error('项目图片不能为空。');
    if (!$('#markdownEditor').value.trim()) throw new Error('项目详情不能为空。');
    if (!$('#articleForm').reportValidity()) throw new Error('请先补全项目必填信息。');
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

async function saveProject() {
    validateProject();
    const previousRecovery = state.recoveryId;
    const saved = await api('/api/projects', { method: 'POST', body: JSON.stringify(projectPayload()) });
    clearRecovery(previousRecovery, projectRecoveryNamespace);
    state.suspended = true;
    state.current = saved;
    state.originalId = saved.id;
    state.recoveryId = saved.id;
    applyProjectPayload(saved);
    $('#articleId').disabled = true;
    $('#editorTitle').textContent = saved.title;
    $('#currentState').textContent = '项目';
    state.suspended = false;
    setDirty(false);
    await Promise.all([loadProjects(), refreshWorkspace()]);
    message('项目已保存到源码');
    notify('项目已写入 projectsData.js', 'success');
    return saved;
}

async function saveCurrent() {
    return state.mode === 'project' ? saveProject() : saveArticle();
}

async function handleFolderImport(fileList) {
    const files = [...fileList];
    if (!files.length) return;
    if (!files.every(file => file.webkitRelativePath)) {
        throw new Error('浏览器没有提供文件夹结构，请使用“导入”按钮重新选择整个文件夹。');
    }
    const mode = state.mode;
    const kind = mode === 'project' ? '项目' : '草稿文章';
    if (!window.confirm(`将这个文件夹创建为新的${kind}并写入本地源码，是否继续？`)) return;

    const button = $('#importFolder');
    button.disabled = true;
    button.textContent = '导入中…';
    message(`正在读取文件夹并创建${kind}…`);
    try {
        const result = await importContentFolder(mode, files);
        state.dirty = false;
        if (state.mode !== mode) await switchContentMode(mode);
        await Promise.all([mode === 'project' ? loadProjects() : loadArticles(), refreshWorkspace()]);
        if (mode === 'project') await loadProject(result.id);
        else await loadArticle(result.id);
        const detail = `${result.assetCount} 个图片或附件`;
        message(`已导入${kind}：${result.title} · ${detail}`);
        notify(result.warnings?.[0] || `文件夹已导入，共 ${detail}`, result.warnings?.length ? 'warning' : 'success');
    } finally {
        button.disabled = false;
        button.textContent = '导入';
    }
}

function persistRecovery() {
    if (!state.current || !state.dirty || !state.recoveryId) return;
    saveRecovery(state.recoveryId, { payload: currentPayload(), sourceUpdatedAt: state.sourceUpdatedAt }, state.mode === 'project' ? projectRecoveryNamespace : '');
    $('#saveState').textContent = '未保存 · 恢复稿已更新';
    renderRecoveries();
}

async function uploadImage(file, { asCover = false } = {}) {
    if (state.mode === 'project') {
        if (!file.type.startsWith('image/')) throw new Error('只能上传图片文件。');
        const result = await uploadProjectImage(file);
        if (asCover) {
            $('#articleCover').value = result.path;
        } else {
            insertAtCursor($('#markdownEditor'), `![${result.name}](${result.path})`);
        }
        setDirty();
        notify(`已上传 ${result.name}`, 'success');
        return result;
    }
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
    if (state.mode === 'project') {
        const assets = await api('/api/projects/assets');
        $('#assetGrid').innerHTML = assets.length ? assets.map(asset => `
            <button type="button" data-asset-path="${asset.path}"><img src="${asset.url}" alt=""><span>${asset.name}</span></button>
        `).join('') : '<p class="empty-state">还没有可选的项目图片。</p>';
        $('#assetGrid').querySelectorAll('[data-asset-path]').forEach(button => button.addEventListener('click', () => {
            $('#articleCover').value = button.dataset.assetPath;
            setDirty();
            $('#assetDialog').close();
        }));
        $('#assetDialog').showModal();
        return;
    }
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

async function deleteCurrentProject() {
    if (!state.originalId) return;
    await api(`/api/projects/${encodeURIComponent(state.originalId)}`, { method: 'DELETE' });
    clearRecovery(state.originalId, projectRecoveryNamespace);
    state.current = null;
    state.originalId = '';
    state.recoveryId = '';
    setEnabled(false);
    $('#editorTitle').textContent = '项目已删除';
    $('#currentState').textContent = '待发布';
    $('#saveState').textContent = '删除将在下一次发布时同步';
    $('#markdownEditor').value = '';
    $('#previewFrame').srcdoc = projectPreviewDocument({ content: '<p>选择其他项目继续编辑，或直接发布这次删除。</p>' });
    await Promise.all([loadProjects(), refreshWorkspace()]);
    notify('项目源码已删除，尚未提交', 'warning');
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
        if (state.dirty) await saveCurrent();
        if (state.mode === 'article' && $('#articleStatus').value === 'draft') {
            const confirmed = window.confirm('发布会把当前文章状态改为“已发布”，并同步到公开 GitHub。继续？');
            if (!confirmed) return;
            $('#articleStatus').value = 'published';
            setDirty();
            await saveArticle();
        }
    }
    await publishing.prepare((state.mode === 'project' ? $('#projectTitle').value.trim() : $('#zhTitle').value.trim()) || 'content update');
}

const publishing = new PublishingController({
    dialog: $('#publishDialog'),
    notify,
    onSuccess: async () => {
        setDirty(false);
        await Promise.all([state.mode === 'project' ? loadProjects() : loadArticles(), refreshWorkspace(true)]);
    }
});

function setSidebar(open) {
    document.body.classList.toggle('sidebar-open', open);
    $('#sidebarToggle').setAttribute('aria-expanded', String(open));
    $('#sidebarToggle').setAttribute('aria-label', open ? '关闭文章库' : '打开文章库');
}

function setDesktopSidebar(collapsed, persist = true) {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    $('#sidebarToggle').setAttribute('aria-expanded', String(!collapsed));
    $('#sidebarToggle').setAttribute('aria-label', collapsed ? '打开文章库' : '收起文章库');
    if (persist) localStorage.setItem(desktopSidebarKey, collapsed ? '1' : '0');
}

function closeSidebar() {
    if (window.matchMedia('(max-width: 900px)').matches) setSidebar(false);
}

function updateModeUi() {
    const projectMode = state.mode === 'project';
    document.body.dataset.mode = state.mode;
    $('#libraryTitle').textContent = projectMode ? '项目库' : '文章库';
    $('#filterLabel').textContent = projectMode ? '搜索项目' : '搜索文章';
    $('#filterInput').placeholder = projectMode ? '搜索项目、标签或分类' : '搜索标题、标签或分类';
    $('#statusFilter').hidden = projectMode;
    $('#refreshArticles').textContent = projectMode ? '刷新项目库' : '刷新文章库';
    $('#newArticle').setAttribute('aria-label', projectMode ? '新建项目' : '新建文章');
    $('#newArticle').setAttribute('title', projectMode ? '新建项目' : '新建文章');
    $('#importFolder').setAttribute('aria-label', projectMode ? '导入项目文件夹' : '导入文章文件夹');
    $('#importFolder').setAttribute('title', projectMode ? '导入项目文件夹' : '导入文章文件夹');
    $('#metaTitle').textContent = projectMode ? '项目信息' : '文章信息';
    $('#metaSubtitle').textContent = projectMode ? '标题、简介、封面、链接与详情' : '标题、分类、封面与发布状态';
    $('#contentIdLabel').textContent = projectMode ? '项目 ID' : '文章 ID';
    $('#articleIdHelp').textContent = projectMode ? '首次保存后锁定，用作项目标识和详情链接。' : '首次保存后锁定，用作目录名和链接。';
    $('#collapseSidebar').setAttribute('aria-label', projectMode ? '收起项目库' : '收起文章库');
    $('#collapseSidebar').setAttribute('title', projectMode ? '收起项目库' : '收起文章库');
    $('#assetDialog h2').textContent = projectMode ? '选择项目图片' : '选择文章图片';
    $('#saveArticle').textContent = projectMode ? '保存项目源码' : '保存到源码';
    $('#publishArticle').textContent = '准备发布';
    $('#deleteArticle').textContent = projectMode ? '删除项目' : '删除';
    $('#markdownEditor').placeholder = projectMode ? '在这里写项目详情 Markdown…' : '在这里写 Markdown…';
    $('#wordCount').nextElementSibling.textContent = projectMode ? '支持粘贴或拖入项目图片' : '支持粘贴或拖入图片';
    document.querySelectorAll('.article-field').forEach(element => { element.hidden = projectMode; });
    document.querySelectorAll('.project-field').forEach(element => { element.hidden = !projectMode; });
    ['articleReadTime', 'autoReadTime', 'articleFeatured'].forEach(id => {
        const field = $(`#${id}`)?.closest('label');
        if (field) field.hidden = projectMode;
    });
    $('#articleStatus').closest('label').hidden = projectMode;
    document.querySelectorAll('.language-tabs button').forEach(button => { button.hidden = projectMode && button.dataset.lang === 'en'; });
    $('#articleMode').classList.toggle('active', !projectMode);
    $('#projectMode').classList.toggle('active', projectMode);
    $('#articleMode').setAttribute('aria-selected', String(!projectMode));
    $('#projectMode').setAttribute('aria-selected', String(projectMode));
    setEnabled(Boolean(state.current));
}

function openDeleteDialog() {
    const projectMode = state.mode === 'project';
    $('#deleteDialog h2').textContent = projectMode ? '删除这个项目？' : '删除这篇文章？';
    $('#deleteMessage').textContent = projectMode
        ? '项目记录和专属导入附件会一起删除；共享图片不会自动删除。下一次发布后网站同步移除这个项目。'
        : '文章源码和专属图片目录都会删除。已发布文章会在下一次发布时从网站移除。';
    $('#deleteDialog').showModal();
}

async function switchContentMode(mode) {
    if (state.mode === mode) return;
    if (!(await confirmDiscardCurrent())) return;
    state.mode = mode;
    state.current = null;
    state.originalId = '';
    state.recoveryId = '';
    state.dirty = false;
    $('#filterInput').value = '';
    $('#statusFilter').value = '';
    $('#editorTitle').textContent = mode === 'project' ? '准备管理项目' : '准备开始写作';
    $('#currentState').textContent = '未选择';
    $('#saveState').textContent = mode === 'project' ? '请选择或新建项目' : '请选择或新建文章';
    $('#markdownEditor').value = '';
    $('#previewFrame').srcdoc = '';
    updateModeUi();
    if (mode === 'project') {
        await loadProjects();
        if (state.projects.length) await loadProject(state.projects[0].id);
        else newProject();
    } else {
        await loadArticles();
        if (state.articles.length) await loadArticle(state.articles[0].id);
        else newArticle();
    }
}

fields.forEach(id => {
    const element = $(`#${id}`);
    element.addEventListener('input', () => {
        if (id === 'zhTitle' && !state.originalId) $('#editorTitle').textContent = element.value || '未命名文章';
        if (id === 'projectTitle' && !state.originalId) $('#editorTitle').textContent = element.value || '未命名项目';
        if (id === 'articleStatus') $('#currentState').textContent = statusText(element.value);
        setDirty();
        if (state.mode === 'project') schedulePreview();
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

document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => {
    applyMarkdownCommand($('#markdownEditor'), button.dataset.command);
}));
document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => switchLanguage(button.dataset.lang)));
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    const view = button.dataset.view;
    $('.workspace').dataset.view = view;
    document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('active', item === button));
}));

$('#articleMode').addEventListener('click', () => switchContentMode('article').catch(error => notify(error.message, 'error')));
$('#projectMode').addEventListener('click', () => switchContentMode('project').catch(error => notify(error.message, 'error')));
$('#newArticle').addEventListener('click', async () => {
    if (!(await confirmDiscardCurrent())) return;
    if (state.mode === 'project') newProject();
    else newArticle();
});
$('#importFolder').addEventListener('click', () => {
    if (state.dirty) {
        persistRecovery();
        if (!window.confirm('当前修改尚未写入源码，已保存为浏览器恢复稿。继续选择导入文件夹？')) return;
    }
    $('#folderUpload').click();
});
$('#folderUpload').addEventListener('change', event => {
    handleFolderImport(event.target.files)
        .catch(error => notify(error.message, 'error'))
        .finally(() => { event.target.value = ''; });
});
$('#collapseSidebar').addEventListener('click', () => setDesktopSidebar(true));
$('#sidebarToggle').addEventListener('click', () => {
    if (window.matchMedia('(max-width: 900px)').matches) {
        setSidebar(!document.body.classList.contains('sidebar-open'));
    } else {
        setDesktopSidebar(false);
    }
});
$('#sidebarBackdrop').addEventListener('click', () => setSidebar(false));
$('#refreshArticles').addEventListener('click', () => Promise.all([state.mode === 'project' ? loadProjects() : loadArticles(), refreshWorkspace(true)]).then(() => notify(state.mode === 'project' ? '项目库已刷新' : '文章库已刷新', 'success')).catch(error => notify(error.message, 'error')));
$('#saveArticle').addEventListener('click', () => saveCurrent().catch(error => notify(error.message, 'error')));
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
$('#deleteArticle').addEventListener('click', openDeleteDialog);
$('#deleteDialog').addEventListener('close', () => {
    if ($('#deleteDialog').returnValue === 'delete') {
        const action = state.mode === 'project' ? deleteCurrentProject : deleteCurrentArticle;
        action().catch(error => notify(error.message, 'error'));
    }
});

document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (!$('#saveArticle').disabled) saveCurrent().catch(error => notify(error.message, 'error'));
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
    setDesktopSidebar(localStorage.getItem(desktopSidebarKey) === '1', false);
    updateModeUi();
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
