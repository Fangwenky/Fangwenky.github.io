export const projects = [
    {
        id: 'project1',
        title: '第五人格：推演终幕',
        description: '小学期网页游戏制作小组作品',
        image: 'images/project1_pic.png',
        tags: ['HTML', 'CSS', 'JavaScript'],
        link: 'https://fangwenky.github.io/2.5.4/index.html',
        category: 'Web应用',
        date: '2025-09-28', // 添加日期字段
        content: `
            <h2>《第五人格：推演终幕》</h2>
            <p>众所周知，你🍐计院大二上小学期的课程网页设计与制作是制作一个网页，一个交互网站或者游戏，zfn 老师又是一个游戏迷，大家很多小组都会选择游戏制作，我们的六人小组就这样开启了为期三个星期的网页游戏制作工程。</p>
            <p>由于组内没有擅长美术的同学，为了减轻美工压力，我们决定开发一款基于第五人格的二创游戏。选择二创带来的还出很多，尤其是美工方面，角色的立绘，海报都有很多已经成型的素材，游戏场景也都有现有的基础考证，极大的减少了美工工作量。
            同时，世界观，背景故事，角色设定等等内容都有现成的题材，我们只需要再此基础上进行二次创作，这样节约下来文字工作内容，可以更多的把精力聚焦在玩法研发上。</p>
            <p>我们的游戏的主要玩法为：</p>
            <p>1. 主线剧情欣赏</p>
            <p>2. 地图探索解密</p>
            <p>3. 卡牌策略战斗</p>  
            <p>我们由主角奥尔菲斯进入如今已经是废墟的欧利蒂丝庄园的探索，阅读曾经的日记，逐步引出结局。日记分为四个章节，每个章节都对应着一次庄园实验，每个章节又分成许多幕，每一幕都是一个角色的故事，通过角色的个人独白
            来展示角色的故事，性格。求生者章节剧情欣赏后将会解锁这名求生者，监管者剧情欣赏后将会进入战斗，在战斗中，玩家将选择自己已经获得的求生者中的一个作为自己扮演的角色，自行在数十张卡牌中进行卡组搭配，然后于监管者进行战斗。</p>
            <p>由于制作工期比较短，游戏制作还是比较粗略和简陋，很多想法还没有实现，很多可以优化的地方并没有优化到位，但是作为一个三周时间做出来的小游戏，还是有一定的可玩性的，可以点击下方按钮“查看项目”进入游戏进行游玩。
            如果喜欢的话也可以为我的 github 库<a href="https://github.com/Fangwenky/Fangwenky.github.io">Fangwenky的个人库</a>点点star，谢谢啦。</p>
        `
    },
    {
        id: 'project2',
        title: 'AI 灵魂画手：基于 CNN 的简笔画识别',
        description: '一个“你画我猜”的网页应用。利用 PyTorch 训练 CNN 模型，通过 ONNX 部署到浏览器，实现零延迟实时识别。',
        image: 'images/project2_pic.svg',
        tags: ['PyTorch', 'ONNX', 'Computer Vision', 'Web AI'],
        link: 'https://github.com/Fangwenky/ai-doodle-classifier', // 请替换为你的真实仓库或 Demo 地址
        category: 'AI 应用',
        date: '2025-11-20', 
        content: `
            <h2>让 AI 看懂你的涂鸦</h2>
            <p>在学习了卷积神经网络（CNN）并用 MNIST 练手后，我突发奇想：既然 AI 能识别手写数字，那它能不能识别我画的简笔画呢？受 Google "Quick, Draw!" 项目的启发，我决定制作这个<strong>“AI 灵魂画手”</strong>网页应用。</p>
            
            <h3>🛠️ 技术栈与实现方案</h3>
            <p>为了让这个应用能直接在静态网页（Github Pages）上运行，我没有使用 Python 后端，而是挑战了<strong>前端推理 (Edge AI)</strong> 方案：</p>
            <ul>
                <li><strong>数据准备：</strong> 使用 Google QuickDraw 数据集（选取了猫、苹果、飞机、闹钟等 20 个常见类别）。</li>
                <li><strong>模型训练：</strong> 使用 <strong>PyTorch</strong> 搭建了一个 3 层卷积 + 2 层全连接的轻量级 CNN 模型，在本地 GPU 上训练，准确率达到 92%。</li>
                <li><strong>模型部署：</strong> 将 <code>.pth</code> 模型导出为通用格式 <strong>ONNX</strong>。</li>
                <li><strong>前端交互：</strong> 使用 HTML5 Canvas 实现画板，利用 <strong>ONNX Runtime Web</strong> 在浏览器端直接加载模型进行推理，无需服务器支持。</li>
            </ul>

            <h3>💡 遇到的挑战</h3>
            <p>最大的坑在于<strong>数据预处理</strong>。用户在 Canvas 上画出来的线条是白底黑线，且线条粗细不一；而模型训练数据是 28x28 的灰度图。我必须在前端用 JavaScript 对 Canvas 图像进行缩放、归一化处理，使其分布尽可能接近训练数据，否则识别率会大幅下降。</p>

            <h3>✨ 最终效果</h3>
            <p>目前模型已经能够非常精准地识别出“猫”、“冰淇淋”和“自行车”。虽然我的画技很烂（真正的灵魂画手），但 AI 依然能通过特征提取猜出我画的是什么，这种“心有灵犀”的感觉非常奇妙。</p>
            
            <p>欢迎点击下方按钮体验 Demo，或者去 Github 查看源码（包含了完整的 PyTorch 训练脚本和前端代码）。如果你觉得有趣，请给我的 Repo 点个 Star ⭐️！</p>
        `
    },
    // {
    //     id: 'project2',
    //     title: '项目二',
    //     description: '这是项目二的描述内容...',
    //     image: 'images/project2.svg',
    //     tags: ['React', 'TypeScript'],
    //     link: '#',
    //     category: '移动应用',
    //     date: '2023-02-20', // 添加日期字段
    //     content: '这是项目二的详细内容，可以包含多段文字、图片等，以文章形式展示。'
    // }
];