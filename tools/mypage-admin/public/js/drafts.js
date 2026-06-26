const defaultPrefix = 'mypageAdminRecovery:v2:';
const maxAgeMs = 30 * 24 * 60 * 60 * 1000;

function prefixFor(namespace = '') {
    return namespace ? `mypageAdminRecovery:${namespace}:v1:` : defaultPrefix;
}

export function draftKey(id, namespace = '') {
    const prefix = prefixFor(namespace);
    return `${prefix}${id}`;
}

export function saveRecovery(id, value, namespace = '') {
    localStorage.setItem(draftKey(id, namespace), JSON.stringify({ ...value, savedAt: new Date().toISOString() }));
}

export function loadRecovery(id, namespace = '') {
    try {
        const raw = localStorage.getItem(draftKey(id, namespace));
        if (!raw) return null;
        const value = JSON.parse(raw);
        if (Date.now() - new Date(value.savedAt).getTime() > maxAgeMs) {
            clearRecovery(id, namespace);
            return null;
        }
        return value;
    } catch (error) {
        return null;
    }
}

export function clearRecovery(id, namespace = '') {
    localStorage.removeItem(draftKey(id, namespace));
}

export function listRecoveries(namespace = '') {
    const prefix = prefixFor(namespace);
    const recoveries = [];
    for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (!key?.startsWith(prefix)) continue;
        const id = key.slice(prefix.length);
        const value = loadRecovery(id, namespace);
        if (value) recoveries.push({ id, ...value });
    }
    return recoveries.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
}
