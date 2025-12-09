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

function createTimeline() {
    const allItems = [...articles, ...projects];
    const groupedItems = groupAndSortByYear(allItems);
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    const years = Object.keys(groupedItems).sort((a, b) => b - a);
    years.forEach(year => {
        const yearSection = document.createElement('div');
        yearSection.className = 'timeline-year-section';
        yearSection.innerHTML = `<h3>${year}</h3>`;
        const grid = document.createElement('div');
        grid.className = 'articles-grid';
        groupedItems[year].forEach(item => {
            const isArticle = 'excerpt' in item;
            const card = document.createElement('article');
            card.className = 'article-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="article-image">
                <div class="article-content">
                    <div class="article-meta">
                        <span><i class="far fa-calendar"></i> ${item.date}</span>
                        ${isArticle ? `<span><i class="far fa-clock"></i> ${item.readTime}</span>` : ''}
                    </div>
                    <h3 class="article-title">${item.title}</h3>
                    <p class="article-excerpt">${isArticle ? item.excerpt : item.description}</p>
                    <div class="article-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                window.location.href = isArticle ? `article-detail.html?id=${item.id}` : `project-detail.html?id=${item.id}`;
            });
            grid.appendChild(card);
        });
        yearSection.appendChild(grid);
        timelineContainer.appendChild(yearSection);
    });
}

export { createTimeline };
