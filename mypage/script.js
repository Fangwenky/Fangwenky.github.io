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
    return { ...article, ...translated, content: article.content };
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
    return tags.map(tag => `<span class="tag">${tag}</span>`).join('');
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
        <img src="${displayItem.image}" alt="${displayItem.title}" class="article-image" width="640" height="360" loading="lazy">
        <div class="article-content">
            <div class="article-meta">
                ${meta}
            </div>
            <h3 class="article-title">${displayItem.title}</h3>
            <p class="article-excerpt">${description}</p>
            <div class="article-tags" aria-label="${t('tags')}">
                ${renderTags(displayItem.tags)}
            </div>
        </div>
    `;
    return card;
}

function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;

    const hide = () => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, prefersReducedMotion ? 0 : 500);
    };

    if (prefersReducedMotion) {
        hide();
        return;
    }

    setTimeout(hide, 1000);
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
        'home-page': currentLang === 'en' ? "Fangwenky の blog - Homepage" : 'Fangwenky の blog - 个人主页',
        'articles-page': `${t('allArticles')} - Fangwenky の blog`,
        'projects-page': `${t('allProjects')} - Fangwenky の blog`,
        'archive-page': `${t('archive')} - Fangwenky の blog`,
        'about-page': `${t('about')} - Fangwenky の blog`,
        'search-page': `${t('search')} - Fangwenky の blog`,
        'article-detail-page': `${t('article')} - Fangwenky の blog`,
        'project-detail-page': `${t('project')} - Fangwenky の blog`
    };
    document.title = titles[document.body.id] || document.title;
}

function applyStaticTranslations() {
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-CN';
    setText('.logo-link span', t('siteName'));
    setText('#latest-articles h2', t('latestArticles'));
    setText('#featured-projects h2', t('featuredProjects'));
    setText('#articles-list h2', t('allArticles'));
    setText('#projects-list h2', t('allProjects'));
    setText('#archive h2', t('archive'));
    setText('body#search-page main h2', t('search'));
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

    updateNavLinks();
    updateDocumentTitle();
}

function initLanguageToggle() {
    const nav = document.querySelector('.nav');
    if (!nav || document.querySelector('.language-toggle')) return;

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

    nav.insertBefore(link, navToggle || null);
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
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                header.style.boxShadow = 'none';
            }
        });
    }

    navToggle?.addEventListener('click', () => {
        const isOpen = navLinks?.classList.toggle('active') || false;
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? t('closeNav') : t('openNav'));
    });

    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
            navToggle?.setAttribute('aria-label', t('openNav'));
        });
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
    if (prefersReducedMotion || window.innerWidth <= 768) return;
    cards.forEach(card => {
        const angle = (Math.random() - 0.5) * 2.5;
        card.style.transform = `rotate(${angle}deg)`;
    });
}

// 标签贴纸随机旋转
function applyTagRotation(container) {
    if (prefersReducedMotion || window.innerWidth <= 768 || !container) return;
    container.querySelectorAll('.tag').forEach(tag => {
        const angle = (Math.random() - 0.5) * 5;
        tag.style.transform = `rotate(${angle}deg)`;
    });
}

// 加载文章列表
function loadArticles(container = '.articles-grid', articlesList = articles) {
    const grid = document.querySelector(container);
    if (!grid) return;

    const sortedArticles = [...articlesList].sort((a, b) => {
        const dateA = new Date(a.date || '1970-01-01');
        const dateB = new Date(b.date || '1970-01-01');
        return dateB - dateA;
    });

    grid.innerHTML = '';
    sortedArticles.forEach(article => {
        grid.appendChild(createContentCard(article, 'article'));
    });
    applyRandomRotation(grid.querySelectorAll('.article-card'));
    applyTagRotation(grid);
}

// 加载项目列表
function loadProjects(container = '.projects-grid', projectsList = projects) {
    const grid = document.querySelector(container);
    if (!grid) return;

    const sortedProjects = [...projectsList].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || '1970-01-01');
        const dateB = new Date(b.date || b.createdAt || '1970-01-01');
        return dateB - dateA;
    });

    grid.innerHTML = '';
    sortedProjects.forEach(project => {
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
    const content = article.type === 'md' && window.marked
        ? window.marked.parse(article.content)
        : article.content;
    const englishSummary = currentLang === 'en'
        ? `<div class="translation-note">
                <h2>${t('englishSummary')}</h2>
                <p>${displayArticle.excerpt}</p>
                <p>${t('originalChineseNote')}</p>
            </div>`
        : '';

    detailContainer.innerHTML = `
        <div class="article-detail-wrapper">
            <h1 class="article-detail-title">${displayArticle.title}</h1>
            <div class="article-detail-tags" aria-label="${t('tags')}">
                ${renderTags(displayArticle.tags)}
            </div>
            <div class="article-detail-meta">
                <span><i class="far fa-calendar" aria-hidden="true"></i> ${displayArticle.date}</span>
                <span><i class="far fa-clock" aria-hidden="true"></i> ${displayArticle.readTime}</span>
            </div>
            <img src="${displayArticle.image}" alt="${displayArticle.title}" class="article-detail-image" width="860" height="484" loading="lazy">
            ${englishSummary}
            <div class="article-detail-content">
                ${content}
            </div>
        </div>
    `;

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
    detailContainer.innerHTML = `
        <div class="article-detail-wrapper">
            <h1 class="article-detail-title">${displayProject.title}</h1>
            <div class="article-detail-tags" aria-label="${t('tags')}">
                ${renderTags(displayProject.tags)}
            </div>
            <div class="article-detail-meta">
                <span><i class="far fa-calendar" aria-hidden="true"></i> ${displayProject.date}</span>
            </div>
            <img src="${displayProject.image}" alt="${displayProject.title}" class="article-detail-image" width="860" height="484" loading="lazy">
            <div class="article-detail-content">
                ${displayProject.content}
            </div>
            <p><a href="${project.link}" target="_blank" rel="noopener noreferrer" class="button">${t('viewProject')}</a></p>
        </div>
    `;
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
        aboutTextDiv.innerHTML = `
            <h2>${displayAbout.name}</h2>
            <p>${displayAbout.bio}</p>
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
        const contentText = stripHTML(article.content || '');
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
        const contentText = stripHTML(project.content || '');
        const localizedContentText = stripHTML(displayProject.content || '');
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
    applyStaticTranslations();
    initLanguageToggle();
    hideLoadingScreen();
    initNavigation();
    initSearchControls();

    if (document.body.id === 'home-page') {
        initSlider();
        loadArticles();
        loadProjects();
        loadAboutMe();
    } else if (document.body.id === 'articles-page') {
        loadArticles('.articles-grid', articles);
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
