import { articles } from './data/articlesData.js';
import { projects } from './data/projectsData.js';
import { skills } from './data/skillsData.js';
import { aboutMe } from './data/aboutMeData.js';
import { createTimeline } from './data/archiveData.js';

// 页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);

    // 根据当前页面加载内容
    if (document.body.id === 'home-page') {
        initSlider();
        loadArticles();
        loadProjects();
        loadSkills();
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
        createTimeline();
    }
});

// 滑动模块功能
function initSlider() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const sliderCards = document.querySelector('.slider-cards');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    // 合并文章和项目数据，并按日期降序排序
    // 定义特色文章和项目的ID
    const featuredItems = [
        { type: 'project', id: 'project2' },
        { type: 'article', id: 'pytorch-cnn-cifar' },
        { type: 'article', id: 'hello-pytorch-mnist'},
        { type: 'article', id: 'numpy-neural-network' },
        { type: 'article', id: 'numpy-linear-regression' },
    ];
    
    // 根据 featuredItems 筛选和排序文章和项目数据
    const allItems = featuredItems.map(featuredItem => {
        if (featuredItem.type === 'article') {
            const article = articles.find(article => article.id === featuredItem.id);
            return article ? { ...article, type: 'article' } : null;
        } else if (featuredItem.type === 'project') {
            const project = projects.find(project => project.id === featuredItem.id);
            return project ? { ...project, type: 'project' } : null;
        }
        return null;
    }).filter(item => item !== null);
    let currentSlide = 0;
    const totalSlides = allItems.length;

    // 创建滑动项
    allItems.forEach((item, index) => {
        const sliderItem = document.createElement('div');
        sliderItem.className = 'slider-item';
        sliderItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h3 class="slider-title">${item.title}</h3>
            <p class="slider-description">${item.description || item.excerpt}</p>
        `;
        sliderCards.appendChild(sliderItem);

        // 添加点击事件
        sliderItem.addEventListener('click', () => {
            console.log('Clicked item type:', item.type, 'id:', item.id);
            if (item.type === 'article') {
                window.location.href = `article-detail.html?id=${item.id}`;
            } else if (item.type === 'project') {
                window.location.href = `project-detail.html?id=${item.id}`;
            }
        });
    });

    // 创建导航点
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    // 更新滑动位置和导航点状态
    function updateSlider() {
        const sliderItems = document.querySelectorAll('.slider-item');
        if (sliderItems.length === 0) return;
        const offsetPercent = -currentSlide * 100;
        sliderCards.style.transform = `translateX(${offsetPercent}%)`;
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
        } else {
            currentSlide = 0; // 循环到第一个
        }
        updateSlider();
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1; // 循环到最后一个
        }
        updateSlider();
    }

    // 绑定按钮事件
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // 自动滑动
    let autoSlideInterval = setInterval(() => {
        if (currentSlide >= totalSlides - 1) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        updateSlider();
    }, 5000);

    // 鼠标悬停时暂停自动滑动
    sliderWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    sliderWrapper.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            if (currentSlide >= totalSlides - 1) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateSlider();
        }, 5000);
    });

    let startX = 0;
    let isTouching = false;
    sliderWrapper.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
            startX = e.touches[0].clientX;
            isTouching = true;
            clearInterval(autoSlideInterval);
        }
    }, { passive: true });
    sliderWrapper.addEventListener('touchend', (e) => {
        if (!isTouching) return;
        const endX = e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].clientX : startX;
        const deltaX = endX - startX;
        if (Math.abs(deltaX) > 50) {
            if (deltaX < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        isTouching = false;
        autoSlideInterval = setInterval(() => {
            if (currentSlide >= totalSlides - 1) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateSlider();
        }, 5000);
    }, { passive: true });

    // 窗口大小改变时更新滑动
    window.addEventListener('resize', () => {
        updateSlider();
    });

    updateSlider(); // 初始化滑动位置
}

// 导航栏效果
const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        header.style.boxShadow = 'none';
    }
});

navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// 点击导航链接时关闭菜单
navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 技能标签


// 加载文章列表
function loadArticles(container = '.articles-grid', articlesList = articles) {
    const grid = document.querySelector(container);
    if (!grid) return;

    // 按照日期降序排序文章列表
    const sortedArticles = [...articlesList].sort((a, b) => {
        const dateA = new Date(a.date || '1970-01-01');
        const dateB = new Date(b.date || '1970-01-01');
        return dateB - dateA;
    });

    grid.innerHTML = '';
    sortedArticles.forEach(article => {
        const articleCard = document.createElement('article');
        articleCard.className = 'article-card';
        articleCard.innerHTML = `
            <img src="${article.image}" alt="${article.title}" class="article-image">
            <div class="article-content">
                <div class="article-meta">
                    <span><i class="far fa-calendar"></i> ${article.date}</span>
                    <span><i class="far fa-clock"></i> ${article.readTime}</span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        articleCard.addEventListener('click', () => {
            window.location.href = `article-detail.html?id=${article.id}`;
        });
        grid.appendChild(articleCard);
    });
}

// 加载项目列表
function loadProjects(container = '.projects-grid', projectsList = projects) {
    console.log('loadProjects function called.');
    console.log('Container selector:', container);
    console.log('Projects list:', projectsList);
    const grid = document.querySelector(container);
    console.log('Grid element:', grid);
    if (!grid) {
        console.error('Projects grid element not found:', container);
        return;
    }

    // 按照日期降序排序项目列表
    const sortedProjects = [...projectsList].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || '1970-01-01');
        const dateB = new Date(b.date || b.createdAt || '1970-01-01');
        return dateB - dateA;
    });

    grid.innerHTML = '';
    sortedProjects.forEach(project => {
        const projectCard = document.createElement('article');
        projectCard.className = 'article-card';
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="article-image">
            <div class="article-content">
                <div class="article-meta">
                    <span><i class="far fa-calendar"></i> ${project.date || ''}</span>
                </div>
                <h3 class="article-title">${project.title}</h3>
                <p class="article-excerpt">${project.description}</p>
                <div class="article-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        projectCard.addEventListener('click', () => {
            window.location.href = `project-detail.html?id=${project.id}`;
        });
        grid.appendChild(projectCard);
    });
}

// 加载文章详情
function loadArticleDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const article = articles.find(a => a.id === articleId);
    if (article.type === 'md') {
        article.content = window.marked.parse(article.content);
    }

    if (!article) {
        document.querySelector('#article-detail').innerHTML = '<p>文章未找到。</p>';
        return;
    }

    const detailContainer = document.querySelector('#article-detail');
    detailContainer.innerHTML = `
        <div class="article-detail-wrapper">
            <h1 class="article-detail-title">${article.title}</h1>
            <div class="article-detail-tags">
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="article-detail-meta">
                <span><i class="far fa-calendar"></i> ${article.date}</span>
                <span><i class="far fa-clock"></i> ${article.readTime}</span>
            </div>
            <img src="${article.image}" alt="${article.title}" class="article-detail-image">
            <div class="article-detail-content">
                ${article.content}
            </div>
        </div>
    `;
}

// 加载项目详情
function loadProjectDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const project = projects.find(p => p.id === projectId);

    if (!project) {
        document.querySelector('#project-detail').innerHTML = '<p>项目未找到。</p>';
        return;
    }

    const detailContainer = document.querySelector('#project-detail');
    detailContainer.innerHTML = `
        <div class="article-detail-wrapper">
            <h1 class="article-detail-title">${project.title}</h1>
            <div class="article-detail-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="article-detail-meta">
                <span><i class="far fa-calendar"></i> ${project.date}</span>
            </div>
            <img src="${project.image}" alt="${project.title}" class="article-detail-image">
            <div class="article-detail-content">
                ${project.content}
            </div>
            <p><a href="${project.link}" target="_blank" class="button">查看项目</a></p>
        </div>
    `;
}

// 加载技能标签
function loadSkills() {
    const skillTags = document.querySelector('.skill-tags');
    if (!skillTags) return;

    skillTags.innerHTML = ''; // Clear existing skill tags
    skills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            <span>${skill.name}</span>
            <div class="skill-level-bar">
                <div class="skill-level" style="width: ${skill.level}%;"></div>
            </div>
        `;
        skillTags.appendChild(skillTag);
    });
}

// 加载关于我信息
function loadAboutMe() {
    console.log('loadAboutMe function called.');
    const aboutSection = document.getElementById('about');
    console.log('aboutSection:', aboutSection);
    if (!aboutSection) return;

    const aboutTextDiv = aboutSection.querySelector('.about-header .about-text');
    console.log('aboutTextDiv:', aboutTextDiv);
    const aboutImageDiv = aboutSection.querySelector('.about-header .about-image');
    console.log('aboutImageDiv:', aboutImageDiv);
    const experienceTimeline = aboutSection.querySelector('.experience-section .timeline');
    console.log('experienceTimeline:', experienceTimeline);
    const interestsGrid = aboutSection.querySelector('.interests-section .interests-grid');
    console.log('interestsGrid:', interestsGrid);
    console.log('aboutMe data:', aboutMe);

    if (aboutTextDiv) {
        aboutTextDiv.innerHTML = `
            <h2>${aboutMe.name}</h2>
            <p>${aboutMe.bio}</p>
            <div class="social-links">
                ${aboutMe.socialLinks.map(link => `<a href="${link.url}" target="_blank"><i class="${link.icon}"></i></a>`).join('')}
            </div>
            <div class="skill-tags"></div> <!-- Add this line -->
        `;
    }

    if (aboutImageDiv) {
        aboutImageDiv.innerHTML = `
            <img src="${aboutMe.avatar}" alt="${aboutMe.name}" class="about-avatar">
        `;
    }

    // 加载工作经历
    if (experienceTimeline && aboutMe.experience) {
        experienceTimeline.innerHTML = aboutMe.experience.map(exp => `
            <div class="timeline-item">
                <h3>${exp.title} @ ${exp.company}</h3>
                <span class="duration">${exp.duration}</span>
                <p>${exp.description}</p>
            </div>
        `).join('');
    }

    // 加载兴趣爱好
    if (interestsGrid && aboutMe.interests) {
        interestsGrid.innerHTML = aboutMe.interests.map(interest => `
            <div class="interest-item">${interest}</div>
        `).join('');
    }

    // 重新加载技能标签
    loadSkills();
}

// 搜索功能
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearch = document.getElementById('closeSearch');
const searchResults = document.getElementById('searchResults');

function stripHTML(html = '') {
    return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function performSearch(query) {
    query = query.toLowerCase();
    const results = [];

    // 搜索文章
    articles.forEach(article => {
        const contentText = stripHTML(article.content || '');
        if (article.title.toLowerCase().includes(query) ||
            article.excerpt.toLowerCase().includes(query) ||
            contentText.toLowerCase().includes(query) ||
            article.tags.some(tag => tag.toLowerCase().includes(query))) {
            results.push({
                type: 'article',
                ...article
            });
        }
    });

    // 搜索项目
    projects.forEach(project => {
        const contentText = stripHTML(project.content || '');
        if (project.title.toLowerCase().includes(query) ||
            (project.description || '').toLowerCase().includes(query) ||
            contentText.toLowerCase().includes(query) ||
            project.tags.some(tag => tag.toLowerCase().includes(query))) {
            results.push({
                type: 'project',
                ...project
            });
        }
    });

    return results;
}

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">未找到相关内容</p>';
        return;
    }

    results.forEach(result => {
        const resultItem = document.createElement('article');
        resultItem.className = 'article-card';
        const isArticle = result.type === 'article';
        const desc = isArticle ? result.excerpt : (result.description || '');
        const img = result.image || '';

        resultItem.innerHTML = `
            <img src="${img}" alt="${result.title}" class="article-image">
            <div class="article-content">
                <div class="article-meta">
                    <span><i class="far fa-calendar"></i> ${result.date}</span>
                    ${isArticle ? `<span><i class="far fa-clock"></i> ${result.readTime}</span>` : ''}
                </div>
                <h3 class="article-title">${result.title}</h3>
                <p class="article-excerpt">${desc}</p>
                <div class="article-tags">
                    ${result.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        resultItem.addEventListener('click', () => {
            if (result.type === 'article') {
                window.location.href = `article-detail.html?id=${result.id}`;
            } else {
                window.location.href = `project-detail.html?id=${result.id}`;
            }
        });
        searchResults.appendChild(resultItem);
    });
}

searchButton?.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        // 如果存在独立搜索页，则跳转携带参数
        const searchPageExists = !!document.querySelector('body#search-page');
        if (!searchPageExists) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            return;
        }
        const results = performSearch(query);
        displaySearchResults(results);
    }
});

closeSearch?.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    setTimeout(() => {
        searchOverlay.style.display = 'none';
        searchResults.innerHTML = '';
    }, 300);
});

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
            const results = performSearch(value);
            displaySearchResults(results);
        }, 150);
    });
}

// 页面滚动动画
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// 初始化页面
// document.addEventListener('DOMContentLoaded', () => {
//     loadArticles();
//     loadProjects();
//     loadSkills();
//     loadAboutMe();
// });

// 页面加载时根据URL参数加载文章或项目详情
// document.addEventListener('DOMContentLoaded', () => {
//     if (document.body.id === 'articles-page') {
//         loadArticles();
//     } else if (document.body.id === 'projects-page') {
//         loadProjects();
//     } else if (document.body.id === 'article-detail-page') {
//         loadArticleDetail();
//     } else if (document.body.id === 'project-detail-page') {
//         loadProjectDetail();
//     }
// });

function loadFooterSocialLinks() {
    const footerSocialLinksDiv = document.querySelector('footer .social-links');
    console.log('loadFooterSocialLinks: footerSocialLinksDiv =', footerSocialLinksDiv);
    console.log('loadFooterSocialLinks: aboutMe.socialLinks =', aboutMe.socialLinks);
    if (footerSocialLinksDiv && aboutMe.socialLinks) {
        footerSocialLinksDiv.innerHTML = aboutMe.socialLinks.map(link => `
            <a href="${link.url}" target="_blank"><i class="${link.icon}"></i></a>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.id === 'home-page') {
        initSlider();
        loadArticles();
        loadProjects();
        loadSkills();
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
    }
    loadFooterSocialLinks(); // Call the new function here
});
