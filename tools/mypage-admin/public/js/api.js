const params = new URLSearchParams(location.search);
const token = params.get('token') || sessionStorage.getItem('mypageAdminToken') || window.prompt('输入本次后台口令');
if (token) {
    sessionStorage.setItem('mypageAdminToken', token);
    if (params.has('token')) history.replaceState(null, '', `${location.pathname}${location.hash}`);
}

export async function api(url, options = {}) {
    const headers = { 'x-admin-token': token, ...(options.headers || {}) };
    if (!(options.body instanceof FormData)) headers['content-type'] = 'application/json';
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `请求失败（${response.status}）`);
    return data;
}

export async function uploadArticleImage(id, file) {
    const form = new FormData();
    form.append('image', file);
    return api(`/api/articles/${encodeURIComponent(id)}/upload`, { method: 'POST', body: form });
}

export async function uploadProjectImage(file) {
    const form = new FormData();
    form.append('image', file);
    return api('/api/projects/upload', { method: 'POST', body: form });
}

export async function importContentFolder(mode, files) {
    const form = new FormData();
    const relativePaths = [];
    for (const file of files) {
        form.append('files', file, file.name);
        relativePaths.push(file.webkitRelativePath || file.name);
    }
    form.append('mode', mode);
    form.append('relativePaths', JSON.stringify(relativePaths));
    return api('/api/import/folder', { method: 'POST', body: form });
}

export { token };
