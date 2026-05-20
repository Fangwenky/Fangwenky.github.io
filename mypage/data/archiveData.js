import { articles } from './articlesData.js';
import { projects } from './projectsData.js';

function groupAndSortByYear(items) {
    const grouped = {};
    items.forEach(item => {
        const year = new Date(item.date).getFullYear();
        if (!grouped[year]) {
            grouped[year] = [];
        }
        grouped[year].push(item);
    });
    for (const year in grouped) {
        grouped[year].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return grouped;
}

function createTimeline(options = {}) {
    const prefersReducedMotion = typeof options === 'boolean'
        ? options
        : Boolean(options.prefersReducedMotion);
    const localizeItem = typeof options.localizeItem === 'function'
        ? options.localizeItem
        : item => item;
    const labels = options.labels || { tags: '标签' };
    const allItems = [...articles, ...projects];
    const groupedItems = groupAndSortByYear(allItems);
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    timelineContainer.innerHTML = '';
    const years = Object.keys(groupedItems).sort((a, b) => b - a);
    years.forEach(year => {
        const yearSection = document.createElement('div');
        yearSection.className = 'timeline-year-section';
        yearSection.innerHTML = `<h3>${year}</h3>`;
        const timeline = document.createElement('div');
        timeline.className = 'timeline';
        groupedItems[year].forEach(item => {
            const isArticle = 'excerpt' in item;
            const itemType = isArticle ? 'article' : 'project';
            const displayItem = localizeItem(item, itemType);
            const timelineItem = document.createElement('a');
            timelineItem.className = 'timeline-item';
            timelineItem.href = isArticle ? `article-detail.html?id=${item.id}` : `project-detail.html?id=${item.id}`;
            if (prefersReducedMotion) {
                timelineItem.style.transform = 'none';
            }
            timelineItem.innerHTML = `
                <div class="timeline-item-content">
                    <div class="timeline-item-left">
                        <span class="timeline-date">${displayItem.date}</span>
                        <h4 class="timeline-title">${displayItem.title}</h4>
                        <p class="timeline-excerpt">${isArticle ? displayItem.excerpt : displayItem.description}</p>
                        <div class="article-tags" aria-label="${labels.tags || '标签'}">
                            ${(displayItem.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="timeline-item-right">
                        <img src="${displayItem.image}" alt="${displayItem.title}" width="320" height="180" loading="lazy">
                    </div>
                </div>
            `;
            timeline.appendChild(timelineItem);
        });
        yearSection.appendChild(timeline);
        timelineContainer.appendChild(yearSection);
    });
}

export { createTimeline };
