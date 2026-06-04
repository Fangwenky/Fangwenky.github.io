const params = new URLSearchParams(location.search);
const token = params.get('token') || sessionStorage.getItem('mypageAdminToken') || prompt('输入本次后台口令');
if (token) sessionStorage.setItem('mypageAdminToken', token);

const state = {
    articles: [],
    current: null,
    activeLang: 'zh',
    bodies: { zh: '', en: '' }
};

const $ = selector => document.querySelector(selector);
const api = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            'content-type': 'application/json',
            'x-admin-token': token,
            ...(options.headers || {})
        }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || '请求失败');
    return data;
};

function message(text) {
    $('#message').textContent = text;
}

function tagsFromInput(value) {
    return value.split(',').map(tag => tag.trim()).filter(Boolean);
}

function tagsToInput(tags) {
    return Array.isArray(tags) ? tags.join(', ') : '';
}

function englishReadTimeFrom(readTime) {
    const match = String(readTime || '').match(/\d+/);
    return match ? `${match[0]} min read` : '';
}

function currentMeta() {
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
        featured: false,
        updatedAt: new Date().toISOString()
    };

    return {
        zh: { frontmatter: base, body: state.bodies.zh },
        en: {
            frontmatter: {
                ...base,
                title: $('#enTitle').value.trim(),
                excerpt: $('#enExcerpt').value.trim(),
                tags: tagsFromInput($('#enTags').value),
                readTime: englishReadTimeFrom($('#articleReadTime').value)
            },
            body: state.bodies.en
        }
    };
}

function setEditorFromArticle(article) {
    state.current = article;
    state.bodies.zh = article.zh.body || '';
    state.bodies.en = article.en.body || '';
    const zh = article.zh.frontmatter;
    const en = article.en.frontmatter || {};
    $('#articleId').value = zh.id;
    $('#articleDate').value = zh.date;
    $('#articleCategory').value = zh.category;
    $('#articleReadTime').value = zh.readTime;
    $('#articleCover').value = zh.cover;
    $('#articleStatus').value = zh.status;
    $('#zhTitle').value = zh.title;
    $('#zhExcerpt').value = zh.excerpt;
    $('#zhTags').value = tagsToInput(zh.tags);
    $('#enTitle').value = en.title || '';
    $('#enExcerpt').value = en.excerpt || '';
    $('#enTags').value = tagsToInput(en.tags);
    $('#editorTitle').textContent = zh.title || zh.id;
    $('#currentState').textContent = zh.status;
    switchLang('zh');
}

async function renderPreview() {
    const markdown = $('#markdownEditor').value;
    const data = await api('/api/preview', {
        method: 'POST',
        body: JSON.stringify({ markdown })
    });
    $('#preview').innerHTML = data.html;
}

function switchLang(lang) {
    state.bodies[state.activeLang] = $('#markdownEditor').value;
    state.activeLang = lang;
    $('#markdownEditor').value = state.bodies[lang] || '';
    document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.lang === lang));
    renderPreview().catch(error => message(error.message));
}

function renderList() {
    const query = $('#filterInput').value.trim().toLowerCase();
    const status = $('#statusFilter').value;
    const list = $('#articleList');
    list.innerHTML = '';
    state.articles
        .filter(article => !status || article.status === status)
        .filter(article => !query || [article.title, article.category, ...(article.tags || [])].join(' ').toLowerCase().includes(query))
        .forEach(article => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `article-item ${state.current?.id === article.id ? 'active' : ''}`;
            const englishState = article.hasEnglish ? 'EN正文' : (article.hasEnglishMeta ? 'EN元信息' : '中文');
            button.innerHTML = `<strong>${article.title}</strong><span>${article.date || ''} · ${article.status} · ${englishState}</span>`;
            button.addEventListener('click', () => loadArticle(article.id));
            list.appendChild(button);
        });
}

async function loadArticles() {
    state.articles = await api('/api/articles');
    renderList();
}

async function loadArticle(id) {
    const article = await api(`/api/articles/${encodeURIComponent(id)}`);
    setEditorFromArticle(article);
    renderList();
    message(`已加载：${article.zh.frontmatter.title}`);
}

function newArticle() {
    const today = new Date().toISOString().slice(0, 10);
    setEditorFromArticle({
        id: '',
        zh: {
            frontmatter: {
                id: '',
                title: '',
                excerpt: '',
                date: today,
                tags: [],
                category: '学习笔记',
                cover: '',
                readTime: '3 分钟阅读',
                status: 'draft',
                featured: false,
                updatedAt: new Date().toISOString()
            },
            body: ''
        },
        en: { exists: false, frontmatter: null, body: '' }
    });
    message('已创建空白草稿');
}

async function saveArticle() {
    state.bodies[state.activeLang] = $('#markdownEditor').value;
    const saved = await api('/api/articles', {
        method: 'POST',
        body: JSON.stringify(currentMeta())
    });
    setEditorFromArticle(saved);
    await loadArticles();
    message('草稿已保存');
}

async function uploadImage(file) {
    const id = $('#articleId').value.trim();
    if (!id) throw new Error('请先填写并保存文章 ID。');
    const form = new FormData();
    form.append('image', file);
    const response = await fetch(`/api/articles/${encodeURIComponent(id)}/upload`, {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: form
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '上传失败');
    const editor = $('#markdownEditor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = `${editor.value.slice(0, start)}${data.markdown}${editor.value.slice(end)}`;
    state.bodies[state.activeLang] = editor.value;
    await renderPreview();
    message(`已插入图片：${data.path}`);
}

$('#newArticle').addEventListener('click', newArticle);
$('#refreshArticles').addEventListener('click', () => loadArticles().catch(error => message(error.message)));
$('#saveArticle').addEventListener('click', () => saveArticle().catch(error => message(error.message)));
$('#generateSite').addEventListener('click', () => api('/api/generate', { method: 'POST', body: '{}' }).then(data => message(`已生成 ${data.articleCount} 篇文章`)).catch(error => message(error.message)));
$('#publishArticle').addEventListener('click', () => {
    saveArticle()
        .then(() => api('/api/publish', { method: 'POST', body: JSON.stringify({ title: $('#zhTitle').value.trim() }) }))
        .then(data => message(data.pushed ? '已提交并推送到当前分支' : data.message))
        .catch(error => message(error.message));
});
$('#filterInput').addEventListener('input', renderList);
$('#statusFilter').addEventListener('change', renderList);
$('#markdownEditor').addEventListener('input', () => {
    state.bodies[state.activeLang] = $('#markdownEditor').value;
    renderPreview().catch(error => message(error.message));
});
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => switchLang(tab.dataset.lang)));
$('#imageUpload').addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (file) uploadImage(file).catch(error => message(error.message));
    event.target.value = '';
});

api('/api/session')
    .then(loadArticles)
    .then(() => message('后台已连接'))
    .catch(error => message(error.message));
