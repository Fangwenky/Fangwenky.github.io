import { articles } from './data/articlesData.js';
import { projects } from './data/projectsData.js';
import { skills } from './data/skillsData.js';
import { aboutMe } from './data/aboutMeData.js';
import { createTimeline } from './data/archiveData.js';

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

function getItemHref(item) {
    return item.type === 'project'
        ? `project-detail.html?id=${encodeURIComponent(item.id)}`
        : `article-detail.html?id=${encodeURIComponent(item.id)}`;
}

function getSocialLabel(link) {
    if (link.url.startsWith('mailto:')) return 'Email';
    if (link.url.includes('github.com')) return 'GitHub';
    if (link.url.includes('bilibili.com')) return 'Bilibili';
    return '社交链接';
}

function renderTags(tags = []) {
    return tags.map(tag => `<span class="tag">${tag}</span>`).join('');
}

function createContentCard(item, type) {
    const isArticle = type === 'article';
    const href = isArticle
        ? `article-detail.html?id=${encodeURIComponent(item.id)}`
        : `project-detail.html?id=${encodeURIComponent(item.id)}`;
    const description = isArticle ? item.excerpt : item.description;
    const meta = isArticle
        ? `<span><i class="far fa-calendar" aria-hidden="true"></i> ${item.date}</span>
           <span><i class="far fa-clock" aria-hidden="true"></i> ${item.readTime}</span>`
        : `<span><i class="far fa-calendar" aria-hidden="true"></i> ${item.date || ''}</span>`;

    const card = document.createElement('a');
    card.className = 'article-card';
    card.href = href;
    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="article-image" width="640" height="360" loading="lazy">
        <div class="article-content">
            <div class="article-meta">
                ${meta}
            </div>
            <h3 class="article-title">${item.title}</h3>
            <p class="article-excerpt">${description}</p>
            <div class="article-tags" aria-label="标签">
                ${renderTags(item.tags)}
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
        const sliderItem = document.createElement('a');
        sliderItem.className = 'slider-item';
        sliderItem.href = getItemHref(item);
        sliderItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" width="900" height="506">
            <h3 class="slider-title">${item.title}</h3>
            <p class="slider-description">${item.description || item.excerpt}</p>
        `;
        sliderCards.appendChild(sliderItem);
    });

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `查看第 ${i + 1} 张精选内容`);
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
            const typeLabel = allItems[currentSlide].type === 'article' ? '文章' : '项目';
            polaroidCaption.textContent = `${typeLabel} · ${allItems[currentSlide].title}`;
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
        navToggle.setAttribute('aria-label', isOpen ? '关闭导航菜单' : '打开导航菜单');
    });

    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
            navToggle?.setAttribute('aria-label', '打开导航菜单');
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
        detailContainer.innerHTML = '<p class="not-found">文章未找到。</p>';
        return;
    }

    const content = article.type === 'md' && window.marked
        ? window.marked.parse(article.content)
        : article.content;

    detailContainer.innerHTML = `
        <div class="article-detail-wrapper">
            <h1 class="article-detail-title">${article.title}</h1>
            <div class="article-detail-tags" aria-label="标签">
                ${renderTags(article.tags)}
            </div>
            <div class="article-detail-meta">
                <span><i class="far fa-calendar" aria-hidden="true"></i> ${article.date}</span>
                <span><i class="far fa-clock" aria-hidden="true"></i> ${article.readTime}</span>
            </div>
            <img src="${article.image}" alt="${article.title}" class="article-detail-image" width="860" height="484" loading="lazy">
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
        detailContainer.innerHTML = '<p class="not-found">项目未找到。</p>';
        return;
    }

    detailContainer.innerHTML = `
        <div class="article-detail-wrapper">
            <h1 class="article-detail-title">${project.title}</h1>
            <div class="article-detail-tags" aria-label="标签">
                ${renderTags(project.tags)}
            </div>
            <div class="article-detail-meta">
                <span><i class="far fa-calendar" aria-hidden="true"></i> ${project.date}</span>
            </div>
            <img src="${project.image}" alt="${project.title}" class="article-detail-image" width="860" height="484" loading="lazy">
            <div class="article-detail-content">
                ${project.content}
            </div>
            <p><a href="${project.link}" target="_blank" rel="noopener noreferrer" class="button">查看项目</a></p>
        </div>
    `;
}

// 加载技能标签
function loadSkills() {
    const skillTags = document.querySelector('.skill-tags');
    if (!skillTags) return;

    skillTags.innerHTML = '';
    skills.forEach(skill => {
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
    return aboutMe.socialLinks.map(link => {
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

    const aboutTextDiv = aboutSection.querySelector('.about-header .about-text');
    const aboutImageDiv = aboutSection.querySelector('.about-header .about-image');
    const experienceTimeline = aboutSection.querySelector('.experience-section .timeline');
    const interestsGrid = aboutSection.querySelector('.interests-section .interests-grid');

    if (aboutTextDiv) {
        aboutTextDiv.innerHTML = `
            <h2>${aboutMe.name}</h2>
            <p>${aboutMe.bio}</p>
            <div class="social-links">
                ${renderSocialLinks()}
            </div>
            <div class="skill-tags"></div>
        `;
    }

    if (aboutImageDiv) {
        aboutImageDiv.innerHTML = `
            <img src="${aboutMe.avatar}" alt="${aboutMe.name}" class="about-avatar" width="130" height="130" loading="lazy">
        `;
    }

    if (experienceTimeline && aboutMe.experience) {
        experienceTimeline.innerHTML = aboutMe.experience.map(exp => `
            <div class="timeline-item">
                <h3>${exp.title} @ ${exp.company}</h3>
                <span class="duration">${exp.duration}</span>
                <p>${exp.description}</p>
            </div>
        `).join('');
    }

    if (interestsGrid && aboutMe.interests) {
        interestsGrid.innerHTML = aboutMe.interests.map(interest => `
            <div class="interest-item">${interest}</div>
        `).join('');
    }

    loadSkills();
}

function stripHTML(html = '') {
    return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function performSearch(query) {
    const normalizedQuery = query.toLowerCase();
    const results = [];

    articles.forEach(article => {
        const contentText = stripHTML(article.content || '');
        if (article.title.toLowerCase().includes(normalizedQuery) ||
            article.excerpt.toLowerCase().includes(normalizedQuery) ||
            contentText.toLowerCase().includes(normalizedQuery) ||
            article.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) {
            results.push({ type: 'article', ...article });
        }
    });

    projects.forEach(project => {
        const contentText = stripHTML(project.content || '');
        if (project.title.toLowerCase().includes(normalizedQuery) ||
            (project.description || '').toLowerCase().includes(normalizedQuery) ||
            contentText.toLowerCase().includes(normalizedQuery) ||
            project.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) {
            results.push({ type: 'project', ...project });
        }
    });

    return results;
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    searchResults.innerHTML = '';
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">未找到相关内容</p>';
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
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
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
        createTimeline(prefersReducedMotion);
    }

    loadFooterSocialLinks();
    initSectionObserver();
});
