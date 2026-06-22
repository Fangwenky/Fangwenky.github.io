import fs from 'node:fs/promises';
import path from 'node:path';
import { stringifyFrontmatter } from '../src/frontmatter.js';
import TurndownService from 'turndown';
import { articles } from '../../../mypage/data/articlesData.js';
import { articleTranslations } from '../../../mypage/data/i18nData.js';
import { articlesRoot } from '../src/config.js';
import { articleDir, markdownPath, pickFrontmatter } from '../src/contentStore.js';

const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-'
});

turndown.addRule('preserveCodeLanguage', {
    filter: node => node.nodeName === 'PRE',
    replacement(content, node) {
        const code = node.querySelector('code');
        const className = code?.getAttribute('class') || '';
        const language = className.replace(/^language-/, '');
        return `\n\n\`\`\`${language}\n${code?.textContent || node.textContent || ''}\n\`\`\`\n\n`;
    }
});

function htmlToMarkdown(article) {
    if (article.type === 'md') return String(article.content || '').trim();
    return turndown.turndown(String(article.content || '')).trim();
}

function frontmatterFromArticle(article, overrides = {}) {
    return {
        id: article.id,
        title: overrides.title || article.title,
        excerpt: overrides.excerpt || article.excerpt,
        date: article.date,
        tags: overrides.tags || article.tags || [],
        category: overrides.category || article.category || '',
        cover: article.image,
        readTime: overrides.readTime || article.readTime || '',
        status: 'published',
        featured: Boolean(article.featured),
        updatedAt: new Date().toISOString()
    };
}

await fs.mkdir(articlesRoot, { recursive: true });

for (const article of articles) {
    const dir = articleDir(article.id);
    await fs.mkdir(path.join(dir, 'assets'), { recursive: true });

    const zhFrontmatter = frontmatterFromArticle(article);
    const zhMarkdown = htmlToMarkdown(article);
    await fs.writeFile(
        markdownPath(article.id, 'zh'),
        stringifyFrontmatter(`${zhMarkdown}\n`, pickFrontmatter(zhFrontmatter)),
        'utf8'
    );

    const enTranslation = articleTranslations.en?.[article.id];
    if (enTranslation) {
        const enFrontmatter = frontmatterFromArticle(article, enTranslation);
        const enMarkdown = enTranslation.content ? turndown.turndown(enTranslation.content).trim() : '';
        await fs.writeFile(
            markdownPath(article.id, 'en'),
            stringifyFrontmatter(`${enMarkdown}\n`, pickFrontmatter(enFrontmatter)),
            'utf8'
        );
    }
}

console.log(`Migrated ${articles.length} articles to ${articlesRoot}.`);
