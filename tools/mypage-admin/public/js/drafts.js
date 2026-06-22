const prefix = 'mypageAdminRecovery:v2:';
const maxAgeMs = 30 * 24 * 60 * 60 * 1000;

export function draftKey(id) {
    return `${prefix}${id}`;
}

export function saveRecovery(id, value) {
    localStorage.setItem(draftKey(id), JSON.stringify({ ...value, savedAt: new Date().toISOString() }));
}

export function loadRecovery(id) {
    try {
        const raw = localStorage.getItem(draftKey(id));
        if (!raw) return null;
        const value = JSON.parse(raw);
        if (Date.now() - new Date(value.savedAt).getTime() > maxAgeMs) {
            clearRecovery(id);
            return null;
        }
        return value;
    } catch (error) {
        return null;
    }
}

export function clearRecovery(id) {
    localStorage.removeItem(draftKey(id));
}

export function listRecoveries() {
    const recoveries = [];
    for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (!key?.startsWith(prefix)) continue;
        const id = key.slice(prefix.length);
        const value = loadRecovery(id);
        if (value) recoveries.push({ id, ...value });
    }
    return recoveries.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
}
