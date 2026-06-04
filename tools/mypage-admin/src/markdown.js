import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
    'img',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'pre',
    'code',
    'span',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td'
]);

const allowedAttributes = {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    code: ['class'],
    span: ['class'],
    th: ['align'],
    td: ['align']
};

export function renderMarkdown(markdown = '') {
    const html = marked.parse(String(markdown || '').trim());
    return sanitizeHtml(html, {
        allowedTags,
        allowedAttributes,
        allowedSchemes: ['http', 'https', 'mailto'],
        allowedSchemesByTag: {
            img: ['http', 'https']
        },
        allowedSchemesAppliedToAttributes: ['href', 'src'],
        allowProtocolRelative: false,
        transformTags: {
            a: sanitizeHtml.simpleTransform('a', {
                rel: 'noopener noreferrer'
            }, true),
            img: (tagName, attribs) => ({
                tagName,
                attribs: {
                    ...attribs,
                    loading: attribs.loading || 'lazy'
                }
            })
        }
    });
}
