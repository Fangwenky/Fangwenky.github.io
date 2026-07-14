import { articles } from './data/articlesData.js';
import { projects } from './data/projectsData.js';
import { skills } from './data/skillsData.js';
import { aboutMe } from './data/aboutMeData.js';
import { createTimeline } from './data/archiveData.js';
import { uiText, articleTranslations, projectTranslations, aboutTranslations } from './data/i18nData.js';

const prefersReducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearch = document.getElementById('closeSearch');
const supportedLanguages = ['zh', 'en'];
const allowedContentTags = new Set(['A', 'BLOCKQUOTE', 'BR', 'CODE', 'DEL', 'EM', 'FIGCAPTION', 'FIGURE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HR', 'IMG', 'LI', 'OL', 'P', 'PRE', 'S', 'SPAN', 'STRONG', 'TABLE', 'TBODY', 'TD', 'TH', 'THEAD', 'TR', 'UL']);
const allowedContentAttributes = new Set(['align', 'alt', 'class', 'height', 'href', 'id', 'loading', 'name', 'rel', 'src', 'target', 'title', 'width']);

function getUrlLanguage() {
    const language = new URLSearchParams(window.location.search).get('lang');
    return supportedLanguages.includes(language) ? language : null;
}

function getStoredLanguage() {
    try {
        return window.localStorage?.getItem('siteLang');
    } catch (error) {
        return null;
    }
}

function setStoredLanguage(language) {
    try {
        window.localStorage?.setItem('siteLang', language);
    } catch (error) {
        // Language switching still works for the current page even if storage is unavailable.
    }
}

let currentLang = getUrlLanguage() || getStoredLanguage() || 'zh';

if (!supportedLanguages.includes(currentLang)) {
    currentLang = 'zh';
}

function textBundle() {
    return uiText[currentLang] || uiText.zh;
}

function t(key, ...args) {
    const value = textBundle()[key] ?? uiText.zh[key] ?? key;
    return typeof value === 'function' ? value(...args) : value;
}

function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    })[character]);
}

function isSafeContentUrl(value, attribute) {
    const raw = String(value || '').trim();
    if (!raw) return false;
    if (raw.startsWith('#')) return attribute === 'href';
    try {
        const url = new URL(raw, window.location.href);
        if (attribute === 'href') return ['http:', 'https:', 'mailto:'].includes(url.protocol);
        return ['http:', 'https:'].includes(url.protocol) && !raw.startsWith('data:');
    } catch {
        return false;
    }
}

function sanitizeRenderedHtml(html = '') {
    const template = document.createElement('template');
    template.innerHTML = String(html || '');
    template.content.querySelectorAll('script, style, iframe, object, embed, form, input, button').forEach(element => element.remove());
    template.content.querySelectorAll('*').forEach(element => {
        if (!allowedContentTags.has(element.tagName)) {
            element.replaceWith(document.createTextNode(element.textContent || ''));
            return;
        }
        [...element.attributes].forEach(attribute => {
            const name = attribute.name.toLowerCase();
            if (!allowedContentAttributes.has(name)) {
                element.removeAttribute(attribute.name);
                return;
            }
            if ((name === 'href' || name === 'src') && !isSafeContentUrl(attribute.value, name)) {
                element.removeAttribute(attribute.name);
            }
        });
        if (element.tagName === 'A' && element.getAttribute('target') === '_blank') {
            element.setAttribute('rel', 'noopener noreferrer');
        }
    });
    return template.innerHTML;
}

function withLanguageParam(href) {
    if (currentLang === 'zh' || !href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) {
        return href;
    }

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return href;
    url.searchParams.set('lang', currentLang);
    return `${url.pathname.split('/').pop()}${url.search}${url.hash}`;
}

function updateInternalLinks(root = document) {
    root.querySelectorAll('a[href]').forEach(link => {
        link.href = withLanguageParam(link.getAttribute('href'));
    });
}

function localizeArticle(article) {
    if (!article || currentLang === 'zh') return article;
    const translated = articleTranslations.en?.[article.id] || {};
    return { ...article, ...translated, hasTranslatedContent: Boolean(translated.content) };
}

function localizeProject(project) {
    if (!project || currentLang === 'zh') return project;
    const translated = projectTranslations.en?.[project.id] || {};
    return { ...project, ...translated };
}

function localizeItem(item, type) {
    return type === 'article' ? localizeArticle(item) : localizeProject(item);
}

function getItemHref(item) {
    const href = item.type === 'project'
        ? `project-detail.html?id=${encodeURIComponent(item.id)}`
        : `article-detail.html?id=${encodeURIComponent(item.id)}`;
    return withLanguageParam(href);
}

function getSocialLabel(link) {
    if (link.url.startsWith('mailto:')) return 'Email';
    if (link.url.includes('github.com')) return 'GitHub';
    if (link.url.includes('bilibili.com')) return 'Bilibili';
    return currentLang === 'en' ? 'Social link' : '社交链接';
}

function renderTags(tags = []) {
    return tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join('');
}

function renderContentByType(content = '', contentType = 'html') {
    const rendered = contentType === 'markdown' && window.marked
        ? window.marked.parse(content)
        : content;
    return sanitizeRenderedHtml(rendered);
}

function plainTextFromContent(content = '', contentType = 'html') {
    const value = String(content || '');
    if (contentType === 'markdown') {
        return value
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/[#>*_~|`-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
    return stripHTML(value);
}

function createContentCard(item, type) {
    const isArticle = type === 'article';
    const displayItem = localizeItem(item, type);
    const href = isArticle
        ? `article-detail.html?id=${encodeURIComponent(item.id)}`
        : `project-detail.html?id=${encodeURIComponent(item.id)}`;
    const description = isArticle ? displayItem.excerpt : displayItem.description;
    const meta = isArticle
        ? `<span><i class="far fa-calendar" aria-hidden="true"></i> ${displayItem.date}</span>
           <span><i class="far fa-clock" aria-hidden="true"></i> ${displayItem.readTime}</span>`
        : `<span><i class="far fa-calendar" aria-hidden="true"></i> ${displayItem.date || ''}</span>`;

    const card = document.createElement('a');
    card.className = 'article-card';
    card.href = withLanguageParam(href);
    card.innerHTML = `
        <div class="article-image-wrap">
            <img src="${escapeHTML(displayItem.image)}" alt="${escapeHTML(displayItem.title)}" class="article-image" width="640" height="360" loading="lazy">
            <span class="card-type">${isArticle ? t('article') : t('project')}</span>
        </div>
        <div class="article-content">
            <div class="article-meta">
                ${meta}
            </div>
            <h3 class="article-title">${escapeHTML(displayItem.title)}</h3>
            <p class="article-excerpt">${escapeHTML(description || '')}</p>
            <div class="article-tags" aria-label="${t('tags')}">
                ${renderTags(displayItem.tags)}
            </div>
            <span class="card-arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
        </div>
    `;
    return card;
}

function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    document.body.classList.add('site-ready');
    if (!loadingScreen) return;

    const hide = () => {
        loadingScreen.style.opacity = '0';
        const finish = () => {
            loadingScreen.style.display = 'none';
        };
        loadingScreen.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, prefersReducedMotion ? 0 : 260);
    };

    if (prefersReducedMotion) {
        hide();
        return;
    }

    requestAnimationFrame(() => setTimeout(hide, 80));
}

function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
}

function updateNavLinks() {
    const navLabels = [
        { match: href => href === '#home' || href === 'index.html', label: t('home') },
        { match: href => href === 'articles.html', label: t('articles') },
        { match: href => href === 'projects.html', label: t('projects') },
        { match: href => href === 'archive.html', label: t('archive') },
        { match: href => href === 'about.html' || href === '#about', label: t('about') },
        { match: href => href === 'search.html', label: t('search') }
    ];

    document.querySelectorAll('.nav-links a, .footer-section ul a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const navLabel = navLabels.find(item => item.match(href));
        if (!navLabel) return;

        if (link.closest('.footer-section')) {
            if (href === 'articles.html') link.textContent = t('allArticlesLink');
            else if (href === 'projects.html') link.textContent = t('projectsShowcase');
            else link.textContent = t('about');
            return;
        }

        link.textContent = navLabel.label;
    });
}

function updateDocumentTitle() {
    const titles = {
        'home-page': currentLang === 'en' ? 'F_wenky | AI Projects and Technical Writing' : 'F_wenky | AI 学习、项目与技术写作',
        'articles-page': `${t('allArticles')} | F_wenky`,
        'projects-page': `${t('allProjects')} | F_wenky`,
        'archive-page': `${t('archive')} | F_wenky`,
        'about-page': `${t('about')} | F_wenky`,
        'search-page': `${t('search')} | F_wenky`,
        'article-detail-page': `${t('article')} | F_wenky`,
        'project-detail-page': `${t('project')} | F_wenky`
    };
    document.title = titles[document.body.id] || document.title;
}

function applyStaticTranslations() {
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-CN';
    setText('.logo-link span', t('siteName'));
    setText('#latest-articles h2', t('latestArticles'));
    setText('#featured-projects h2', t('featuredProjects'));
    setText('#articles-list .page-title', t('allArticles'));
    setText('#projects-list .page-title', t('allProjects'));
    setText('#archive .page-title', t('archive'));
    setText('body#search-page main .page-title', t('search'));
    setText('.experience-section h2', t('experience'));
    setText('.interests-section h2', t('interests'));
    setText('.search-header h2', t('searchResults'));
    setText('.search-content h2', t('searchResults'));

    document.querySelectorAll('.footer-section h3').forEach((heading, index) => {
        heading.textContent = index === 0 ? t('contact') : t('quickLinks');
    });
    document.querySelectorAll('.view-all-btn').forEach(link => {
        const href = link.getAttribute('href');
        link.textContent = href === 'projects.html' ? t('viewAllProjects') : t('viewAllArticles');
    });
    document.querySelectorAll('.footer-bottom p').forEach(p => {
        p.textContent = t('copyright');
    });

    const searchPageInput = document.getElementById('searchPageInput');
    if (searchPageInput) {
        searchPageInput.placeholder = t('searchPlaceholder');
        searchPageInput.setAttribute('aria-label', t('searchLabel'));
    }
    const searchLabel = document.querySelector('label[for="searchPageInput"]');
    if (searchLabel) searchLabel.textContent = t('searchLabel');

    closeSearch?.setAttribute('aria-label', t('closeSearch'));
    document.querySelector('.prev-btn')?.setAttribute('aria-label', t('prevSlide'));
    document.querySelector('.next-btn')?.setAttribute('aria-label', t('nextSlide'));
    navToggle?.setAttribute('aria-label', t('openNav'));
    const polaroidCaption = document.querySelector('.polaroid-caption');
    if (polaroidCaption) polaroidCaption.textContent = t('featured');

    document.querySelectorAll('[data-copy]').forEach(element => {
        element.textContent = t(element.dataset.copy);
    });
    setText('.skip-link', t('skipToContent'));
    setText('#contentCount', t('contentCount', articles.length, projects.length));

    updateNavLinks();
    updateDocumentTitle();
}

function initLanguageToggle() {
    const nav = document.querySelector('.nav');
    if (!nav || document.querySelector('.language-toggle')) return;

    let actions = nav.querySelector('.nav-actions');
    if (!actions) {
        actions = document.createElement('div');
        actions.className = 'nav-actions';
        nav.insertBefore(actions, navToggle || null);
    }

    const nextLang = currentLang === 'zh' ? 'en' : 'zh';
    const url = new URL(window.location.href);
    if (nextLang === 'en') {
        url.searchParams.set('lang', nextLang);
    } else {
        url.searchParams.delete('lang');
    }

    const link = document.createElement('a');
    link.className = 'language-toggle';
    link.href = url.toString();
    link.setAttribute('role', 'button');
    link.setAttribute('aria-label', currentLang === 'zh' ? 'Switch to English' : '切换到中文');
    link.textContent = t('langToggle');
    link.addEventListener('click', () => setStoredLanguage(nextLang));

    actions.appendChild(link);
}

function initAccessibilityShell() {
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';

    if (main && !document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-link';
        skipLink.href = `#${main.id}`;
        skipLink.textContent = t('skipToContent');
        document.body.prepend(skipLink);
    }

    document.querySelector('.nav')?.setAttribute('aria-label', currentLang === 'en' ? 'Primary navigation' : '主导航');
}

function getStoredTheme() {
    try {
        return window.localStorage?.getItem('siteTheme');
    } catch (error) {
        return null;
    }
}

function setStoredTheme(theme) {
    try {
        window.localStorage?.setItem('siteTheme', theme);
    } catch (error) {
        // The selected theme still applies to the current page.
    }
}

function initThemeToggle() {
    const nav = document.querySelector('.nav');
    if (!nav || document.querySelector('.theme-toggle')) return;

    let actions = nav.querySelector('.nav-actions');
    if (!actions) {
        actions = document.createElement('div');
        actions.className = 'nav-actions';
        nav.insertBefore(actions, navToggle || null);
    }

    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    let theme = getStoredTheme() || document.documentElement.dataset.theme || (systemDark ? 'dark' : 'light');
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.type = 'button';

    const applyTheme = nextTheme => {
        theme = nextTheme;
        document.documentElement.dataset.theme = theme;
        const isDark = theme === 'dark';
        button.innerHTML = `<i class="fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>`;
        button.setAttribute('aria-label', isDark ? t('themeLight') : t('themeDark'));
        button.setAttribute('title', isDark ? t('themeLight') : t('themeDark'));
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#0b1020' : '#f4f7f5');
    };

    button.addEventListener('click', () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setStoredTheme(nextTheme);
        applyTheme(nextTheme);
    });

    actions.insertBefore(button, actions.firstChild);
    applyTheme(theme);
}

// 滑动模块功能
function initSlider() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const sliderCards = document.querySelector('.slider-cards');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    if (!sliderWrapper || !sliderCards || !prevBtn || !nextBtn || !dotsContainer) return;

    const featuredItems = [
        { type: 'project', id: 'project2' },
        { type: 'article', id: 'pytorch-cnn-cifar' },
        { type: 'article', id: 'hello-pytorch-mnist' },
        { type: 'article', id: 'numpy-neural-network' },
        { type: 'article', id: 'numpy-linear-regression' },
    ];

    const allItems = featuredItems.map(featuredItem => {
        if (featuredItem.type === 'article') {
            const article = articles.find(article => article.id === featuredItem.id);
            return article ? { ...article, type: 'article' } : null;
        }
        const project = projects.find(project => project.id === featuredItem.id);
        return project ? { ...project, type: 'project' } : null;
    }).filter(Boolean);

    let currentSlide = 0;
    const totalSlides = allItems.length;
    let autoSlideInterval = null;

    function startAutoSlide() {
        if (prefersReducedMotion || totalSlides < 2) return;
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    allItems.forEach(item => {
        const displayItem = localizeItem(item, item.type);
        const sliderItem = document.createElement('a');
        sliderItem.className = 'slider-item';
        sliderItem.href = getItemHref(item);
        sliderItem.innerHTML = `
            <img src="${displayItem.image}" alt="${displayItem.title}" width="900" height="506">
            <h3 class="slider-title">${displayItem.title}</h3>
            <p class="slider-description">${displayItem.description || displayItem.excerpt}</p>
        `;
        sliderCards.appendChild(sliderItem);
    });

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', t('slideDot', i));
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const polaroidCaption = document.querySelector('.polaroid-caption');

    function updateSlider() {
        if (totalSlides === 0) return;
        const offsetPercent = -currentSlide * 100;
        sliderCards.style.transform = `translateX(${offsetPercent}%)`;
        document.querySelectorAll('.dot').forEach((dot, index) => {
            const isActive = index === currentSlide;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
        if (polaroidCaption && allItems[currentSlide]) {
            const currentItem = allItems[currentSlide];
            const displayItem = localizeItem(currentItem, currentItem.type);
            const typeLabel = currentItem.type === 'article' ? t('article') : t('project');
            polaroidCaption.textContent = `${typeLabel} · ${displayItem.title}`;
        }
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    function nextSlide() {
        currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
        updateSlider();
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
    sliderWrapper.addEventListener('mouseleave', startAutoSlide);

    let startX = 0;
    let isTouching = false;
    sliderWrapper.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
            startX = e.touches[0].clientX;
            isTouching = true;
            stopAutoSlide();
        }
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', (e) => {
        if (!isTouching) return;
        const endX = e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].clientX : startX;
        const deltaX = endX - startX;
        if (Math.abs(deltaX) > 50) {
            deltaX < 0 ? nextSlide() : prevSlide();
        }
        isTouching = false;
        startAutoSlide();
    }, { passive: true });

    window.addEventListener('resize', updateSlider);
    updateSlider();
    startAutoSlide();
}

function initNavigation() {
    if (header) {
        const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    const mobileNavigation = window.matchMedia('(max-width: 780px)');
    const setNavOpen = (isOpen, { restoreFocus = false } = {}) => {
        if (!navLinks || !navToggle) return;
        navLinks.classList.toggle('active', isOpen);
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? t('closeNav') : t('openNav'));
        document.body.classList.toggle('nav-open', isOpen && mobileNavigation.matches);
        if (restoreFocus) navToggle.focus();
    };

    navToggle?.addEventListener('click', () => {
        setNavOpen(!navLinks?.classList.contains('active'));
    });

    navLinks?.querySelectorAll('a').forEach(link => {
        if (link.classList.contains('active')) link.setAttribute('aria-current', 'page');
        link.addEventListener('click', () => {
            setNavOpen(false);
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navLinks?.classList.contains('active')) {
            setNavOpen(false, { restoreFocus: true });
        }
    });

    document.addEventListener('pointerdown', event => {
        if (!mobileNavigation.matches || !navLinks?.classList.contains('active')) return;
        if (!header?.contains(event.target)) setNavOpen(false);
    });

    mobileNavigation.addEventListener?.('change', event => {
        if (!event.matches) setNavOpen(false);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });
}

// 卡片随机旋转 — 便签纸效果
function applyRandomRotation(cards) {
    cards.forEach(card => card.style.removeProperty('transform'));
}

// 标签贴纸随机旋转
function applyTagRotation(container) {
    container?.querySelectorAll('.tag').forEach(tag => tag.style.removeProperty('transform'));
}

// 加载文章列表
function loadArticles(container = '.articles-grid', articlesList = articles, limit = null) {
    const grid = document.querySelector(container);
    if (!grid) return;

    const sortedArticles = [...articlesList].sort((a, b) => {
        const dateA = new Date(a.date || '1970-01-01');
        const dateB = new Date(b.date || '1970-01-01');
        return dateB - dateA;
    });

    grid.innerHTML = '';
    const visibleArticles = Number.isInteger(limit) ? sortedArticles.slice(0, limit) : sortedArticles;
    visibleArticles.forEach(article => {
        grid.appendChild(createContentCard(article, 'article'));
    });
    applyRandomRotation(grid.querySelectorAll('.article-card'));
    applyTagRotation(grid);
}

function initArticleFilters() {
    const filters = document.getElementById('articleFilters');
    const count = document.getElementById('articlesCount');
    if (!filters) return;

    const tagCounts = new Map();
    articles.flatMap(article => article.tags || []).forEach(tag => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1));
    const tags = [...tagCounts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], currentLang))
        .slice(0, 12)
        .map(([tag]) => tag);
    const render = activeTag => {
        filters.replaceChildren();
        const options = [{ label: t('filterAll'), value: '' }, ...tags.map(tag => ({ label: tag, value: tag }))];
        options.forEach(option => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'tag-filter';
            button.textContent = option.label;
            button.setAttribute('aria-pressed', String(option.value === activeTag));
            button.addEventListener('click', () => render(option.value));
            filters.appendChild(button);
        });
        const filtered = activeTag ? articles.filter(article => article.tags?.includes(activeTag)) : articles;
        loadArticles('.articles-grid', filtered);
        if (count) count.textContent = t('articleCount', filtered.length);
    };
    const initialTag = new URLSearchParams(window.location.search).get('tag');
    render(tags.includes(initialTag) ? initialTag : '');
}

function initBlogRadar() {
    const latestLink = document.getElementById('radarLatest');
    if (!latestLink) return;
    const newest = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    if (!newest) return;
    const displayArticle = localizeArticle(newest);
    latestLink.href = getItemHref({ ...newest, type: 'article' });
    latestLink.querySelector('strong').textContent = displayArticle.title;
    latestLink.querySelector('small').textContent = `${displayArticle.date} · ${displayArticle.readTime}`;
    document.getElementById('radarDate').textContent = newest.date;
    document.getElementById('radarCount').textContent = t('contentCount', articles.length, projects.length);

    const topicContainer = document.getElementById('radarTopics');
    const tagCounts = new Map();
    articles.flatMap(article => article.tags || []).forEach(tag => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1));
    [...tagCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], currentLang)).slice(0, 4).forEach(([tag, count]) => {
        const topic = document.createElement('a');
        topic.className = 'radar-topic';
        topic.href = withLanguageParam(`articles.html?tag=${encodeURIComponent(tag)}`);
        topic.innerHTML = `<span>${escapeHTML(tag)}</span><small>${count}</small>`;
        topicContainer?.appendChild(topic);
    });
}

function initKnowledgeMap() {
    const map = document.querySelector('.knowledge-map');
    if (!map) return;

    const articleCount = document.getElementById('mapArticleCount');
    const projectCount = document.getElementById('mapProjectCount');
    if (articleCount) articleCount.textContent = String(articles.length);
    if (projectCount) projectCount.textContent = String(projects.length);

    if (prefersReducedMotion || window.matchMedia?.('(pointer: coarse)').matches) return;

    map.addEventListener('pointermove', event => {
        const rect = map.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        map.style.setProperty('--tilt-x', `${x * 3.6}deg`);
        map.style.setProperty('--tilt-y', `${y * -3.1}deg`);
        map.style.setProperty('--pointer-x', `${(x + 0.5) * 100}%`);
        map.style.setProperty('--pointer-y', `${(y + 0.5) * 100}%`);
    });
    map.addEventListener('pointerleave', () => {
        map.style.setProperty('--tilt-x', '0deg');
        map.style.setProperty('--tilt-y', '0deg');
        map.style.setProperty('--pointer-x', '50%');
        map.style.setProperty('--pointer-y', '50%');
    });
}

// 加载项目列表
function loadProjects(container = '.projects-grid', projectsList = projects, limit = null) {
    const grid = document.querySelector(container);
    if (!grid) return;

    const sortedProjects = [...projectsList].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || '1970-01-01');
        const dateB = new Date(b.date || b.createdAt || '1970-01-01');
        return dateB - dateA;
    });

    grid.innerHTML = '';
    const visibleProjects = Number.isInteger(limit) ? sortedProjects.slice(0, limit) : sortedProjects;
    visibleProjects.forEach(project => {
        grid.appendChild(createContentCard(project, 'project'));
    });
    applyRandomRotation(grid.querySelectorAll('.article-card'));
    applyTagRotation(grid);
}

// 加载文章详情
function loadArticleDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const article = articles.find(a => a.id === articleId);
    const detailContainer = document.querySelector('#article-detail');
    if (!detailContainer) return;

    if (!article) {
        detailContainer.innerHTML = `<p class="not-found">${t('articleNotFound')}</p>`;
        return;
    }

    const displayArticle = localizeArticle(article);
    document.title = `${displayArticle.title} - Fangwenky の blog`;
    const articleContent = displayArticle.content || article.content;
    const content = renderContentByType(articleContent, displayArticle.type === 'md' ? 'markdown' : 'html');
    const englishSummary = currentLang === 'en' && !displayArticle.hasTranslatedContent
        ? `<div class="translation-note">
                <h2>${t('englishSummary')}</h2>
                <p>${displayArticle.excerpt}</p>
                <p>${t('originalChineseNote')}</p>
            </div>`
        : '';

    detailContainer.innerHTML = `
        <div class="article-detail-wrapper">
            <h1 class="article-detail-title">${escapeHTML(displayArticle.title)}</h1>
            <div class="article-detail-tags" aria-label="${t('tags')}">
                ${renderTags(displayArticle.tags)}
            </div>
            <div class="article-detail-meta">
                <span><i class="far fa-calendar" aria-hidden="true"></i> ${displayArticle.date}</span>
                <span><i class="far fa-clock" aria-hidden="true"></i> ${displayArticle.readTime}</span>
            </div>
            <img src="${escapeHTML(displayArticle.image)}" alt="${escapeHTML(displayArticle.title)}" class="article-detail-image" width="860" height="484" loading="lazy">
            ${englishSummary}
            <div class="article-detail-content">
                ${content}
            </div>
        </div>
    `;

    enhanceArticleDetail(article, detailContainer);
    window.MathJax?.typesetPromise?.();
}

// 加载项目详情
function loadProjectDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const project = projects.find(p => p.id === projectId);
    const detailContainer = document.querySelector('#project-detail');
    if (!detailContainer) return;

    if (!project) {
        detailContainer.innerHTML = `<p class="not-found">${t('projectNotFound')}</p>`;
        return;
    }

    const displayProject = localizeProject(project);
    document.title = `${displayProject.title} - Fangwenky の blog`;
    const projectContent = displayProject.content || project.content;
    const content = renderContentByType(projectContent, displayProject.contentType || project.contentType);
    detailContainer.innerHTML = `
        <div class="article-detail-wrapper">
            <h1 class="article-detail-title">${escapeHTML(displayProject.title)}</h1>
            <div class="article-detail-tags" aria-label="${t('tags')}">
                ${renderTags(displayProject.tags)}
            </div>
            <div class="article-detail-meta">
                <span><i class="far fa-calendar" aria-hidden="true"></i> ${displayProject.date}</span>
            </div>
            <img src="${escapeHTML(displayProject.image)}" alt="${escapeHTML(displayProject.title)}" class="article-detail-image" width="860" height="484" loading="lazy">
            <div class="article-detail-content">
                ${content}
            </div>
            <p><a href="${isSafeContentUrl(project.link, 'href') ? escapeHTML(project.link) : '#'}" target="_blank" rel="noopener noreferrer" class="button">${t('viewProject')}</a></p>
        </div>
    `;
}

function enhanceArticleDetail(article, detailContainer) {
    const wrapper = detailContainer.querySelector('.article-detail-wrapper');
    const content = wrapper?.querySelector('.article-detail-content');
    if (!wrapper || !content) return;

    const headings = [...content.querySelectorAll('h2, h3')];
    if (headings.length > 0) {
        const outline = document.createElement('details');
        outline.className = 'article-outline';
        outline.open = window.matchMedia?.('(min-width: 820px)').matches;
        const summary = document.createElement('summary');
        summary.textContent = t('tableOfContents');
        const list = document.createElement('ol');
        headings.forEach((heading, index) => {
            heading.id = heading.id || `${article.id}-section-${index + 1}`;
            const item = document.createElement('li');
            item.className = heading.tagName === 'H3' ? 'outline-subitem' : '';
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            item.appendChild(link);
            list.appendChild(item);
        });
        outline.append(summary, list);
        wrapper.querySelector('.article-detail-meta')?.after(outline);
    }

    const shareButton = document.createElement('button');
    shareButton.type = 'button';
    shareButton.className = 'share-article button button-secondary';
    shareButton.innerHTML = `<i class="fa-solid fa-link" aria-hidden="true"></i><span>${t('shareArticle')}</span>`;
    shareButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            shareButton.querySelector('span').textContent = t('linkCopied');
            window.setTimeout(() => { shareButton.querySelector('span').textContent = t('shareArticle'); }, 1800);
        } catch {
            window.prompt(t('shareArticle'), window.location.href);
        }
    });
    wrapper.querySelector('.article-detail-meta')?.after(shareButton);

    const related = articles
        .filter(candidate => candidate.id !== article.id && candidate.tags?.some(tag => article.tags?.includes(tag)))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);
    if (related.length > 0) {
        const relatedSection = document.createElement('section');
        relatedSection.className = 'related-reading';
        const heading = document.createElement('h2');
        heading.textContent = t('relatedReading');
        const grid = document.createElement('div');
        grid.className = 'related-grid';
        related.forEach(item => grid.appendChild(createContentCard(item, 'article')));
        relatedSection.append(heading, grid);
        wrapper.appendChild(relatedSection);
    }

    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-label', t('readingProgress'));
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '100');
    const progressBar = document.createElement('span');
    progress.appendChild(progressBar);
    document.body.appendChild(progress);
    const updateProgress = () => {
        const start = content.getBoundingClientRect().top + window.scrollY;
        const range = Math.max(1, content.offsetHeight - window.innerHeight * 0.55);
        const value = Math.max(0, Math.min(100, ((window.scrollY - start + window.innerHeight * 0.35) / range) * 100));
        progressBar.style.transform = `scaleX(${value / 100})`;
        progress.setAttribute('aria-valuenow', String(Math.round(value)));
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

// 加载技能标签
function loadSkills(skillsList = skills) {
    const skillTags = document.querySelector('.skill-tags');
    if (!skillTags) return;

    skillTags.innerHTML = '';
    skillsList.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            <span>${skill.name}</span>
            <div class="skill-level-bar" aria-hidden="true">
                <div class="skill-level" style="width: ${skill.level}%;"></div>
            </div>
        `;
        skillTags.appendChild(skillTag);
    });
}

function renderSocialLinks() {
    const displayAbout = currentLang === 'en' ? { ...aboutMe, ...aboutTranslations.en } : aboutMe;
    return displayAbout.socialLinks.map(link => {
        const externalAttrs = link.url.startsWith('mailto:')
            ? ''
            : ' target="_blank" rel="noopener noreferrer"';
        return `
        <a href="${link.url}"${externalAttrs} class="social-link" aria-label="${getSocialLabel(link)}">
            <i class="${link.icon}" aria-hidden="true"></i>
        </a>
    `;
    }).join('');
}

// 加载关于我信息
function loadAboutMe() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const displayAbout = currentLang === 'en' ? { ...aboutMe, ...aboutTranslations.en } : aboutMe;
    const displaySkills = currentLang === 'en'
        ? skills.map((skill, index) => ({
            ...skill,
            name: aboutTranslations.en.skills?.[index] || skill.name
        }))
        : skills;
    const aboutTextDiv = aboutSection.querySelector('.about-header .about-text');
    const aboutImageDiv = aboutSection.querySelector('.about-header .about-image');
    const experienceTimeline = aboutSection.querySelector('.experience-section .timeline');
    const interestsGrid = aboutSection.querySelector('.interests-section .interests-grid');

    if (aboutTextDiv) {
        const headingTag = document.body.id === 'about-page' ? 'h1' : 'h2';
        const academicProfile = document.body.id === 'about-page' && aboutMe.academicProfile
            ? `<address class="academic-profile about-academic-profile" aria-label="Academic profile">
                    <div class="academic-profile-main">
                        <strong>${escapeHTML(aboutMe.academicProfile.name)}</strong>
                        <span>${escapeHTML(aboutMe.academicProfile.role)}</span>
                        <span>${escapeHTML(aboutMe.academicProfile.institution)}</span>
                    </div>
                    <a href="mailto:${escapeHTML(aboutMe.academicProfile.email)}"><span>Email:</span> ${escapeHTML(aboutMe.academicProfile.email)}</a>
                </address>`
            : '';
        aboutTextDiv.innerHTML = `
            <${headingTag}>${displayAbout.name}</${headingTag}>
            <p>${displayAbout.bio}</p>
            ${academicProfile}
            <div class="social-links">
                ${renderSocialLinks()}
            </div>
            <div class="skill-tags"></div>
        `;
    }

    if (aboutImageDiv) {
        aboutImageDiv.innerHTML = `
            <img src="${displayAbout.avatar}" alt="${displayAbout.name}" class="about-avatar" width="130" height="130" loading="lazy">
        `;
    }

    if (experienceTimeline && displayAbout.experience) {
        experienceTimeline.innerHTML = displayAbout.experience.map(exp => `
            <div class="timeline-item">
                <h3>${exp.title} @ ${exp.company}</h3>
                <span class="duration">${exp.duration}</span>
                <p>${exp.description}</p>
            </div>
        `).join('');
    }

    if (interestsGrid && displayAbout.interests) {
        interestsGrid.innerHTML = displayAbout.interests.map(interest => `
            <div class="interest-item">${interest}</div>
        `).join('');
    }

    loadSkills(displaySkills);
}

function stripHTML(html = '') {
    return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function performSearch(query) {
    const normalizedQuery = query.toLowerCase();
    const results = [];

    articles.forEach(article => {
        const displayArticle = localizeArticle(article);
        const contentText = plainTextFromContent(article.content || '', article.type === 'md' ? 'markdown' : 'html');
        const searchableText = [
            article.title,
            article.excerpt,
            ...(article.tags || []),
            displayArticle.title,
            displayArticle.excerpt,
            ...(displayArticle.tags || []),
            contentText
        ].join(' ').toLowerCase();

        if (searchableText.includes(normalizedQuery) ||
            contentText.toLowerCase().includes(normalizedQuery) ||
            article.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) {
            results.push({ ...article, type: 'article' });
        }
    });

    projects.forEach(project => {
        const displayProject = localizeProject(project);
        const contentText = plainTextFromContent(project.content || '', project.contentType);
        const localizedContentText = plainTextFromContent(displayProject.content || '', displayProject.contentType || project.contentType);
        const searchableText = [
            project.title,
            project.description,
            ...(project.tags || []),
            displayProject.title,
            displayProject.description,
            ...(displayProject.tags || []),
            contentText,
            localizedContentText
        ].join(' ').toLowerCase();

        if (searchableText.includes(normalizedQuery)) {
            results.push({ ...project, type: 'project' });
        }
    });

    return results;
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    searchResults.innerHTML = '';
    if (results.length === 0) {
        searchResults.innerHTML = `<p class="no-results">${t('noResults')}</p>`;
        return;
    }

    results.forEach(result => {
        const isArticle = result.type === 'article';
        searchResults.appendChild(createContentCard(result, isArticle ? 'article' : 'project'));
    });
    applyRandomRotation(searchResults.querySelectorAll('.article-card'));
    applyTagRotation(searchResults);
}

function initSearchControls() {
    searchButton?.addEventListener('click', () => {
        const query = searchInput?.value.trim();
        if (!query) return;

        const searchPageExists = !!document.querySelector('body#search-page');
        if (!searchPageExists) {
            window.location.href = withLanguageParam(`search.html?q=${encodeURIComponent(query)}`);
            return;
        }
        displaySearchResults(performSearch(query));
    });

    closeSearch?.addEventListener('click', () => {
        searchOverlay?.classList.remove('active');
        setTimeout(() => {
            if (searchOverlay) searchOverlay.style.display = 'none';
            const searchResults = document.getElementById('searchResults');
            if (searchResults) searchResults.innerHTML = '';
        }, prefersReducedMotion ? 0 : 300);
    });
}

function initSearchPage() {
    const input = document.getElementById('searchPageInput') || document.getElementById('searchInput');
    const resultsEl = document.getElementById('searchResults');
    if (!input || !resultsEl) return;

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    if (q) {
        input.value = q;
        displaySearchResults(performSearch(q));
    }

    let timer = null;
    input.addEventListener('input', () => {
        const value = input.value.trim();
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (!value) {
                resultsEl.innerHTML = '';
                return;
            }
            displaySearchResults(performSearch(value));
        }, 150);
    });
}

function initQuickSearch() {
    document.addEventListener('keydown', event => {
        if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
        event.preventDefault();
        const input = document.getElementById('searchPageInput');
        if (input) {
            input.focus();
            return;
        }
        window.location.href = withLanguageParam('search.html');
    });
}

function initSectionObserver() {
    const sections = document.querySelectorAll('section');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        sections.forEach(section => section.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
}

function loadFooterSocialLinks() {
    const footerSocialLinksDiv = document.querySelector('footer .social-links');
    if (footerSocialLinksDiv && aboutMe.socialLinks) {
        footerSocialLinksDiv.innerHTML = renderSocialLinks();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initAccessibilityShell();
    applyStaticTranslations();
    initLanguageToggle();
    initThemeToggle();
    hideLoadingScreen();
    initNavigation();
    initSearchControls();
    initQuickSearch();

    if (document.body.id === 'home-page') {
        initSlider();
        loadArticles('.articles-grid', articles, 3);
        loadProjects('.projects-grid', projects, 2);
        loadAboutMe();
        initBlogRadar();
        initKnowledgeMap();
    } else if (document.body.id === 'articles-page') {
        initArticleFilters();
    } else if (document.body.id === 'projects-page') {
        loadProjects('.projects-grid', projects);
    } else if (document.body.id === 'article-detail-page') {
        loadArticleDetail();
    } else if (document.body.id === 'project-detail-page') {
        loadProjectDetail();
    } else if (document.body.id === 'about-page') {
        loadAboutMe();
    } else if (document.body.id === 'search-page') {
        initSearchPage();
    } else if (document.body.id === 'archive-page') {
        createTimeline({
            prefersReducedMotion,
            localizeItem,
            getItemHref,
            labels: { tags: t('tags') }
        });
    }

    loadFooterSocialLinks();
    updateInternalLinks();
    initSectionObserver();
});
