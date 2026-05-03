// ===== 同学数据 =====
const classmates = [
  {name:"孙柏",city:"北京大学",province:"北京",words:"理科实验班（黑龙江省理科状元731分）",img:"images/孙柏.png"},
  {name:"孙海铭",city:"北京大学",province:"北京",words:"电子信息类",img:"images/孙海铭.png"},
  {name:"者久鹏",city:"北京大学",province:"北京",words:"电子信息类",img:"images/者久鹏.png"},
  {name:"刘津铭",city:"北京大学",province:"北京",words:"理科实验班",img:"images/刘津铭.png"},
  {name:"韩骁威",city:"北京大学",province:"北京",words:"地球与空间物理（强基计划）",img:"images/韩骁威.png"},
  {name:"齐妙",city:"北京大学",province:"北京",words:"力学类（强基计划）",img:"images/齐妙.png"},
  {name:"侯羿辰",city:"清华大学",province:"北京",words:"理论与应用力学（强基计划）",img:"images/侯羿辰.png"},
  {name:"马咏翔",city:"中国人民大学",province:"北京",words:"人工智能（拔尖班）",img:"images/马咏翔.png"},
  {name:"吕宗翰",city:"中国人民大学",province:"北京",words:"人工智能（拔尖班）",img:"images/吕宗翰.png"},
  {name:"张荣添",city:"中国人民大学",province:"北京",words:"外国语言文学（本科提前批）",img:"images/张荣添.png"},
  {name:"朱美茹",city:"北京航空航天大学",province:"北京",words:"工科试验班类（信息类）",img:"images/朱美茹.png"},
  {name:"杨凯文",city:"北京航空航天大学",province:"北京",words:"工科试验班类（信息类）",img:"images/杨凯文.png"},
  {name:"战膺凯",city:"北京航空航天大学",province:"北京",words:"工科试验班类（航空航天类）",img:"images/战膺凯.png"},
  {name:"邹泓宇",city:"北京航空航天大学",province:"北京",words:"飞行器动力工程（卓越人才培养计划）（本博）",img:"images/邹泓宇.png"},
  {name:"王子铭",city:"北京航空航天大学",province:"北京",words:"飞行专业（本科提前批）",img:"images/王子铭.png"},
  {name:"张楷欣",city:"北京理工大学",province:"北京",words:"徐特立英才班（本博）",img:"images/张楷欣.png"},
  {name:"房金衡",city:"北京理工大学",province:"北京",words:"徐特立英才班（本博）",img:"images/房金衡.png"},
  {name:"郭馨阳",city:"北京理工大学",province:"北京",words:"徐特立英才班（本博）",img:"images/郭馨阳.png"},
  {name:"郑宇航",city:"北京邮电大学",province:"北京",words:"自动化专业",img:"images/郑宇航.png"},
  {name:"孙健博",city:"华北水利水电大学",province:"河南",words:"能源与动力工程",img:"images/孙健博.png"},
  {name:"崔子航",city:"中国人民大学（苏州校区）",province:"江苏",words:"金融学",img:"images/崔子航.png"},
  {name:"胡绍川",city:"南京大学",province:"江苏",words:"理科实验班",img:"images/胡绍川.png"},
  {name:"赵星睿",city:"南京大学",province:"江苏",words:"金融工程（计算机金融实验班）",img:"images/赵星睿.png"},
  {name:"胡广伦",city:"中国科学技术大学",province:"安徽",words:"少年班",img:"images/胡广伦.png"},
  {name:"卞昌坤",city:"中国科学技术大学",province:"安徽",words:"工科试验班（拔尖计划英才班）",img:"images/卞昌坤.png"},
  {name:"王浩含",city:"中国科学技术大学",province:"安徽",words:"工科试验班（拔尖计划英才班）",img:"images/王浩含.png"},
  {name:"韩子木",city:"中国科学技术大学",province:"安徽",words:"电子信息类",img:"images/韩子木.png"},
  {name:"杨丁伊",city:"中国科学技术大学",province:"安徽",words:"电子信息类",img:"images/杨丁伊.png"},
  {name:"魏思睿",city:"复旦大学",province:"上海",words:"临床医学（8年制，卓越医生计划）",img:"images/魏思睿.png"},
  {name:"李润熙",city:"同济大学",province:"上海",words:"临床医学5+3",img:"images/李润熙.png"},
  {name:"翟介璞",city:"哈尔滨工业大学",province:"黑龙江",words:"工科试验班（院士特色班、未来技术拔尖班）（本硕博）",img:"images/翟介璞.png"},
  {name:"郭睿明",city:"哈尔滨工业大学",province:"黑龙江",words:"工科试验班（院士特色班、未来技术拔尖班）（本硕博）",img:"images/郭睿明.png"},
  {name:"于潇",city:"哈尔滨工业大学",province:"黑龙江",words:"工科试验班（院士特色班、未来技术拔尖班）（本硕博）",img:"images/于潇.png"},
  {name:"王心柏",city:"哈尔滨工业大学",province:"黑龙江",words:"工科试验班（院士特色班、未来技术拔尖班）（本硕博）",img:"images/王心柏.png"},
  {name:"张婧怡",city:"哈尔滨工业大学",province:"黑龙江",words:"工科试验班（计算机与电子信息）",img:"images/张婧怡.png"},
  {name:"丁禹皓",city:"哈尔滨工业大学",province:"黑龙江",words:"工科试验班（航天与自动化）",img:"images/丁禹皓.png"},
  {name:"杨琳",city:"哈尔滨工业大学",province:"黑龙江",words:"工科试验班（航天与自动化）",img:"images/杨琳.png"},
  {name:"张钊",city:"哈尔滨工业大学（威海）",province:"黑龙江",words:"测控技术与仪器",img:"images/张钊.png"},
  {name:"丁禹心",city:"哈尔滨医科大学",province:"黑龙江",words:"临床医学（5+3一体化，于维汉班）",img:"images/丁禹心.png"},
  {name:"刘士垚",city:"国防科技大学",province:"黑龙江",words:"航空航天类",img:"images/刘士垚.png"},
  {name:"常贤哲",city:"国防科技大学",province:"黑龙江",words:"通信工程",img:"images/常贤哲.png"},
  {name:"纪顺",city:"德强高中",province:"黑龙江",words:"英俊の语文老师",img:"images/纪顺.png"},
  {name:"王爽",city:"德强高中",province:"黑龙江",words:"可爱の数学老师",img:"images/王爽.png"},
  {name:"孟静",city:"德强高中",province:"黑龙江",words:"漂酿の英语老师",img:"images/孟静.png"},
  {name:"宦爱彬",city:"德强高中",province:"黑龙江",words:"美腻の物理老师",img:"images/宦爱彬.png"},
  {name:"孙静",city:"德强高中",province:"黑龙江",words:"亲切の化学老师",img:"images/孙静.png"},
  {name:"刘含英",city:"德强高中",province:"黑龙江",words:"和蔼の生物老师",img:"images/刘含英.png"},
  {name:"陈炳奇",city:"厦门大学",province:"福建",words:"计算机科学与技术",img:"images/陈炳奇.png"},
  {name:"贺红源",city:"南开大学",province:"天津",words:"金融类",img:"images/贺红源.png"},
  {name:"马铭浩",city:"大连理工大学",province:"辽宁",words:"人工智能（未来技术班）（本硕）",img:"images/马铭浩.png"},
  {name:"蔡杰聪",city:"浙江工业大学",province:"浙江",words:"智能制造",img:"images/蔡杰聪.png"},
  {name:"张晨曦",city:"东北大学",province:"辽宁",words:"生物医学工程",img:"images/张晨曦.png"},
  {name:"鞠宏铎",city:"香港中文大学（深圳）",province:"广东",words:"理科实验班（本科深圳3年，硕士哥大2年）",img:"images/鞠宏铎.png"},
];

// 省份图标
const provinceIcons = {
  "北京": "🏛️", "黑龙江": "❄️", "安徽": "🏔️", "江苏": "🌸",
  "上海": "🌃", "辽宁": "🏭", "广东": "🌴", "福建": "🍵",
  "天津": "⚓", "浙江": "🌊", "河南": "🌾"
};

// ===== 数据分组：按省份 -> 按学校 =====
function groupData() {
  const byProvince = {};
  classmates.forEach(c => {
    if (!byProvince[c.province]) byProvince[c.province] = {};
    if (!byProvince[c.province][c.city]) byProvince[c.province][c.city] = [];
    byProvince[c.province][c.city].push(c);
  });
  return byProvince;
}

// 省份排序（按人数降序）
function getProvinceOrder(byProvince) {
  return Object.keys(byProvince).sort((a, b) => {
    const countA = Object.values(byProvince[a]).flat().length;
    const countB = Object.values(byProvince[b]).flat().length;
    return countB - countA;
  });
}

// ===== 渲染省份导航 =====
function renderProvinceNav(byProvince, provinceOrder) {
  const nav = document.querySelector('.province-nav-inner');
  if (!nav) return;
  provinceOrder.forEach(prov => {
    const count = Object.values(byProvince[prov]).flat().length;
    const btn = document.createElement('button');
    btn.className = 'province-nav-btn';
    btn.dataset.province = prov;
    btn.innerHTML = `${prov}<span style="margin-left:4px;opacity:.7;font-size:12px;">${count}</span>`;
    nav.appendChild(btn);
  });
}

// ===== 渲染去向内容（一次性渲染所有，不再筛选） =====
function renderDestinations(byProvince, provinceOrder) {
  const container = document.getElementById('destinationsContent');
  if (!container) return;

  container.innerHTML = provinceOrder.map((prov, pi) => {
    const schools = byProvince[prov];
    const schoolNames = Object.keys(schools).sort((a, b) => schools[b].length - schools[a].length);
    const total = schoolNames.reduce((sum, s) => sum + schools[s].length, 0);
    const icon = provinceIcons[prov] || '📍';

    return `
      <div class="province-section" id="province-${prov}" data-province="${prov}">
        <div class="province-header reveal">
          <span class="province-icon">${icon}</span>
          <h3 class="province-name">${prov}</h3>
          <span class="province-count">${total} 人</span>
        </div>
        ${schoolNames.map((school, si) => {
          const list = schools[school];
          return `
            <div class="school-group">
              <div class="school-label reveal">${school}<span>· ${list.length}人</span></div>
              <div class="cards-grid">
                ${list.map((c, ci) => `
                  <div class="classmate-card" style="transition-delay:${Math.min(ci * 0.05, 0.35)}s">
                    <div class="card-photo">
                      <img src="${c.img}" alt="${c.name}" loading="lazy">
                    </div>
                    <div class="card-body">
                      <div class="card-name">${c.name}</div>
                      <div class="card-school">${c.city}</div>
                      <div class="card-major">${c.words}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');

  bindImageLoaders();
  observeReveals();
}

// ===== 图片加载动画 =====
function bindImageLoaders() {
  document.querySelectorAll('.card-photo img').forEach(img => {
    const wrap = img.closest('.card-photo');
    wrap.classList.add('loading');
    if (img.complete) {
      img.classList.add('loaded');
      wrap.classList.remove('loading');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        wrap.classList.remove('loading');
      });
      img.addEventListener('error', () => {
        wrap.classList.remove('loading');
      });
    }
  });
}

// ===== 省份导航交互（只做锚点滚动，不筛选） =====
function initProvinceNav() {
  const nav = document.querySelector('.province-nav-inner');
  if (!nav) return;

  const allBtns = nav.querySelectorAll('.province-nav-btn');

  nav.addEventListener('click', e => {
    const btn = e.target.closest('.province-nav-btn');
    if (!btn) return;

    allBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const province = btn.dataset.province;
    if (province === 'all') {
      document.getElementById('destinations').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const el = document.getElementById(`province-${province}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ===== 滚动时高亮当前省份 =====
function highlightProvinceOnScroll() {
  const sections = document.querySelectorAll('.province-section');
  const allBtns = document.querySelectorAll('.province-nav-btn');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    let activeProv = null;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeProv = entry.target.dataset.province;
      }
    });

    allBtns.forEach(btn => {
      const prov = btn.dataset.province;
      if (activeProv) {
        btn.classList.toggle('active', prov === activeProv);
      } else {
        btn.classList.toggle('active', prov === 'all');
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

// ===== 阅读进度条 =====
function initProgressBar() {
  const bar = document.getElementById('readProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ===== Reveal 动画 =====
function observeReveals() {
  const reveals = document.querySelectorAll('.reveal, .classmate-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ===== 数字滚动动画 =====
function animateNumbers() {
  const nums = document.querySelectorAll('.hero-stat-num[data-target]');
  nums.forEach(num => {
    const target = +num.dataset.target;
    const duration = 1800;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      num.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// ===== 导航栏高亮 =====
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

// ===== 移动端菜单 =====
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('open');
    });
  });
}

// ===== 回到顶部 =====
function initBacktop() {
  const btn = document.getElementById('backtop');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

// ===== 导航栏滚动效果 =====
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  const byProvince = groupData();
  const provinceOrder = getProvinceOrder(byProvince);

  renderProvinceNav(byProvince, provinceOrder);
  renderDestinations(byProvince, provinceOrder);
  initProvinceNav();

  setTimeout(() => {
    highlightProvinceOnScroll();
  }, 100);

  observeReveals();
  animateNumbers();
  highlightNav();
  initMobileMenu();
  initBacktop();
  initNavScroll();
  initProgressBar();

  // 管理员入口
  const token = localStorage.getItem('admin_token');
  if (token) {
    const footer = document.querySelector('.site-footer');
    if (footer) {
      const p = document.createElement('p');
      p.style.cssText = 'margin-top:8px;font-size:12px;opacity:.4;';
      p.innerHTML = '<a href="admin.html" style="color:rgba(255,255,255,.4);text-decoration:underline;">管理后台</a>';
      footer.appendChild(p);
    }
  }
});
