import yaml from 'js-yaml';

export function parseFrontmatter(raw = '') {
    const source = String(raw).replace(/^\uFEFF/, '');
    if (!source.startsWith('---')) return { data: {}, content: source };
    const match = source.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
    if (!match) throw new Error('Invalid frontmatter block.');
    const data = yaml.load(match[1]) || {};
    if (typeof data !== 'object' || Array.isArray(data)) throw new Error('Frontmatter must be a YAML object.');
    return { data, content: source.slice(match[0].length) };
}

export function stringifyFrontmatter(content, data) {
    const header = yaml.dump(data, {
        lineWidth: -1,
        noRefs: true,
        sortKeys: false,
        quotingType: "'"
    }).trimEnd();
    return `---\n${header}\n---\n${String(content || '').replace(/^\s*\n/, '')}`;
}
