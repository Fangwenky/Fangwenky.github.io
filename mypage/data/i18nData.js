export const uiText = {
    zh: {
        siteName: 'F_wenky的个人主页',
        home: '首页',
        articles: '文章',
        projects: '项目',
        archive: '归档',
        about: '关于我',
        search: '搜索',
        latestArticles: '最新文章',
        featuredProjects: '精选项目',
        allArticles: '所有文章',
        allProjects: '所有项目',
        allArticlesLink: '所有文章',
        projectsShowcase: '项目展示',
        viewAllArticles: '查看所有文章',
        viewAllProjects: '查看所有项目',
        experience: '工作经历',
        interests: '兴趣爱好',
        contact: '联系方式',
        quickLinks: '快速链接',
        searchResults: '搜索结果',
        closeSearch: '关闭搜索结果',
        openNav: '打开导航菜单',
        closeNav: '关闭导航菜单',
        prevSlide: '上一张精选内容',
        nextSlide: '下一张精选内容',
        slideDot: index => `查看第 ${index + 1} 张精选内容`,
        featured: '精选内容',
        article: '文章',
        project: '项目',
        tags: '标签',
        noResults: '未找到相关内容',
        articleNotFound: '文章未找到。',
        projectNotFound: '项目未找到。',
        viewProject: '查看项目',
        searchLabel: '搜索关键词',
        searchPlaceholder: '请输入关键词搜索…',
        originalChineseNote: '正文目前保留中文原文。英文模式下先展示英文标题、摘要与标签，方便英文读者理解文章主题。',
        englishSummary: 'English Summary',
        copyright: '© F_wenky 的个人主页. All rights reserved.',
        langToggle: 'EN'
    },
    en: {
        siteName: "F_wenky's Homepage",
        home: 'Home',
        articles: 'Articles',
        projects: 'Projects',
        archive: 'Archive',
        about: 'About',
        search: 'Search',
        latestArticles: 'Latest Articles',
        featuredProjects: 'Featured Projects',
        allArticles: 'All Articles',
        allProjects: 'All Projects',
        allArticlesLink: 'All Articles',
        projectsShowcase: 'Project Showcase',
        viewAllArticles: 'View All Articles',
        viewAllProjects: 'View All Projects',
        experience: 'Experience',
        interests: 'Interests',
        contact: 'Contact',
        quickLinks: 'Quick Links',
        searchResults: 'Search Results',
        closeSearch: 'Close search results',
        openNav: 'Open navigation menu',
        closeNav: 'Close navigation menu',
        prevSlide: 'Previous featured item',
        nextSlide: 'Next featured item',
        slideDot: index => `Show featured item ${index + 1}`,
        featured: 'Featured',
        article: 'Article',
        project: 'Project',
        tags: 'Tags',
        noResults: 'No matching content found',
        articleNotFound: 'Article not found.',
        projectNotFound: 'Project not found.',
        viewProject: 'View Project',
        searchLabel: 'Search keyword',
        searchPlaceholder: 'Search articles and projects…',
        originalChineseNote: 'The full article is currently kept in Chinese. In English mode, the translated title, summary, and tags are shown first so English readers can understand the topic.',
        englishSummary: 'English Summary',
        copyright: "© F_wenky's Homepage. All rights reserved.",
        langToggle: '中'
    }
};

export const aboutTranslations = {
    en: {
        name: 'F_wenky',
        bio: 'An AI student who enjoys building playful projects, learning machine learning in public, and occasionally letting AI help push code through suspiciously large loops.',
        experience: [
            {
                title: 'Frontend Tester (Food Delivery Edition)',
                company: 'Meituan Waimai',
                duration: '2024 - Present',
                description: 'Testing ordering flows by ordering food very seriously.'
            },
            {
                title: 'Frontend Tester (Chat Group Edition)',
                company: 'Tencent QQ',
                duration: '2024 - Present',
                description: 'Testing chat interfaces by being extremely active in group chats.'
            },
            {
                title: 'AI Undergraduate, Xu Teli Elite Class',
                company: 'Beijing Institute of Technology',
                duration: '2024 - Present',
                description: 'This one is real, though the previous two may contain a little comedy.'
            }
        ],
        interests: ['Good food', 'Long sleep', 'Group chats', 'Learning tech from videos'],
        skills: ['Eating', 'Sleeping', 'Taking it easy', 'Still learning']
    }
};

export const projectTranslations = {
    en: {
        project1: {
            title: 'Identity V: Deduction Finale',
            description: 'A small web game created for a short-term web development course project.',
            tags: ['HTML', 'CSS', 'JavaScript'],
            category: 'Web App',
            content: `
                <h2>Identity V: Deduction Finale</h2>
                <p>This was a team web game project built during a short course on web design and development. Because the schedule was tight, we chose a fan-made theme based on Identity V, which gave us a ready-made world, visual references, and character background to build from.</p>
                <p>The game combines story reading, map exploration, puzzle solving, and card-based combat. Players follow Orpheus into the ruins of the manor, read fragments of old diaries, unlock characters, and gradually approach the final deduction.</p>
                <p>The result is not a polished commercial game, but it was a valuable exercise in shipping a complete browser-based interactive project within three weeks. It taught me how much coordination, asset management, and gameplay simplification matter when time is limited.</p>
            `
        },
        project2: {
            title: 'AI Soul Sketcher: CNN-Based Doodle Recognition',
            description: 'A browser-based doodle recognition app trained with PyTorch and deployed with ONNX Runtime Web for real-time inference.',
            tags: ['PyTorch', 'ONNX', 'Computer Vision', 'Web AI'],
            category: 'AI App',
            content: `
                <h2>Teaching AI to Understand Doodles</h2>
                <p>After practicing CNNs with MNIST, I wanted to see whether a model could recognize simple sketches drawn directly in the browser. Inspired by Google Quick, Draw!, this project became a small “draw and guess” web app.</p>
                <h3>Technical Approach</h3>
                <p>The model was trained in PyTorch on selected QuickDraw categories, exported to ONNX, and loaded in the browser through ONNX Runtime Web. The frontend uses HTML Canvas for drawing and performs preprocessing before inference.</p>
                <h3>Main Challenge</h3>
                <p>The hardest part was not the network itself, but making user drawings look like the training data. Canvas strokes need to be resized, centered, normalized, and converted into the format expected by the model.</p>
                <p>This project helped me connect model training with frontend deployment, which is a very different feeling from keeping everything inside a notebook.</p>
            `
        }
    }
};

export const articleTranslations = {
    "en": {
        "agent-tools-learning-notes": {
            "title": "From Chatbot to Agent: What Tool Calling Actually Changes",
            "excerpt": "A note on tool use, observations, permissions, memory, failure recovery, and what makes an agent more than a chatbot.",
            "tags": [
                "Agent",
                "Tool Calling",
                "LLM",
                "Engineering"
            ],
            "category": "LLM Applications",
            "readTime": "10 min read"
        },
        "ai-roadmap-sophomore": {
            "title": "My AI Learning Roadmap: What I Plan to Study This Sophomore Year",
            "excerpt": "A public learning plan from mathematical foundations to deep learning frameworks and engineering habits.",
            "tags": [
                "AI",
                "Learning Roadmap",
                "Deep Learning",
                "Annual Plan"
            ],
            "category": "Study Notes",
            "readTime": "5 min read"
        },
        "article1": {
            "title": "Some Opening Thoughts",
            "excerpt": "A short personal note about building this homepage as a beginning, rough but meaningful.",
            "tags": [
                "Life",
                "Reflection"
            ],
            "category": "Life",
            "readTime": "3 min read"
        },
        "hello-pytorch-mnist": {
            "title": "Hello PyTorch: From Manual Gradients to Autograd",
            "excerpt": "After hand-deriving backpropagation, PyTorch autograd feels like a huge productivity upgrade.",
            "tags": [
                "PyTorch",
                "Deep Learning",
                "MNIST",
                "Autograd"
            ],
            "category": "Framework Practice",
            "readTime": "6 min read"
        },
        "linux-remote-training-notes": {
            "title": "Training on Linux for the First Time: Remote Server Survival Notes",
            "excerpt": "Notes on SSH, tmux, conda, CUDA, logs, GPU memory, backups, and experiment reproducibility.",
            "tags": [
                "Linux",
                "Deep Learning",
                "Server",
                "Engineering"
            ],
            "category": "Engineering Notes",
            "readTime": "9 min read"
        },
        "llm-evaluation-notes": {
            "title": "LLM Evaluation Is More Than Checking Whether an Answer Sounds Good",
            "excerpt": "A small evaluation checklist for factuality, instruction following, stability, boundaries, and user experience.",
            "tags": [
                "LLM",
                "Evaluation",
                "Prompting",
                "Engineering"
            ],
            "category": "LLM Applications",
            "readTime": "9 min read"
        },
        "lora-finetuning-first-look": {
            "title": "Understanding LoRA: Why Fine-Tuning Does Not Need Every Parameter",
            "excerpt": "LoRA freezes the base model and trains low-rank adapters, making task adaptation cheaper and easier to manage.",
            "tags": [
                "LLM",
                "LoRA",
                "Fine-Tuning",
                "Deep Learning"
            ],
            "category": "LLM Learning",
            "readTime": "10 min read"
        },
        "may-learning-review-2026": {
            "title": "May Learning Review: From Model Basics to AI Engineering",
            "excerpt": "A learning review from NumPy and PyTorch to Transformer, RAG, LoRA, evaluation, and agent systems.",
            "tags": [
                "Learning Review",
                "AI",
                "LLM",
                "Growth"
            ],
            "category": "Learning Review",
            "readTime": "9 min read"
        },
        "numpy-linear-regression": {
            "title": "No More Black Boxes: Linear Regression from Scratch with NumPy",
            "excerpt": "Instead of calling fit(), I rebuilt linear regression with NumPy to understand gradient descent from the inside.",
            "tags": [
                "Machine Learning",
                "NumPy",
                "Math",
                "Implementation"
            ],
            "category": "Build from Scratch",
            "readTime": "8 min read"
        },
        "numpy-neural-network": {
            "title": "Beyond Linear Models: A Two-Layer Neural Network for XOR",
            "excerpt": "XOR exposes the limits of linear models. A hidden layer and activation function finally make the model bend.",
            "tags": [
                "Deep Learning",
                "Neural Network",
                "Backpropagation",
                "XOR"
            ],
            "category": "Build from Scratch",
            "readTime": "10 min read"
        },
        "paper-reading-method": {
            "title": "How I Read AI Papers Now: Three Passes and a Reproduction Checklist",
            "excerpt": "A practical method for reading papers by first finding the problem, then the method flow, and finally the key equations.",
            "tags": [
                "Paper Reading",
                "Learning Method",
                "AI",
                "Research Basics"
            ],
            "category": "Learning Method",
            "readTime": "8 min read"
        },
        "pytorch-cnn-cifar": {
            "title": "Giving AI Eyes: CNN Practice from Fully Connected Nets to CIFAR-10",
            "excerpt": "A study note on why fully connected networks struggle with images and how CNNs preserve spatial structure.",
            "tags": [
                "Computer Vision",
                "CNN",
                "PyTorch",
                "CIFAR-10"
            ],
            "category": "Framework Practice",
            "readTime": "8 min read"
        },
        "rag-first-principles": {
            "title": "What Problem Does RAG Actually Solve?",
            "excerpt": "A first-principles look at retrieval-augmented generation as a system of chunking, embeddings, ranking, grounding, and generation.",
            "tags": [
                "LLM",
                "RAG",
                "Vector Database",
                "Information Retrieval"
            ],
            "category": "LLM Applications",
            "readTime": "11 min read"
        },
        "resnet-skip-connection-notes": {
            "title": "Why Can ResNet Go Deeper? My Understanding of Skip Connections",
            "excerpt": "A study note on residual learning, gradient flow, normalization, and why deeper networks need better optimization paths.",
            "tags": [
                "ResNet",
                "CNN",
                "Computer Vision",
                "Deep Learning"
            ],
            "category": "Paper Reading",
            "readTime": "10 min read"
        },
        "stochastic-progress": {
            "title": "Stochastic Processes: Final Review Notes",
            "excerpt": "A structured course review covering Poisson processes, renewal theory, Markov chains, and martingales.",
            "tags": [
                "Stochastic Process",
                "Final Review",
                "Course Notes"
            ],
            "category": "Course Notes",
            "readTime": "12 min read"
        },
        "training-debugging-diary": {
            "title": "My Checklist for Debugging a Model That Refuses to Train",
            "excerpt": "A practical PyTorch debugging checklist covering data, labels, loss functions, gradients, learning rates, and overfitting tests.",
            "tags": [
                "PyTorch",
                "Training Tips",
                "Debugging",
                "Deep Learning"
            ],
            "category": "Engineering Notes",
            "readTime": "8 min read"
        },
        "transformer-attention-notes": {
            "title": "Understanding Transformer Attention from the Formula Up",
            "excerpt": "A first-principles note on Q, K, V, matrix shapes, masking, and what attention actually computes.",
            "tags": [
                "Transformer",
                "Attention",
                "NLP",
                "Paper Reading"
            ],
            "category": "Paper Reading",
            "readTime": "9 min read"
        }
    }
};
