export const articles = [
    {
        id: 'article1',
        title: '一些碎碎念·作为开始',
        excerpt: '算是心血来潮为自己写了个人主页，也是一个晚上就写下了这个雏形，虽然草率但也算是一个开始',
        date: '2025-09-28',
        tags: ['生活', '感想'],
        image: 'images/article1_pic.png',
        readTime: '3 分钟阅读',
        category: '生活',
        type:'html',
        content: `
            <h2>Fang wenky 的碎碎念</h2>
            <p>大二专业分流后也是有一段时间了，经历了三个星期的小学期网页开发，又经历了两个星期多的早八折磨，到了十一跟前，人也是忙的有些疲惫，可能晚睡早起，天气转凉，加上许多忙碌的事务和一些上火，还是身体抱恙，难受了起来。
            想着十一也快要来了，也想趁着假期休息休息，把自己的一些还没有太多时间做的快要结项的一些项目趁机处理一下，也算是整理一下这些时间一直积攒着的杂务，希望能有一个更好的新的开始。</p>
            <p>今晚也是心血来潮，决定做这样一个个人主页，于是乎就在 push AI 反复修改的重复之下把这个网页搭建的初见雏形，虽然还是很简陋，但是后面还会有很多时间去修补和完善的……吧？
            希望我能用这样的一个个人主页，来记录和分享一些我的生活，我的体验，我的感想，希望我的一些想法和思考也就能给你们带来一些启示。</p>
            <p>当然，作为计算机学院的学生，许多开源的资料，大佬们的无偿分享，都让我受益匪浅，我最最最希望的，也就是能够用我的这样一个平台，进行一些分享，我会把一些自己做的小项目，自己收集的一些学习资料，自己总结的一些学习经验，
            在这里，分享给大家，希望或多或少，可以对一些后来之人有一些帮助。我希望能帮助学弟学妹少走一些弯路，在这个容易陷入迷茫四处碰壁的大学生活，一个好的指引，我相信会让人受益匪浅。</p>
            <p>希望我以后能把这个网站做的内容更丰富，功能更完善一点，希望今天 AI 写下的史山不会让以后的我试图给今天的我一个大逼兜。</p>
            <p>希望我们都有美好光耀的未来。</p>
        `
    },
    {
        id: 'ai-roadmap-sophomore',
        title: '我的 AI 学习路线图：大二这一年我打算学什么？',
        excerpt: '大二是一个分水岭。不再满足于调包，我决定用这一年时间，从数学底层到深度学习框架，系统构建我的 AI 知识体系。本文记录了我的年度学习计划与 Flag...',
        date: '2025-10-01',
        tags: ['人工智能', '学习路线', '深度学习', '年度计划'],
        image: 'images/ai-roadmap-cover.svg', 
        readTime: '5 分钟阅读',
        category: '学习笔记',
        type:'html',
        content: `
            <h2>为什么写这篇文章？</h2>
            <p>步入大二，我意识到人工智能不仅仅是调用 <code>model.fit()</code> 那么简单。在过去的一年里，我接触了基础的编程，但面对复杂的论文和底层原理时常常感到吃力。</p>
            <p>大二这一年是打基础的黄金时期。我信奉 <strong>"Learning in Public"（公开学习）</strong> 的理念，所以这篇博文既是我的路线图，也是我立下的 Flag。我希望通过系统化的学习，从一名 AI 爱好者转变为一名具备工程能力的 AI 开发者。</p>
            
            <img src="images/roadmap-mindmap.svg" alt="学习路线思维导图" style="display: block; margin: 20px auto; max-width: 100%; height: auto; border-radius: 8px;">

            <h2>第一阶段：重铸数学之魂 (Foundations)</h2>
            <p>AI 的本质是数学。我不想做一个只会调参数的“炼丹师”，我要理解黑盒背后的原理。本学期的重点是：</p>
            <ul>
                <li><strong>线性代数：</strong> 重点复习特征值与特征向量、SVD 奇异值分解（在降维中非常重要）。</li>
                <li><strong>微积分：</strong> 彻底搞懂梯度下降（Gradient Descent）的数学推导，理解链式法则在反向传播中的应用。</li>
                <li><strong>概率论：</strong> 深入理解贝叶斯定理和极大似然估计。</li>
            </ul>

            <h2>第二阶段：机器学习——从原理到手写 (Classic ML)</h2>
            <p>虽然 Scikit-learn 很强大，但正如费曼所说：“<em>What I cannot create, I do not understand.</em>”</p>
            <p>我的目标是<strong>不依赖高级库，仅用 NumPy 实现以下算法</strong>：</p>
            <ol>
                <li>线性回归与逻辑回归（实现梯度下降优化器）</li>
                <li>K-Means 聚类算法</li>
                <li>简单的神经网络（手动实现 Backpropagation）</li>
            </ol>

            <h2>第三阶段：拥抱深度学习与 PyTorch (Deep Learning)</h2>
            <p>在打好基础后，我将全面转向深度学习。目前的计划是深入学习 <strong>PyTorch</strong> 框架。</p>
            <ul>
                <li><strong>计算机视觉 (CV)：</strong> 复现经典的 CNN 模型（如 AlexNet, ResNet），做一个自己的图像分类项目。</li>
                <li><strong>自然语言处理 (NLP)：</strong> 啃透 Transformer 架构，精读《Attention Is All You Need》，尝试微调一个小的语言模型。</li>
            </ul>
            <p>这期间，我会把学习笔记整理成博客文章，发布在“论文精读”专栏。</p>

            <h2>第四阶段：工程化与工具 (MLOps & Tools)</h2>
            <p>模型在 Jupyter Notebook 里跑通只是第一步。我希望提升我的工程素养：</p>
            <ul>
                <li><strong>Linux 与命令行：</strong> 熟练使用服务器进行远程训练。</li>
                <li><strong>Git 版本控制：</strong> 规范化我的代码提交习惯。</li>
                <li><strong>Docker：</strong> 学习如何打包我的环境，解决“在我的机器上能跑”的问题。</li>
            </ul>

            <h2>结语</h2>
            <p>路漫漫其修远兮。这是一份充满挑战的计划，但我已经准备好了。如果你也正在学习 AI，欢迎在下方留言或者通过邮件与我交流，我们一起进步！</p>
            <p><em>Next Stop: NumPy 实现线性回归。Stay tuned!</em></p>
        `
        },
        {
        id: 'numpy-linear-regression',
        title: '拒绝调包：用 NumPy 手写线性回归，彻底搞懂梯度下降',
        excerpt: 'Scikit-learn 的 fit() 很好用，但它掩盖了太多细节。为了彻底理解机器学习的核心——梯度下降，我决定抛弃框架，仅用 NumPy 徒手实现一个线性回归模型。',
        date: '2025-10-10', // 建议设定在上一篇发布后的一周左右
        tags: ['机器学习', 'NumPy', '数学原理', '代码实现'],
        image: 'images/linear-regression-cover.svg', // 对应的 SVG 图片代码在下面
        readTime: '8 分钟阅读',
        category: '造轮子系列',
        type:'html',
        content: `
            <h2>为什么要重新发明轮子？</h2>
            <p>在上一篇《学习路线图》中，我立下了一个 Flag：要深入理解算法底层。线性回归（Linear Regression）看起来最简单，但它是理解神经网络训练过程（前向传播、损失计算、反向传播/梯度更新）的最佳跳板。</p>
            <p>很多大二同学（包括之前的我）只会写：</p>
            <pre><code class="language-python">from sklearn.linear_model import LinearRegression
    model = LinearRegression()
    model.fit(X, y) # 魔法发生了，但怎么发生的？</code></pre>
            <p>今天，我要拆解这个黑盒。</p>

            <h2>核心数学原理：梯度下降 (Gradient Descent)</h2>
            <p>我们的目标是找到一条直线 \( y = wx + b \)，使得它离所有数据点都尽可能近。这就需要定义一个<strong>损失函数 (Loss Function)</strong>，通常使用均方误差 (MSE)：</p>
            <img src="images/loss-function-formula.svg" alt="MSE公式" style="display: block; margin: 20px auto; max-width: 80%; height: auto;">
            <p>为了让 Loss 最小，我们需要求导，计算梯度，然后沿着梯度的反方向更新参数 \( w \) 和 \( b \)。这就好比下山，每一步都往最陡峭的下坡方向走。</p>

            <h2>代码实现：Talk is cheap</h2>
            <p>首先，生成一些带噪声的模拟数据：</p>
            <pre><code class="language-python">import numpy as np
    import matplotlib.pyplot as plt

    # 生成数据：y = 2x + 5 + noise
    X = np.random.rand(100, 1)
    y = 2 * X + 5 + 0.1 * np.random.randn(100, 1)</code></pre>

            <p>接着，核心的训练循环（Training Loop）：</p>
            <pre><code class="language-python"># 初始化参数
    w = 0.0
    b = 0.0
    lr = 0.1  # 学习率

    for epoch in range(1000):
        # 1. 前向传播
        y_pred = w * X + b
        
        # 2. 计算梯度 (求导过程)
        dw = (2/len(X)) * np.sum((y_pred - y) * X)
        db = (2/len(X)) * np.sum(y_pred - y)
        
        # 3. 更新参数
        w = w - lr * dw
        b = b - lr * db</code></pre>

            <h2>可视化结果</h2>
            <p>经过 1000 次迭代，我的模型终于学会了这条直线！看看拟合的效果：</p>
            <img src="images/linear-regression-plot.svg" alt="线性回归拟合结果" style="display: block; margin: 20px auto; max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

            <h2>总结与反思</h2>
            <p>虽然代码只有短短十几行，但我真正理解了<strong>学习率 (Learning Rate)</strong> 的作用。如果把 lr 调大到 1.0，Loss 直接飞了（梯度爆炸）；调得太小，训练速度又极慢。</p>
            <p>既然搞定了线性回归，<strong>下一站：尝试用同样的逻辑，手写一个简单的神经网络分类器！</strong></p>
        `
    },
    {
        id: 'numpy-neural-network',
        title: '打破线性束缚：手写一个双层神经网络，解决 XOR 问题',
        excerpt: '线性回归虽然美好，但它甚至无法解决简单的异或（XOR）问题。为了处理复杂的世界，我给模型加上了“隐藏层”和“激活函数”，亲手构建了我的第一个神经网络。',
        date: '2025-10-21', 
        tags: ['深度学习', '神经网络', '反向传播', 'XOR'],
        image: 'images/nn-xor-cover.svg',
        readTime: '10 分钟阅读',
        category: '造轮子系列',
        type:'html',
        content: `
            <h2>线性模型的极限</h2>
            <p>在上一篇实现线性回归后，我尝试用同样的方法去分类“异或”数据（XOR）。结果惨不忍睹——无论怎么训练，准确率都在 50% 徘徊。</p>
            <p>原因很简单：<strong>异或问题不是线性可分的</strong>。就像下图所示，你无法画出一条直线，把红色和蓝色的点完全分开。</p>
            <img src="images/linear-vs-nonlinear.svg" alt="线性不可分 vs 神经网络分类" style="display: block; margin: 20px auto; max-width: 100%; height: auto; border-radius: 8px;">
            
            <h2>引入“魔法”：隐藏层与激活函数</h2>
            <p>为了解决这个问题，我们需要引入两个变革性的概念：</p>
            <ol>
                <li><strong>隐藏层 (Hidden Layer)</strong>：增加特征转换的能力。</li>
                <li><strong>激活函数 (Activation Function)</strong>：最关键的一步！如果没有非线性的激活函数（如 Sigmoid 或 ReLU），多少层神经网络叠加最后依然只是一个线性模型。</li>
            </ol>

            <h2>代码实现：双层网络</h2>
            <p>这次的模型结构是：<code>Input(2) -> Hidden(10) -> Activation -> Output(1)</code>。</p>
            <p>最让人头秃的是<strong>反向传播 (Backpropagation)</strong> 的推导，链式法则在这里变得更加复杂：</p>

            <pre><code class="language-python"># Sigmoid 激活函数及其导数
    def sigmoid(x):
        return 1 / (1 + np.exp(-x))

    def sigmoid_derivative(x):
        return x * (1 - x)

    # 训练循环核心片段
    for epoch in range(5000):
        # --- 前向传播 (Forward) ---
        hidden_layer_input = np.dot(X, weights_input_hidden) + bias_hidden
        hidden_layer_output = sigmoid(hidden_layer_input) # 非线性变换！
        
        output_layer_input = np.dot(hidden_layer_output, weights_hidden_output) + bias_output
        predicted_output = sigmoid(output_layer_input)

        # --- 反向传播 (Backward) ---
        # 这部分公式推导花了我整整一下午...
        error = y - predicted_output
        d_predicted_output = error * sigmoid_derivative(predicted_output)
        
        error_hidden_layer = d_predicted_output.dot(weights_hidden_output.T)
        d_hidden_layer = error_hidden_layer * sigmoid_derivative(hidden_layer_output)

        # 更新权重
        weights_hidden_output += hidden_layer_output.T.dot(d_predicted_output) * lr
        weights_input_hidden += X.T.dot(d_hidden_layer) * lr</code></pre>

            <h2>顿悟时刻</h2>
            <p>当看到 Loss 曲线终于突破瓶颈，迅速下降接近于 0 时，那种成就感无以言表。模型终于学会了画一条“弯曲”的线来分割数据。</p>
            <p>不过，手动计算每一个矩阵的导数实在是太容易出错了（特别是维度对齐的时候）。我开始理解为什么我们需要框架了。</p>
            <p><strong>Next Stop: 告别手算梯度，拥抱 PyTorch 自动微分 (Autograd)！</strong></p>
        `
    },
    {
        id: 'hello-pytorch-mnist',
        title: 'Hello PyTorch：从 NumPy 手推公式到 PyTorch 自动微分',
        excerpt: '还记得上一篇为了解决 XOR 问题，我推导矩阵求导推到头秃吗？今天我遇到了 PyTorch，才发现原来只需要一行 loss.backward() 就能搞定一切。',
        date: '2025-11-07',
        tags: ['PyTorch', '深度学习', 'MNIST', '自动微分'],
        image: 'images/pytorch-mnist-cover.svg',
        readTime: '6 分钟阅读',
        category: '框架实战',
        type:'html',
        content: `
            <h2>再见，手动求导</h2>
            <p>在上一篇文章中，我用 NumPy 手写了一个神经网络。虽然我很自豪能写出来，但那个反向传播的链式法则推导简直是噩梦。如果网络再深一点（比如 50 层），手动推导简直是不可能的任务。</p>
            <p>这也是为什么我们需要 <strong>深度学习框架</strong>。今天我正式入坑 <strong>PyTorch</strong>。</p>

            <h2>PyTorch 的核心魔法：Autograd</h2>
            <p>PyTorch 最让人感动的功能叫 <strong>自动微分 (Automatic Differentiation)</strong>。你只需要定义前向传播（怎么算 Loss），它会自动帮你把反向传播（怎么算梯度）全做了。</p>
            <p>对比一下代码量：</p>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; color: #64748b; font-size: 0.9em;">🛑 NumPy (Old Way):</p>
                <pre style="margin-top: 5px;"><code class="language-python">d_loss = ... # 一大堆数学公式
    d_w2 = ...   # 甚至还要注意矩阵转置
    w2 -= lr * d_w2</code></pre>
                <hr style="border-top: 1px dashed #cbd5e1; margin: 10px 0;">
                <p style="margin: 0; color: #ee4c2c; font-weight: bold; font-size: 0.9em;">🔥 PyTorch (New Way):</p>
                <pre style="margin-top: 5px;"><code class="language-python">loss.backward() # 魔法发生的地方！
    optimizer.step()</code></pre>
            </div>

            <h2>实战：MNIST 手写数字识别</h2>
            <p>为了测试 PyTorch，我选择了经典的 MNIST 数据集。这是一个包含 60,000 张手写数字图片的数据集。</p>
            <p>我构建了一个简单的全连接网络：</p>
            <pre><code class="language-python">import torch
    import torch.nn as nn

    # 定义模型
    model = nn.Sequential(
        nn.Linear(784, 128),  # 输入层 (28x28像素展平)
        nn.ReLU(),            # 激活函数 (不用自己写 sigmoid 了!)
        nn.Linear(128, 10)    # 输出层 (0-9 十个数字)
    )

    # 训练极其简单
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    # ... 训练循环略 ...
    </code></pre>

            <h2>预测结果可视化</h2>
            <p>训练了仅仅 5 个 Epoch，准确率就达到了 97%！来看看模型对测试集图片的预测结果：</p>
            <img src="images/mnist-prediction.svg" alt="MNIST 预测结果展示" style="display: block; margin: 20px auto; max-width: 100%; height: auto; border-radius: 8px;">
            
            <p>如上图所示，模型非常自信地识别出了数字 7、2 和 1。这就是现代 AI 开发的效率。</p>

            <h2>下一步计划</h2>
            <p>虽然全连接网络能处理 MNIST，但对于复杂的彩色图片（比如猫和狗），它就力不从心了。因为它会破坏图片的二维空间结构。</p>
            <p><strong>Next Stop: 计算机视觉的皇冠——卷积神经网络 (CNN)。</strong></p>
        `
    },
    {
        id: 'pytorch-cnn-cifar',
        title: '给 AI 装上眼睛：从全连接到卷积神经网络 (CNN) 实战',
        excerpt: '当全连接网络在 CIFAR-10 数据集上屡战屡败时，我意识到 AI 需要一种新的“看”世界的方式。本文记录了我学习卷积神经网络（CNN）的笔记，以及如何用 PyTorch 搭建一个 LeNet 风格的模型。',
        date: '2025-11-19',
        tags: ['计算机视觉', 'CNN', 'PyTorch', 'CIFAR-10'],
        image: 'images/cnn-cover.svg',
        category: '框架实战',
        type:'html',
        content: `
            <h2>全连接层的死穴</h2>
            <p>上一周，我尝试把之前的 MNIST 模型直接用到 <strong>CIFAR-10</strong> 数据集上。结果非常尴尬：准确率卡在 45% 上不去。</p>
            <p>这让我意识到全连接层 (Fully Connected Layer) 的一个巨大缺陷：<strong>它暴力地把二维图像拉平成了一维向量。</strong></p>
            <p>这就好比把一张拼图拆散成碎片排成一行，原本“眼睛在鼻子上面”这种空间结构信息全丢失了。对于只有黑白线条的数字还凑合，但对于复杂的猫狗照片，这简直是毁灭性的。</p>

            <h2>救星：卷积 (Convolution)</h2>
            <p>卷积神经网络 (CNN) 的核心思想是：<strong>不要一次看全图，而是像手电筒一样，用一个过滤器 (Kernel) 在图片上滑动。</strong></p>
            <p>我画了一张图来理解这个过程：</p>
            <img src="images/cnn-architecture.svg" alt="CNN 架构原理图" style="display: block; margin: 20px auto; max-width: 100%; height: auto; border-radius: 8px;">
            
            <ul>
                <li><strong>卷积层 (Conv):</strong> 负责提取特征（边缘、纹理、形状）。</li>
                <li><strong>池化层 (Pool):</strong> 负责近视眼（模糊化），保留主要特征，减少计算量。</li>
            </ul>

            <h2>PyTorch 代码实现</h2>
            <p>我参考经典的 LeNet 结构，搭建了一个简单的 CNN：</p>
            <pre><code class="language-python">class SimpleCNN(nn.Module):
        def __init__(self):
            super().__init__()
            # 1. 卷积提取特征
            self.features = nn.Sequential(
                # 输入: 3通道(RGB), 输出: 32个特征图, 卷积核: 3x3
                nn.Conv2d(3, 32, kernel_size=3, padding=1),
                nn.ReLU(),
                nn.MaxPool2d(2, 2), # 图片尺寸减半
                
                nn.Conv2d(32, 64, kernel_size=3, padding=1),
                nn.ReLU(),
                nn.MaxPool2d(2, 2)  # 图片尺寸再减半
            )
            # 2. 全连接进行分类
            self.classifier = nn.Sequential(
                nn.Flatten(),
                nn.Linear(64 * 8 * 8, 512),
                nn.ReLU(),
                nn.Linear(512, 10) # 10类
            )

        def forward(self, x):
            x = self.features(x)
            x = self.classifier(x)
            return x</code></pre>

            <h2>训练结果对比</h2>
            <p>同样的训练轮数（Epochs）：</p>
            <ul>
                <li><strong>MLP (全连接):</strong> 45% 准确率（也就比瞎猜好点）</li>
                <li><strong>CNN (本模型):</strong> <strong>72% 准确率</strong> 🚀</li>
            </ul>
            <p>虽然 72% 在学术界不算高（SOTA 都是 99%），但这是我第一次亲手感受到 CNN 提取空间特征的威力！</p>

            <h2>下一步：深度风暴</h2>
            <p>两层卷积还是太浅了。据说微软提出的 <strong>ResNet</strong> 有 152 层那么深……下次我要挑战一下复现经典的 ResNet 结构！</p>
        `
    },
    {
      id: 'stochastic_progress',
        title: '随机过程：期末教材知识点总结',
        excerpt: '随机过程课程历来缺少复习资料，只好将课本中的知识点进行一些总结。',
        date: '2025-12-01', 
        tags: ['随机过程', '期末复习', '课程资料'],
        image: 'images/stochastic-progress-cover.svg',
        readTime: '12 分钟阅读',
        category: '课程资料',
        type:'md',
        content: `
# 第1章 准备知识 (Preliminaries)

本章是全书的数学基础，其中**条件期望**是后续章节（特别是鞅、Markov链）的核心工具。

### 1.1 概率与极限
*   **【定义】事件的极限 (Page 2)**
*   若 $\\{E_n, n \\ge 1\\}$ 是递增序列（$E_n \\subset E_{n+1}$），则 $\\lim_{n \\to \\infty} E_n = \\bigcup_{i=1}^{\\infty} E_i$。
*   若 $\\{E_n, n \\ge 1\\}$ 是递减序列（$E_n \\supset E_{n+1}$），则 $\\lim_{n \\to \\infty} E_n = \\bigcap_{i=1}^{\\infty} E_i$。
*   **【命题 1.1.1】概率的连续性 (Page 3)**
*   对于单调（递增或递减）事件序列，$\\lim_{n \\to \\infty} P(E_n) = P(\\lim_{n \\to \\infty} E_n)$。
*   **【命题 1.1.2】Borel-Cantelli 引理 (Page 3)**
*   若 $\\sum_{i=1}^{\\infty} P(E_i) < \\infty$，则 $P(\\text{无穷多个 } E_i \\text{ 发生}) = 0$。
*   **【命题 1.1.3】Borel-Cantelli 引理的逆 (Page 3)**
*   若 $E_1, E_2, \\dots$ 是**独立**事件，且 $\\sum_{i=1}^{\\infty} P(E_i) = \\infty$，则 $P(\\text{无穷多个 } E_i \\text{ 发生}) = 1$。

### 1.2 随机变量
*   **【定义】分布函数 (Page 4):** $F(x) = P\\{X \\le x\\}$。
*   **【定义】独立性 (Page 5):** 若对于任意实数集 $A, B$，有 $P\\{X \\in A, Y \\in B\\} = P\\{X \\in A\\}P\\{Y \\in B\\}$，则 $X$ 和 $Y$ 独立。

### 1.3 期望值
*   **【定义】期望 (Page 5):** $E[X] = \\int_{-\\infty}^{\\infty} x dF(x)$。
*   **【公式】指示变量法 (Page 6 - 例1.3 A):**
*   将 $X$ 写成指示变量之和 $X = \\sum X_i$，其中 $X_i$ 为 Bernoulli 变量。这是解决匹配问题（Matching Problem）的关键技巧。

### 1.4 矩母函数 (MGF)
*   **【定义】矩母函数 (Page 9):** $\\phi(t) = E[e^{tX}]$。
*   **【性质】** $\\phi^{(n)}(0) = E[X^n]$。
*   **【例 1.4 (B)】独立随机变量和的矩母函数 (Page 11):**
*   若 $X_1, \\dots, X_n$ 独立，则 $\\phi_{\\sum X_i}(t) = \\prod \\phi_{X_i}(t)$。

### 1.5 条件期望 (全书核心)
*   **【定义】条件期望 (Page 12):**
*   离散情形: $E[X|Y=y] = \\sum_x x P\\{X=x | Y=y\\}$。
*   连续情形: $E[X|Y=y] = \\int_{-\\infty}^{\\infty} x f(x|y) dx$。
*   **【定理】双重期望公式 (Page 12 - 公式 1.5.1):**
*   $$E[X] = E[E[X|Y]]$$
*   **解释:** $E[X|Y]$ 是随机变量 $Y$ 的函数，对其再求期望即得 $E[X]$。
*   **【公式】条件方差公式 (Page 13 - 例1.5 A中推导):**
*   $\\text{Var}(X) = E[\\text{Var}(X|Y)] + \\text{Var}(E[X|Y])$。
*   **【典型例题】**
*   **例 1.5 (A) 随机个随机变量之和 (Page 13):** 若 $N$ 是随机变量，$X_i$ 独立同分布，求 $\\sum_{i=1}^N X_i$ 的期望与方差。
*   **例 1.5 (C) 匹配问题再访 (Page 14):** 利用条件期望建立递归方程求解。

### 1.6 指数分布、无记忆性与失效率
*   **【定义】无记忆性 (Page 22 - 公式 1.6.2):**
*   $P\\{X > s+t | X > t\\} = P\\{X > s\\}$。
*   指数分布是唯一具有无记忆性的连续型分布。
*   **【定义】失效率函数 (Hazard Rate) (Page 23):**
*   $\\lambda(t) = \\frac{f(t)}{1-F(t)}$。对于指数分布，失效率 $\\lambda(t) = \\lambda$ (常数)。

### 1.7 一些概率不等式
*   **【命题 1.7.1】Markov 不等式 (Page 24):** $P\\{X \\ge a\\} \\le \\frac{E[X]}{a}$ (其中 $X \\ge 0$)。
*   **【命题 1.7.2】Chernoff 界 (Page 24):** 利用矩母函数给出尾概率的指数级上界。
*   **【命题 1.7.3】Jensen 不等式 (Page 25):** 若 $f$ 是凸函数，则 $E[f(X)] \\ge f(E[X])$。

### 1.8 极限定理
*   **强大多数定律 (Page 25):** 样本均值以概率 1 收敛于期望。
*   **中心极限定理 (Page 25):** 独立同分布和的标准化序列收敛于标准正态分布。

---

# 第2章 Poisson 过程

### 2.1 Poisson 过程的定义
*   **【定义 2.1.1】计数过程 (Page 36):**
*   $N(t)$ 表示到时刻 $t$ 为止发生的事件总数。满足：(i) $N(0)=0$; (ii) 独立增量; (iii) 在任意长度 $t$ 区间中事件数的分布服从均值为 $\\lambda t$ 的 Poisson 分布。
*   **【定义 2.1.2】构造性定义 (Page 37):**
*   满足：(i) $N(0)=0$; (ii) 独立增量、平稳增量; (iii) $P(N(h)=1) = \\lambda h + o(h)$; (iv) $P(N(h) \\ge 2) = o(h)$。
*   **【定理 2.1.1】** 定义 2.1.1 与 定义 2.1.2 是等价的 **(Page 37)**。

### 2.2 到达间隔与等待时间
*   **【命题 2.2.1】到达间隔分布 (Page 39):**
*   到达间隔序列 $X_1, X_2, \\dots$ 是独立同分布的，服从参数为 $\\lambda$ 的**指数分布**。
*   **等待时间 $S_n$ (Page 39):**
*   第 $n$ 个事件发生的时刻 $S_n = \\sum_{i=1}^n X_i$ 服从参数为 $(n, \\lambda)$ 的 **Gamma 分布**。

### 2.3 到达时间的条件分布
*   **【定理 2.3.1】次序统计量性质 (Page 41):**
*   给定 $N(t)=n$，这 $n$ 个事件发生的时刻 $S_1, \\dots, S_n$ 的联合分布，与 $(0, t)$ 上 $n$ 个独立均匀分布随机变量的次序统计量的分布相同。
*   **【典型例题】例 2.3 (A) (Page 41):** 计算乘客在火车站的总等待时间期望，利用了上述定理。

### 2.4 非时齐 Poisson 过程
*   **【定义 2.4.1】 (Page 48):**
*   强度函数 $\\lambda(t)$ 不再是常数。增量 $N(t+s) - N(t)$ 服从均值为 $m(t+s)-m(t)$ 的 Poisson 分布，其中 $m(t) = \\int_0^t \\lambda(s) ds$。

### 2.5 复合 Poisson 过程
*   **【定义】 (Page 50):**
*   $X(t) = \\sum_{i=1}^{N(t)} Y_i$，其中 $N(t)$ 是 Poisson 过程，$Y_i$ 是独立同分布随机变量。
*   **【矩公式】 (Page 51 - 例 2.5 A):**
*   $E[X(t)] = \\lambda t E[Y_1]$
*   $\\text{Var}(X(t)) = \\lambda t E[Y_1^2]$

---

# 第3章 更新理论 (Renewal Theory)

### 3.1 引言与准备知识
*   **【定义】更新过程 (Page 60):**
*   计数过程 $\\{N(t), t \\ge 0\\}$，其中到达间隔 $X_n$ 是独立同分布的非负随机变量，分布为 $F$。
*   **【定义】更新函数 (Page 61):**
*   $m(t) = E[N(t)]$。

### 3.2 N(t) 的分布
*   **【命题 3.2.1】更新方程 (Page 61 - 公式 3.2.3):**
*   $m(t) = F(t) + \\int_0^t m(t-x) dF(x)$。这是更新理论的基础积分方程。

### 3.3 极限极限定理
*   **【命题 3.3.1】 (Page 62):**
*   $N(t)/t \\to 1/\\mu$ (以概率 1 成立)，其中 $\\mu = E[X_n]$。
*   **【定理 3.3.2】Wald 方程 (Page 64):**
*   若 $X_n$ 独立同分布，$N$ 是对应于 $X_n$ 的停时且 $E[N]<\\infty$，则 $E[\\sum_{i=1}^N X_i] = E[N]E[X]$。
*   **【定理 3.3.4】基本更新定理 (Page 65):**
*   $\\lim_{t \\to \\infty} \\frac{m(t)}{t} = \\frac{1}{\\mu}$。

### 3.4 关键更新定理及其应用
*   **【定理 3.4.1】Blackwell 定理 (Page 67):**
*   对于非格点分布 $F$，$\\lim_{t \\to \\infty} [m(t+a) - m(t)] = \\frac{a}{\\mu}$。
*   **【定理 3.4.2】关键更新定理 (Page 68):**
*   若 $h(t)$ 直接 Riemann 可积，则 $\\lim_{t \\to \\infty} \\int_0^t h(t-x) dm(x) = \\frac{1}{\\mu} \\int_0^{\\infty} h(t) dt$。这是求极限分布的通用工具。
*   **【典型应用】交替更新过程 (Page 71 - 例 3.4 A):**
*   利用关键更新定理证明系统处于“开”状态的极限概率为 $\\frac{E[\\text{On}]}{E[\\text{On}] + E[\\text{Off}]}$。

### 3.5 延迟更新过程
*   **【定义】 (Page 76):**
*   第一个到达间隔 $X_1$ 的分布 $G$ 与后续 $X_i$ 的分布 $F$ 不同。
*   **【平衡更新过程】 (Page 76):** 当 $G$ 取为平衡分布 $F_e(x) = \\int_0^x \\frac{1-F(y)}{\\mu} dy$ 时，过程变为平稳的。

### 3.6 更新报酬过程
*   **【定理 3.6.1】 (Page 82):**
*   若每次循环获得报酬 $R_n$ 和时长 $X_n$，则长期平均报酬 $\\lim_{t \\to \\infty} \\frac{R(t)}{t} = \\frac{E[R]}{E[X]}$ (以概率1成立)。
*   **【例 3.6 (C)】 (Page 85):** 火车发车问题，展示了如何构造循环来计算平均费用。

---

# 第4章 Markov 链 (离散时间)

### 4.1 引言与例子
*   **【定义】Markov 链 (Page 101 - 公式 4.1.1):**
*   $P\\{X_{n+1}=j | X_n=i, X_{n-1}=i_{n-1}, \\dots\\} = P_{ij}$。即“将来只依赖于现在，而与过去无关”。
*   **【典型例题】例 4.1 (A) M/G/1 排队系统 (Page 101):**
*   利用顾客离去时刻作为嵌入点，将其转化为离散 Markov 链。

### 4.2 C-K 方程和状态分类
*   **【公式】Chapman-Kolmogorov 方程 (Page 104 - 4.2.1):**
*   $P_{ij}^{n+m} = \\sum_{k=0}^{\\infty} P_{ik}^n P_{kj}^m$。
*   **【定义】互通与类 (Page 104):** 状态 $i$ 与 $j$ 互通 ($i \\leftrightarrow j$)。
*   **【定义】常返与暂态 (Page 105):**
*   常返 (Recurrent): 以概率 1 最终回到该状态。$\\sum P_{ii}^n = \\infty$。
*   暂态 (Transient): 以正概率不再回来。$\\sum P_{ii}^n < \\infty$。

### 4.3 极限定理
*   **【定义】周期性 (Page 105):** 若从 $i$ 出发回到 $i$ 的步数只能是 $d$ 的倍数，则周期为 $d$。
*   **【定理 4.3.3】极限概率的存在性 (Page 108):**
*   对于不可约、非周期的常返链，极限概率 $\\pi_j = \\lim_{n \\to \\infty} P_{ij}^n$ 存在且独立于 $i$。
*   **【方程】平稳分布 (Page 109 - 4.3.3):**
*   $\\pi_j = \\sum_i \\pi_i P_{ij}$，且 $\\sum \\pi_j = 1$。
*   $\\pi_j$ 也是状态 $j$ 的长期由访比例，且 $\\pi_j = 1/\\mu_{jj}$ (平均返回时间的倒数)。

### 4.4 转移与赌徒破产问题
*   **【命题 4.4.1】 (Page 115):** 这一节主要讨论仅在暂态集合中停留的时间。
*   **【例 4.4 (A)】赌徒破产问题 (Page 116):**
*   利用差分方程求解在破产前达到财富 $N$ 的概率 $P_i = \\frac{1-(q/p)^i}{1-(q/p)^N}$。

### 4.5 分支过程
*   **【定义】 (Page 119):** 描述种群繁衍的模型。
*   **【灭绝概率】 (Page 120):** 灭绝概率 $\\pi$ 是方程 $\\pi = \\sum_{j=0}^{\\infty} P_j \\pi^j$ 的最小非负解。若均值 $\\mu \\le 1$，则 $\\pi=1$。

### 4.6 Markov 链的应用
*   这节通过算法模型（如 MCMC 的初级形式）展示应用。

### 4.7 时间可逆的 Markov 链
*   **【定义】时间可逆 (Page 127):**
*   若存在概率分布 $\\pi_i$ 满足 **细致平衡方程**：$\\pi_i P_{ij} = \\pi_j P_{ji}$，且 $\\sum \\pi_i = 1$，则该链是时间可逆的，且 $\\pi_i$ 为平稳分布。
*   **【典型例题】例 4.7 (B) Metropolis 算法 (Page 128):** 构造一个可逆 Markov 链来模拟任意分布。

### 4.8 半 Markov 过程 (Page 133)
*   **【定义】** 状态转移遵循 Markov 链，但在每个状态的停留时间服从依赖于当前状态和下一状态的分布。

---

# 第5章 连续时间的 Markov 链

### 5.2 连续时间 Markov 链
*   **【定义】 (Page 144):**
*   过程 $\\{X(t), t \\ge 0\\}$，在状态 $i$ 停留的时间服从参数为 $v_i$ 的指数分布，转移到 $j$ 的概率为 $P_{ij}$。
*   或者直接定义转移速率 $q_{ij} = v_i P_{ij}$。

### 5.3 生灭过程
*   **【定义】 (Page 145):**
*   状态只能从 $n$ 转移到 $n+1$ (出生速率 $\\lambda_n$) 或 $n-1$ (死亡速率 $\\mu_n$)。
*   **【例 5.3 (A)】 M/M/s 排队系统 (Page 146):**
*   典型的生灭过程，出生率为常数 $\\lambda$，死亡率依赖于服务台数量。

### 5.4 Kolmogorov 微分方程
*   **【定理 5.4.3】向后方程 (Backward Equation) (Page 150):**
*   $P'_{ij}(t) = \\sum_{k \\ne i} q_{ik} P_{kj}(t) - v_i P_{ij}(t)$。
*   **【定理 5.4.4】向前方程 (Forward Equation) (Page 151):**
*   $P'_{ij}(t) = \\sum_{k \\ne j} q_{kj} P_{ik}(t) - v_j P_{ij}(t)$。通常用于求解状态分布。

### 5.5 极限概率
*   **【平衡方程】 (Page 156 - 公式 5.5.3):**
*   对于生灭过程或一般连续 Markov 链，极限概率 $P_j$ 满足：
*   $\\text{离开速率} = \\text{进入速率}$
*   $v_j P_j = \\sum_k P_k q_{kj}$。
*   **【典型例题】例 5.5 (A) M/M/1 排队 (Page 158):** 推导 $P_n = (\\lambda/\\mu)^n (1-\\lambda/\\mu)$。

### 5.6 时间可逆性
*   **【定理 5.6.1】 (Page 161):**
*   连续时间链是时间可逆的，当且仅当 $\\pi_i q_{ij} = \\pi_j q_{ji}$。
*   **推论:** 所有的生灭过程都是时间可逆的。
*   **【例 5.6 (A)】 M/M/1 的可逆性 (Page 163):** 证明了 M/M/1 系统输出过程也是 Poisson 过程（Burke 定理）。

### 5.7 倒向链与排队网络 (Page 168)
*   介绍了 Jackson 网络等排队网络的乘积解形式。

---

# 第6章 鞅 (Martingales) - 仅 6.1 节

### 6.1 鞅
*   **【定义】鞅 (Page 184 - 公式 6.1.1):**
*   随机过程 $\\{Z_n, n \\ge 1\\}$ 称为鞅，若 $E[|Z_n|] < \\infty$，且对于一切 $n$，有：
*   $$E[Z_{n+1} | Z_1, \\dots, Z_n] = Z_n$$
*   **直观含义:** 公平赌博，基于当前信息，对未来的最佳预测就是当前值。
*   **【典型例题 1】零均值随机游动 (Page 184):**
*   若 $X_i$ 均值为 0，则 $Z_n = \\sum_{i=1}^n X_i$ 是鞅。
*   **【典型例题 2】乘积鞅 (Page 184):**
*   若 $X_i$ 独立且 $E[X_i]=1$，则 $Z_n = \\prod_{i=1}^n X_i$ 是鞅。
        `
    },  
    {
        id: 'transformer-attention-notes',
        title: '读懂 Transformer 的第一步：从 Attention 公式开始拆解',
        excerpt: 'Transformer 总被说成是大模型时代的地基，但第一次看 Attention 公式时很容易只记住 Q、K、V 三个字母。本文从直觉、矩阵形状和代码实现三个角度，记录我第一次真正读懂注意力机制的过程。',
        date: '2025-12-14',
        tags: ['Transformer', 'Attention', 'NLP', '论文精读'],
        image: 'images/transformer-attention-notes-cover.svg',
        readTime: '9 分钟阅读',
        category: '论文精读',
        type: 'html',
        content: `
            <h2>为什么 Attention 这么重要？</h2>
            <p>学深度学习时，总会在某个节点遇到 Transformer。无论是 ChatGPT、BERT、ViT，还是各种多模态模型，最后都会绕回那个看起来很简洁的公式：</p>
            <pre><code>Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V</code></pre>
            <p>这行公式第一次看非常像咒语：Q 是什么，K 是什么，为什么要除以根号 d，最后为什么又乘 V？如果只是背下来，其实很快就会忘掉。我这次的目标不是“能说出 Transformer 很强”，而是把这个公式拆到自己能用 NumPy 写出来。</p>

            <h2>先从直觉理解：在一堆信息里找重点</h2>
            <p>Attention 的核心想法可以粗暴理解成：当前这个 token 想知道“我应该重点看谁”。比如句子“我把书放进书包，因为它很重”里，“它”到底指书还是书包？模型需要根据上下文分配注意力权重。</p>
            <p>Query 可以看成“我想找什么”，Key 可以看成“我这里有什么特征”，Value 则是“如果你关注我，就从我这里拿走的信息”。Q 和 K 做点积，就是在算“需求”和“特征”有多匹配；softmax 把匹配分数变成概率；最后用这些概率去加权 V。</p>

            <h2>矩阵形状比公式更重要</h2>
            <p>我以前看公式总是卡住，后来发现最有效的方法是盯住 shape。假设一个句子有 6 个 token，每个 token 的向量维度是 64，那么输入矩阵可以记作：</p>
            <pre><code>X: [6, 64]
W_q, W_k, W_v: [64, 64]
Q = XW_q: [6, 64]
K = XW_k: [6, 64]
V = XW_v: [6, 64]</code></pre>
            <p>接下来 <code>QK^T</code> 的形状是 <code>[6, 6]</code>。这张 6×6 的表非常关键：第 i 行代表第 i 个 token 对所有 token 的关注程度。也就是说，Attention 并不是某种玄学，它首先是一张“token 之间互相关注的关系表”。</p>

            <h2>为什么要除以 sqrt(d_k)？</h2>
            <p>这个细节我卡过一会儿。直觉上，向量维度越大，点积的数值波动也会越大。如果不做缩放，softmax 前的分数可能特别极端，导致输出概率过早接近 0 或 1，梯度变得不好训练。</p>
            <p>除以 <code>sqrt(d_k)</code> 本质上是在稳定数值范围，让 softmax 不至于太“自信”。这和很多深度学习技巧的气质很像：不是改变表达能力，而是让训练更稳。</p>

            <h2>用 NumPy 写一个最小版 Self-Attention</h2>
            <p>理解 Attention 后，我试着写了一个最小版本。代码没有考虑 batch 和多头，只保留最核心的计算过程：</p>
            <pre><code class="language-python">import numpy as np

def softmax(x):
    x = x - np.max(x, axis=-1, keepdims=True)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

def self_attention(X, W_q, W_k, W_v):
    Q = X @ W_q
    K = X @ W_k
    V = X @ W_v
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    weights = softmax(scores)
    output = weights @ V
    return output, weights</code></pre>
            <p>写完之后再回头看公式，感觉就完全不一样了。公式不是在描述某个不可触碰的黑箱，而是在写一个非常具体的矩阵计算流程。</p>

            <h2>Multi-Head Attention 到底多了什么？</h2>
            <p>多头注意力并不是把 Attention 变复杂，而是让模型从多个角度看同一段文本。有的头可能关注语法关系，有的头可能关注指代关系，有的头可能关注局部相邻信息。</p>
            <p>从实现上看，就是把 hidden dimension 切成多个 head，每个 head 单独做一次 Attention，再拼接回来。它像是给模型配了多副不同焦距的眼镜，而不是只用一种相似度标准理解整句话。</p>

            <h2>这次学习留下的三个结论</h2>
            <ul>
                <li><strong>先看 shape，再看公式。</strong> 对深度学习模型来说，shape 经常比符号本身更能解释问题。</li>
                <li><strong>Q、K、V 不是神秘概念。</strong> 它们只是同一个输入经过三组不同线性变换得到的表示。</li>
                <li><strong>Attention 的本质是动态加权。</strong> 模型不是固定抽取特征，而是根据当前 token 动态决定看哪里。</li>
            </ul>
            <h2>实现时最容易踩的几个坑</h2>
            <p>真正写代码时，我发现 Attention 的难点不在公式，而在维度管理和 mask。训练语言模型时，当前位置不能看到未来 token，所以需要 causal mask；处理不同长度句子时，又需要 padding mask。两个 mask 的含义不同，但都会作用在 softmax 之前的 score 上。</p>
            <pre><code class="language-python"># mask 的常见做法：在 softmax 前把禁止关注的位置变成很小的数
scores = scores.masked_fill(mask == 0, -1e9)
weights = softmax(scores)</code></pre>
            <p>另一个坑是数值稳定。softmax 之前如果 score 太大，很容易出现溢出，所以实现 softmax 时通常会先减去最大值。很多框架帮我们做了这些细节，但自己写一遍后才知道“稳定训练”背后有很多小心思。</p>
            <h2>我会如何检查自己是否真的懂了？</h2>
            <p>我给自己设了三个检验标准：第一，能画出 Q、K、V 的 shape 流程；第二，能解释为什么输出是所有 value 的加权和；第三，能说清 mask 加在哪里以及为什么。只要其中任何一个说不清，就说明理解还停留在背公式阶段。</p>
            <p>下一步我打算继续拆 Transformer 的 Feed Forward、残差连接和 LayerNorm。真正读懂一个模型，大概就是把每一块“看起来理所当然”的模块都重新问一遍为什么。</p>
        `
    },
    {
        id: 'training-debugging-diary',
        title: '模型训练不动时，我通常按这个清单排查',
        excerpt: '训练深度学习模型最痛苦的时刻，不是报错，而是 loss 一动不动。本文整理了我在 PyTorch 训练中常用的排查顺序：数据、标签、学习率、梯度、模型容量和验证集。',
        date: '2025-12-29',
        tags: ['PyTorch', '训练技巧', 'Debug', '深度学习'],
        image: 'images/training-debugging-diary-cover.svg',
        readTime: '8 分钟阅读',
        category: '工程笔记',
        type: 'html',
        content: `
            <h2>最可怕的 bug：它不报错</h2>
            <p>写深度学习代码有一种很折磨人的情况：程序能跑，显存正常占用，进度条也很优雅地往前走，但 loss 像被钉住了一样，准确率也像随机猜测。它不报错，所以你甚至不知道该骂谁。</p>
            <p>踩过几次坑之后，我逐渐整理出一套自己的排查顺序。它不保证能解决所有问题，但至少能让我不要在凌晨两点盯着 loss 曲线开始怀疑人生。</p>

            <h2>第一步：先看数据，不要先怪模型</h2>
            <p>很多训练问题最后都不是模型问题，而是数据问题。我的第一步永远是把一个 batch 取出来，直接打印或可视化。</p>
            <pre><code class="language-python">images, labels = next(iter(train_loader))
print(images.shape, labels.shape)
print(images.min().item(), images.max().item())
print(labels[:16])</code></pre>
            <p>如果是图像任务，我会把图片画出来，确认增强没有把图弄坏；如果是文本任务，我会把 token decode 回文本，确认分词和截断没有离谱。不要小看这一步，我见过标签错位、图片全黑、归一化做了两次、类别编号从 1 开始但 loss 期望从 0 开始等各种问题。</p>

            <h2>第二步：做一个 overfit 小实验</h2>
            <p>这是我觉得最有用的检查方法：拿 16 或 32 条样本，让模型强行记住它们。如果模型连这点数据都拟合不了，那说明训练链路一定有问题。</p>
            <pre><code class="language-python">small_dataset = torch.utils.data.Subset(train_dataset, range(32))
small_loader = DataLoader(small_dataset, batch_size=32, shuffle=True)</code></pre>
            <p>正常情况下，一个容量足够的模型应该能很快把这 32 条样本的 loss 打到很低。如果做不到，我就会继续检查 loss、optimizer、梯度和标签。</p>

            <h2>第三步：检查 loss 和输出是否匹配</h2>
            <p>PyTorch 里有些 loss 的输入要求非常具体。比如 <code>nn.CrossEntropyLoss</code> 期待的是未经过 softmax 的 logits，而不是概率。如果你手动做了 softmax，再送进 CrossEntropyLoss，训练可能就会变得很怪。</p>
            <pre><code class="language-python"># 正确：model 输出 logits
logits = model(x)
loss = nn.CrossEntropyLoss()(logits, y)

# 不推荐：先 softmax 再 CrossEntropyLoss
probs = torch.softmax(logits, dim=1)
loss = nn.CrossEntropyLoss()(probs, y)</code></pre>
            <p>二分类、多标签分类、回归任务也各有不同的 loss 搭配。这里一旦错了，模型可能还能跑，但学到的东西完全不对。</p>

            <h2>第四步：观察梯度，而不是只看 loss</h2>
            <p>如果 loss 不动，我会打印几个关键层的梯度范数。梯度全是 0，可能是激活饱和、detach 断图、学习率太小；梯度特别大，可能是学习率太高或数据尺度有问题。</p>
            <pre><code class="language-python">for name, param in model.named_parameters():
    if param.grad is not None:
        print(name, param.grad.norm().item())</code></pre>
            <p>这一步能直接告诉我：模型到底有没有收到学习信号。很多时候我们以为模型在训练，其实梯度根本没传到某些层。</p>

            <h2>第五步：学习率是第一嫌疑人</h2>
            <p>学习率太大，loss 会震荡甚至爆炸；学习率太小，loss 像睡着一样。我现在一般会先尝试 <code>1e-3</code>、<code>3e-4</code>、<code>1e-4</code> 三档，再根据曲线微调。</p>
            <p>如果训练前期完全不下降，我会先把学习率调大一点试试；如果 loss 上下乱跳，就降学习率。不要在模型结构上急着动刀，学习率往往比想象中更关键。</p>

            <h2>第六步：区分“学不会”和“泛化差”</h2>
            <p>训练集 loss 下不去，说明优化或模型容量有问题；训练集很好但验证集差，说明过拟合或数据分布有问题。这两个问题的解决方向完全不同。</p>
            <ul>
                <li>训练集也很差：检查数据、loss、学习率、模型容量。</li>
                <li>训练集很好，验证集差：加数据增强、正则化、dropout，或者检查验证集分布。</li>
                <li>训练和验证都忽上忽下：检查 batch size、学习率、随机种子和数据采样。</li>
            </ul>
            <h2>我现在会记录哪些训练信息？</h2>
            <p>以前我只记得“这个模型好像跑到 80% 了”，过几天再回来完全不知道当时用了什么参数。现在我会强迫自己至少记录这些内容：数据版本、模型结构、学习率、batch size、随机种子、训练轮数、最好的验证指标和失败备注。</p>
            <pre><code>run_name: cnn_cifar10_aug_v2
lr: 3e-4
batch_size: 128
seed: 42
best_val_acc: 78.4
note: color jitter helps, random crop too strong hurts</code></pre>
            <p>这件事看起来很笨，但它能避免大量重复试错。训练模型最怕的是“凭感觉调参”，因为感觉不会自动保存，也没法复盘。</p>
            <h2>关于数据增强的一点经验</h2>
            <p>数据增强不是越强越好。比如图像分类里随机裁剪、颜色扰动、翻转都很常见，但如果增强破坏了类别本身的关键特征，模型会学得更乱。我的做法是每加一种增强，都先可视化几十张增强后的图片，确认人眼还能判断标签。</p>

            <h2>我的最终排查清单</h2>
            <ol>
                <li>可视化一个 batch，确认输入和标签正确。</li>
                <li>用极小数据集做 overfit 测试。</li>
                <li>确认 loss 输入格式与任务匹配。</li>
                <li>打印梯度范数，确认反向传播没有断。</li>
                <li>扫几档学习率，看 loss 曲线是否有响应。</li>
                <li>分别观察训练集和验证集，判断是优化问题还是泛化问题。</li>
            </ol>
            <p>训练模型像排水管堵塞：不要一上来就拆整栋楼，先沿着水流一段段看哪里堵了。把这个过程清单化之后，debug 的痛苦会少很多。</p>
        `
    },
    {
        id: 'rag-first-principles',
        title: 'RAG 到底在解决什么问题？从搜索增强生成开始理解大模型应用',
        excerpt: 'RAG 不是简单地“把文档塞给大模型”，而是一套把检索、切分、向量化、排序和生成连接起来的工程流程。本文记录我从零理解 RAG 的过程。',
        date: '2026-01-12',
        tags: ['大模型', 'RAG', '向量数据库', '信息检索'],
        image: 'images/rag-first-principles-cover.svg',
        readTime: '11 分钟阅读',
        category: '大模型应用',
        type: 'html',
        content: `
            <h2>RAG 不是大模型的外挂记忆</h2>
            <p>刚听到 RAG（Retrieval-Augmented Generation）时，我以为它就是“把资料丢给大模型，让它照着回答”。真正做了一点实验后才发现，这个理解太粗糙了。</p>
            <p>RAG 更像是一套工程系统：先从知识库里找到相关信息，再把这些信息组织成上下文，最后交给大模型生成答案。它解决的核心问题不是“让模型更聪明”，而是让模型在回答时有可靠、可更新、可追溯的外部依据。</p>

            <h2>为什么不能直接微调？</h2>
            <p>如果只是让模型记住一些固定知识，微调看起来也能做到。但现实里知识经常变化，比如课程资料、项目文档、API 文档、实验记录。如果每次资料更新都重新训练模型，成本太高，也不灵活。</p>
            <p>RAG 的优势在于知识库可以独立更新。模型本身负责理解和表达，知识库负责提供事实来源。这种分工非常适合个人知识库、课程问答、企业文档助手等场景。</p>

            <h2>一个最小 RAG 系统包含什么？</h2>
            <p>我把 RAG 拆成五个步骤：</p>
            <ol>
                <li><strong>文档加载：</strong> 读取 markdown、PDF、网页或代码文件。</li>
                <li><strong>文本切分：</strong> 把长文档切成适合检索的小块。</li>
                <li><strong>向量化：</strong> 用 embedding 模型把文本块转成向量。</li>
                <li><strong>相似度检索：</strong> 根据用户问题找到最相关的若干文本块。</li>
                <li><strong>生成回答：</strong> 把检索结果和问题一起交给大模型。</li>
            </ol>
            <p>其中最容易被忽略的是第二步：切分。切得太碎，信息不完整；切得太长，检索不精准，而且浪费上下文窗口。</p>

            <h2>文本切分比想象中更重要</h2>
            <p>我一开始按固定长度切，比如每 500 个字符一块。这样做简单，但经常把一个完整概念切断。后来我更倾向按标题、段落、代码块边界切分，再加一点 overlap。</p>
            <pre><code class="language-python"># 伪代码：更偏向语义边界的切分思路
chunks = []
for section in split_by_markdown_headings(document):
    for block in split_by_paragraphs(section):
        chunks.append(block)</code></pre>
            <p>好的 chunk 应该像一张自包含的小卡片：即使单独拿出来，也能让模型知道它在讲什么。</p>

            <h2>向量检索不是关键词搜索的替代品</h2>
            <p>Embedding 检索擅长语义相似，但并不总是比关键词搜索强。比如查函数名、参数名、论文里的专有缩写时，关键词反而更稳。很多成熟系统会把向量检索和关键词检索混合起来，再做 rerank。</p>
            <p>这让我意识到：RAG 不是一个单一算法，而是一组信息检索技术和生成模型的组合。它更像搜索引擎和聊天机器人的混血。</p>

            <h2>RAG 最常见的失败模式</h2>
            <ul>
                <li><strong>检索不到：</strong> 知识库里有答案，但 embedding 没把相关 chunk 找出来。</li>
                <li><strong>检索太多：</strong> 上下文里塞了很多弱相关内容，模型反而被干扰。</li>
                <li><strong>引用不准：</strong> 模型生成时混合了多个来源，导致看起来有依据但其实张冠李戴。</li>
                <li><strong>问题太宽泛：</strong> 用户问得太大，检索结果分散，回答也会变虚。</li>
            </ul>
            <h2>一个更完整的 RAG 设计草图</h2>
            <p>如果把 RAG 真正做成一个可用的小系统，我会把它拆成离线和在线两条链路。离线链路负责清洗资料、切分 chunk、生成 embedding、写入索引；在线链路负责理解问题、检索、重排、拼上下文、生成答案和返回引用。</p>
            <pre><code>offline: documents -> clean -> chunk -> embed -> vector index
online: question -> retrieve -> rerank -> prompt -> answer + citations</code></pre>
            <p>这样拆分以后，问题也更容易定位。回答不好时，可以分别检查：是不是文档没进库，是不是 chunk 切坏了，是不是检索没召回，是不是 prompt 没约束，还是模型生成时没有忠实引用。</p>
            <h2>引用比答案更重要</h2>
            <p>学习型 RAG 里，我越来越觉得引用比漂亮回答更重要。如果一个回答不能指出依据来自哪段笔记，我就很难信任它。哪怕回答稍微笨一点，只要能把来源列出来，用户也可以自己判断。</p>
            <p>因此我会让系统输出“答案 + 依据片段 + 不确定性说明”。这比单纯追求流畅自然更适合学习场景。</p>

            <h2>我对 RAG 的新理解</h2>
            <p>RAG 的难点不在“调用一个向量数据库”，而在如何把知识整理成可检索、可组合、可验证的形态。它需要一点 NLP，一点搜索系统，一点后端工程，还有很多对业务资料的理解。</p>
            <p>如果以后我要做自己的学习助手，我会先从课程笔记和博客文章开始建知识库。因为这些内容结构清晰、更新频率适中，而且回答错了也容易验证。等这个小系统跑顺了，再考虑接入 PDF、代码仓库和实验记录。</p>
        `
    },
    {
        id: 'linux-remote-training-notes',
        title: '第一次认真用 Linux 跑训练：服务器环境生存笔记',
        excerpt: '从本地 Jupyter 到远程服务器，中间隔着 SSH、conda、tmux、CUDA、日志和显存管理。本文整理我第一次认真在 Linux 服务器上跑模型训练时踩过的坑。',
        date: '2026-01-28',
        tags: ['Linux', '深度学习', '服务器', '工程实践'],
        image: 'images/linux-remote-training-notes-cover.svg',
        readTime: '9 分钟阅读',
        category: '工程笔记',
        type: 'html',
        content: `
            <h2>从本地到服务器，不只是换一台电脑</h2>
            <p>以前在自己电脑上跑实验，最常见的流程是打开 IDE，点运行，等结果。真正开始用服务器训练模型后，我才发现深度学习工程里有一大块技能叫“让实验稳定地在远程机器上活下来”。</p>
            <p>服务器不会因为你关掉电脑而停止，但如果不会用 tmux、不会看日志、不会管理环境，那它也不会自动替你变得可靠。</p>

            <h2>SSH：进入服务器的第一扇门</h2>
            <p>最基础的连接命令是：</p>
            <pre><code class="language-bash">ssh username@server_ip</code></pre>
            <p>但频繁输入 IP 和用户名很麻烦，所以我把配置写进了 <code>~/.ssh/config</code>：</p>
            <pre><code class="language-bash">Host ai-server
    HostName 192.168.1.100
    User wenky
    Port 22</code></pre>
            <p>之后只需要 <code>ssh ai-server</code> 就能连接。这个小配置非常提升幸福感。</p>

            <h2>tmux：让训练不要死在断网里</h2>
            <p>如果直接在 SSH 会话里跑训练，一旦网络断开，进程可能就没了。tmux 的作用是创建一个持久会话，让训练在后台继续跑。</p>
            <pre><code class="language-bash">tmux new -s train
python train.py

# 退出但不终止会话：Ctrl-b 然后按 d
tmux attach -t train</code></pre>
            <p>这大概是我学服务器训练时最值得优先掌握的工具。它不复杂，但能救命。</p>

            <h2>环境管理：不要污染 base</h2>
            <p>我一开始喜欢直接在 base 环境里装包，后来很快就乱了。现在的习惯是每个项目单独建环境：</p>
            <pre><code class="language-bash">conda create -n cv-exp python=3.10
conda activate cv-exp
pip install torch torchvision</code></pre>
            <p>如果项目要长期维护，就把依赖写进 <code>requirements.txt</code> 或环境文件里。否则过两周回来，自己都不知道当时装了什么。</p>

            <h2>CUDA 和 PyTorch 版本要对齐</h2>
            <p>深度学习环境最容易炸的地方就是 CUDA。我的经验是不要凭感觉安装，先确认驱动和 CUDA 情况：</p>
            <pre><code class="language-bash">nvidia-smi
python -c "import torch; print(torch.cuda.is_available())"</code></pre>
            <p>如果 <code>torch.cuda.is_available()</code> 是 False，不要急着改代码，先看 PyTorch 安装版本、CUDA runtime 和显卡驱动是否匹配。</p>

            <h2>日志：训练过程要可回放</h2>
            <p>远程训练不能只靠终端输出。我现在至少会把关键日志写到文件：</p>
            <pre><code class="language-bash">python train.py 2>&1 | tee logs/train_20260128.log</code></pre>
            <p>这样即使终端滚过去了，也能回头看 loss、准确率、报错和超参数。对于长时间训练来说，日志就是实验的记忆。</p>

            <h2>显存管理：先看谁占了 GPU</h2>
            <p>服务器经常多人共用，训练前先看显卡状态是一种礼貌：</p>
            <pre><code class="language-bash">nvidia-smi</code></pre>
            <p>如果显存被占满，不要随便 kill 别人的进程。确认是自己的残留进程后，再处理。很多时候显存没释放，是因为之前的 notebook 或训练进程还挂着。</p>
            <h2>文件同步和结果备份</h2>
            <p>另一个容易忽视的问题是文件同步。代码可以用 Git 管，但数据、日志、模型权重通常不会直接提交。我现在会把目录分清楚：<code>src/</code> 放代码，<code>configs/</code> 放配置，<code>logs/</code> 放日志，<code>checkpoints/</code> 放模型，避免训练几次后项目根目录变成垃圾场。</p>
            <pre><code class="language-bash">project/
  src/
  configs/
  logs/
  checkpoints/
  data/</code></pre>
            <p>重要的实验结果要及时下载或同步。服务器不是永远可靠的，队列任务、磁盘清理、误删文件都有可能发生。工程上的“安全感”，很多时候来自朴素的备份习惯。</p>
            <h2>配置文件比命令行参数更适合复现实验</h2>
            <p>当参数越来越多时，一长串命令很难复现。我更喜欢把参数写成 yaml 或 json，再让训练脚本读取配置。这样每次实验都能保存一份完整配置，后面看到某个 checkpoint 时，也知道它是怎么训练出来的。</p>

            <h2>我的服务器训练最小工作流</h2>
            <ol>
                <li>SSH 登录服务器。</li>
                <li>进入项目目录，激活 conda 环境。</li>
                <li>用 tmux 创建训练会话。</li>
                <li>检查 GPU 状态。</li>
                <li>运行训练，并把日志写入文件。</li>
                <li>定期查看日志和显存，不直接盯终端发呆。</li>
            </ol>
            <p>服务器环境一开始很像黑盒，但把这些工具串起来之后，它就变成了一个稳定的实验平台。工程能力很多时候不是写更复杂的模型，而是让模型在正确的环境里可靠地跑完。</p>
        `
    },
    {
        id: 'resnet-skip-connection-notes',
        title: '为什么 ResNet 能训练得更深？我对残差连接的理解',
        excerpt: '深层网络并不是简单地“层数越多越强”。ResNet 的残差连接解决了深层网络退化问题，也给后来的大模型结构留下了很深的影响。',
        date: '2026-02-16',
        tags: ['ResNet', 'CNN', '计算机视觉', '深度学习'],
        image: 'images/resnet-skip-connection-notes-cover.svg',
        readTime: '10 分钟阅读',
        category: '论文精读',
        type: 'html',
        content: `
            <h2>层数越深，模型一定越好吗？</h2>
            <p>刚学神经网络时，我很自然地以为：模型层数越多，表达能力越强，效果也应该越好。但 ResNet 论文告诉我，事情没有这么简单。</p>
            <p>深层网络会遇到退化问题：不是过拟合，而是训练集误差本身变高。也就是说，模型明明更复杂，却连训练数据都拟合得更差。这说明问题出在优化过程，而不是模型容量不够。</p>

            <h2>残差连接的核心想法</h2>
            <p>普通网络学习的是一个映射 <code>H(x)</code>。ResNet 改成让网络学习残差 <code>F(x) = H(x) - x</code>，最后输出：</p>
            <pre><code>y = F(x) + x</code></pre>
            <p>如果某几层暂时学不到有用东西，最差也可以让 <code>F(x)</code> 接近 0，这样输出就接近输入。换句话说，残差连接给深层网络提供了一条“保底通道”。</p>

            <h2>这条捷径为什么有用？</h2>
            <p>我对 skip connection 的理解有三层：</p>
            <ol>
                <li><strong>信息更容易流动。</strong> 输入可以直接跨层传到后面，不必每一层都重新编码。</li>
                <li><strong>梯度更容易回传。</strong> 反向传播时，梯度也有更短的路径传回浅层。</li>
                <li><strong>优化目标更温和。</strong> 学一个“修改量”有时比学完整映射更容易。</li>
            </ol>
            <p>这让我想起写代码时的补丁：与其重写整个系统，不如在已有结果上学习一个增量修改。</p>

            <h2>一个最小残差块</h2>
            <p>用 PyTorch 写一个非常简化的残差块，大概是这样：</p>
            <pre><code class="language-python">class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(channels, channels, 3, padding=1),
            nn.BatchNorm2d(channels),
            nn.ReLU(),
            nn.Conv2d(channels, channels, 3, padding=1),
            nn.BatchNorm2d(channels),
        )
        self.relu = nn.ReLU()

    def forward(self, x):
        return self.relu(self.conv(x) + x)</code></pre>
            <p>真实 ResNet 会处理通道数变化、下采样、瓶颈结构等细节，但核心精神就是这句 <code>self.conv(x) + x</code>。</p>

            <h2>残差思想不只属于 CNN</h2>
            <p>后来我发现 Transformer 里也大量使用残差连接。Self-Attention 后面加 residual，Feed Forward 后面也加 residual。它已经变成深度网络的基础设计语言。</p>
            <p>这说明残差连接解决的不是某个视觉任务的小问题，而是深层模型训练的普遍问题：如何让信息和梯度穿过很深的网络。</p>
            <h2>BatchNorm 和残差块的配合</h2>
            <p>读 ResNet 时我还注意到一个细节：残差块里经常搭配 BatchNorm。BatchNorm 可以稳定每层输入分布，让训练更容易；残差连接提供更顺畅的信息路径。两者一起出现，不是偶然。</p>
            <p>后来很多新结构会把 BatchNorm 换成 LayerNorm、GroupNorm，或者改变归一化位置，但“归一化 + 残差”这个组合一直保留下来。这说明现代深度网络不仅靠表达能力，也靠一整套让优化变稳定的结构设计。</p>
            <h2>如果要复现 ResNet，我会先做什么？</h2>
            <p>我不会一上来复现 ResNet-50，而会先在 CIFAR-10 上写一个小型 ResNet：少量残差块、固定通道数、清晰的训练脚本。目标不是刷榜，而是确认残差网络确实比同等深度的普通 CNN 更容易训练。</p>
            <p>这个实验如果能跑通，就可以进一步观察层数、学习率、数据增强对结果的影响。比起直接复制大型代码仓库，这种小复现更能建立直觉。</p>

            <h2>读完后的收获</h2>
            <p>ResNet 给我的启发是：深度学习里的很多突破并不是“堆更多计算”，而是改变优化路径。残差连接看起来只是加了一条线，但它让训练非常深的网络变得现实。</p>
            <p>以后看模型结构时，我会更关注这些看似普通的连接方式。很多时候，真正决定模型能不能训练起来的，正是这些结构上的细节。</p>
        `
    },
    {
        id: 'paper-reading-method',
        title: '我现在如何读一篇 AI 论文：三遍阅读法和复现清单',
        excerpt: 'AI 论文第一次读经常像撞墙。后来我发现，读论文不能从头到尾硬啃，而应该分层阅读：先抓问题，再看方法，最后才进入公式和实验细节。',
        date: '2026-03-08',
        tags: ['论文阅读', '学习方法', 'AI', '科研入门'],
        image: 'images/paper-reading-method-cover.svg',
        readTime: '8 分钟阅读',
        category: '学习方法',
        type: 'html',
        content: `
            <h2>读论文不是逐字翻译</h2>
            <p>第一次读 AI 论文时，我总想从 abstract 开始一路读到 conclusion，遇到不懂的公式就停下来查。结果经常读了两页就累了，而且读完也说不清论文到底贡献在哪里。</p>
            <p>后来我意识到，论文不是教材。教材按学习顺序写，论文按说服读者的结构写。读论文更像拆一个技术方案，而不是背一篇英文文章。</p>

            <h2>第一遍：只回答“它想解决什么问题”</h2>
            <p>第一遍我只看标题、摘要、引言、图 1 和结论。目标不是理解所有细节，而是回答几个问题：</p>
            <ul>
                <li>这篇论文要解决什么任务？</li>
                <li>之前的方法有什么痛点？</li>
                <li>作者声称自己的核心贡献是什么？</li>
                <li>实验结果主要证明了什么？</li>
            </ul>
            <p>如果第一遍结束后我还说不出这四点，说明我不该急着看公式，而应该回去重读 introduction。</p>

            <h2>第二遍：画出方法的数据流</h2>
            <p>第二遍重点看 method 部分，但我不会一上来抄公式。我会先画数据流：输入是什么，中间经过哪些模块，输出是什么，loss 怎么定义。</p>
            <p>比如读一个视觉模型，我会写成：</p>
            <pre><code>image -> backbone -> feature map -> attention module -> classifier -> loss</code></pre>
            <p>这样做的好处是把论文从“自然语言描述”变成“可实现结构”。只要数据流清楚，公式就有了落脚点。</p>

            <h2>第三遍：只精读关键公式</h2>
            <p>不是所有公式都同等重要。有些公式只是符号定义，有些才是方法核心。第三遍我会挑出最关键的 2 到 4 个公式，逐项解释每个符号的 shape 和含义。</p>
            <p>如果一个公式我能写出伪代码，基本就算真的理解了一半：</p>
            <pre><code class="language-python"># 论文公式 -> 伪代码
features = backbone(images)
weights = attention(features)
output = classifier(features * weights)
loss = criterion(output, labels)</code></pre>

            <h2>实验部分看什么？</h2>
            <p>实验表格很多，但我现在重点看三类信息：</p>
            <ol>
                <li><strong>主结果：</strong> 是否真的比 baseline 好，提升幅度有多大。</li>
                <li><strong>消融实验：</strong> 哪个模块贡献最大，去掉后会怎样。</li>
                <li><strong>失败或限制：</strong> 哪些场景效果不明显，作者有没有诚实讨论。</li>
            </ol>
            <p>如果一篇论文只有主结果，没有消融，我会对它的结论更谨慎。因为不知道到底是哪部分带来了提升。</p>

            <h2>复现前的清单</h2>
            <p>如果我要尝试复现，会先列一个最小清单：</p>
            <ul>
                <li>数据集是否能拿到？预处理是否明确？</li>
                <li>模型结构有没有关键超参数？</li>
                <li>训练轮数、学习率、batch size 是否可查？</li>
                <li>评价指标是否和论文一致？</li>
                <li>有没有官方代码或第三方实现可以对照？</li>
            </ul>
            <p>复现最怕的是“看起来都写了，关键细节没写”。提前列清单可以避免做到一半才发现缺失条件。</p>
            <h2>我会怎样做论文笔记？</h2>
            <p>现在我不再把论文笔记写成大段翻译，而会写成固定模板：背景、问题、方法、关键公式、实验结论、我不理解的点、可以借鉴的想法。这个模板能迫使我主动加工信息，而不是把论文内容搬运一遍。</p>
            <pre><code>Paper Note
- Problem:
- Core idea:
- Method flow:
- Key equation:
- Strong evidence:
- Weakness:
- What I can reuse:</code></pre>
            <p>其中“我不理解的点”很重要。读论文不需要假装自己全懂，把疑问留下来，后面学到相关知识时才能接上。</p>
            <h2>读论文也要建立索引</h2>
            <p>如果读过的论文没有索引，很快就会变成“好像看过”。我会给每篇论文打标签，比如 <code>attention</code>、<code>efficient-training</code>、<code>vision-backbone</code>。以后做项目时，可以按问题反查论文，而不是靠记忆硬找。</p>

            <h2>读论文最后要产出什么？</h2>
            <p>我现在读完一篇论文，会尽量留下三个产物：</p>
            <ol>
                <li>一段 200 字以内的总结。</li>
                <li>一张方法流程图或伪代码。</li>
                <li>一个“我能从这篇论文借走什么”的想法。</li>
            </ol>
            <p>读论文不是为了收藏 PDF，而是为了把别人的思路变成自己工具箱里的一件工具。能不能复述、能不能实现、能不能迁移，才是判断有没有读懂的标准。</p>
        `
    },
    {
        id: 'lora-finetuning-first-look',
        title: '第一次理解 LoRA：为什么微调大模型不一定要改所有参数？',
        excerpt: '全量微调听起来很直接，但代价太高。LoRA 的思路是冻结原模型，只训练低秩适配矩阵，用很少的参数让模型学会新任务。本文记录我第一次读懂 LoRA 的过程。',
        date: '2026-03-27',
        tags: ['大模型', 'LoRA', '微调', '深度学习'],
        image: 'images/lora-finetuning-first-look-cover.svg',
        readTime: '10 分钟阅读',
        category: '大模型学习',
        type: 'html',
        content: `
            <h2>为什么需要参数高效微调？</h2>
            <p>刚开始接触大模型微调时，我的第一反应很朴素：既然模型要适应新任务，那就继续训练它的全部参数。这个想法在小模型上很自然，但到了大模型时代就变得昂贵了。</p>
            <p>一个几十亿参数的模型，如果全量微调，不仅显存压力巨大，还需要保存一整份新的模型权重。对于个人学习和中小型项目来说，这几乎不可持续。于是就有了参数高效微调（PEFT）的思路：不要动所有参数，只在关键位置加少量可训练参数。</p>

            <h2>LoRA 的核心直觉</h2>
            <p>LoRA（Low-Rank Adaptation）的核心想法可以用一句话概括：<strong>冻结原来的大矩阵，只学习一个低秩的更新量。</strong></p>
            <p>假设某一层原本有一个权重矩阵 <code>W</code>。全量微调会直接更新 <code>W</code>，而 LoRA 认为我们可以把更新量写成两个小矩阵的乘积：</p>
            <pre><code>W' = W + BA</code></pre>
            <p>其中 <code>A</code> 和 <code>B</code> 的秩很低，参数量远小于原始矩阵。训练时 <code>W</code> 不动，只训练 <code>A</code> 和 <code>B</code>。这就像不给整栋楼重建结构，只在关键位置加一些可调节的支架。</p>

            <h2>为什么低秩更新可能够用？</h2>
            <p>这点我一开始也觉得奇怪：这么少的参数，真的能让模型适应新任务吗？后来我的理解是，大模型原本已经学到了非常丰富的通用能力，微调很多时候不是从零学习，而是把已有能力重新组合、偏向某个任务分布。</p>
            <p>如果任务不需要彻底改变模型的世界知识，只需要调整表达习惯、输出格式或某类领域模式，那么一个低维的更新方向可能已经足够。</p>

            <h2>LoRA 通常加在哪里？</h2>
            <p>在 Transformer 里，LoRA 常见地加在 Attention 的线性层上，比如 <code>q_proj</code>、<code>v_proj</code>，有时也会加到 <code>k_proj</code>、<code>o_proj</code> 或 MLP 层。不同任务和模型会有不同选择。</p>
            <p>一个简化版的线性层 LoRA 可以这样理解：</p>
            <pre><code class="language-python">class LoRALinear(nn.Module):
    def __init__(self, in_features, out_features, rank):
        super().__init__()
        self.weight = nn.Parameter(torch.randn(out_features, in_features))
        self.weight.requires_grad = False

        self.A = nn.Parameter(torch.randn(rank, in_features) * 0.01)
        self.B = nn.Parameter(torch.zeros(out_features, rank))

    def forward(self, x):
        base = x @ self.weight.T
        delta = x @ self.A.T @ self.B.T
        return base + delta</code></pre>
            <p>真实实现还会有 scaling、dropout、merge 权重等细节，但核心就是这条额外的低秩分支。</p>

            <h2>LoRA 的优点和限制</h2>
            <ul>
                <li><strong>显存友好：</strong> 需要训练的参数少，优化器状态也少。</li>
                <li><strong>易于保存：</strong> 可以只保存 adapter，不必保存完整模型。</li>
                <li><strong>方便切换：</strong> 同一个底座模型可以挂不同任务的 LoRA。</li>
                <li><strong>不是万能：</strong> 如果任务和底座模型能力差距太大，LoRA 也救不了。</li>
            </ul>
            <h2>rank、alpha 和数据质量</h2>
            <p>LoRA 里 rank 是一个很关键的超参数。rank 太小，表达能力可能不够；rank 太大，训练参数变多，也更容易过拟合。对于个人实验，我会先从 8 或 16 这种保守值开始，再看验证集表现。</p>
            <p>另一个常见参数是 alpha，它决定 LoRA 分支的缩放强度。我的理解是：rank 决定这条分支能表达多少变化，alpha 决定这个变化在输出里有多大声。两者都不应该脱离数据质量讨论。数据格式混乱、答案风格不统一时，调再多参数也只是让模型更努力地学习噪声。</p>
            <h2>我会如何设计一次 LoRA 小实验？</h2>
            <p>如果要真正跑一次，我会选一个小任务，比如“把课程笔记整理成问答格式”。训练集控制在几百到一两千条，先保证样例质量，再观察训练 loss 和验证回答。重点不是追求模型变得无所不能，而是看它是否稳定学会了特定输出格式和领域表达。</p>

            <h2>我的理解小结</h2>
            <p>LoRA 给我的启发是：微调不一定意味着“重写模型”，也可以是“给模型加一个可学习的偏移”。这和残差连接、adapter、prompt tuning 等思路有某种相似气质：尽量保留已有能力，只学习任务所需的增量。</p>
            <p>下一步如果有机会，我想用一个小的开源模型做一次 LoRA 指令微调，重点观察训练数据格式、rank 选择和过拟合情况。理解原理只是第一步，真正跑通一次才算把知识落到手上。</p>
        `
    },
    {
        id: 'llm-evaluation-notes',
        title: '大模型评测不只是看回答顺不顺：我整理的一套小型评测清单',
        excerpt: '做大模型应用时，最容易被忽略的是评测。一个回答看起来很自然，不代表它事实正确、格式稳定、边界可靠。本文整理我现在理解的大模型应用评测维度。',
        date: '2026-04-13',
        tags: ['大模型', '评测', 'Prompt', '工程实践'],
        image: 'images/llm-evaluation-notes-cover.svg',
        readTime: '9 分钟阅读',
        category: '大模型应用',
        type: 'html',
        content: `
            <h2>“看起来不错”不是评测</h2>
            <p>刚做大模型应用时，我很容易被流畅的回答骗到。模型说得很自然，语气也很自信，于是我下意识觉得结果不错。但后来发现，流畅和正确是两回事，甚至有时候流畅会让错误更难被发现。</p>
            <p>如果只是随便问几个问题、肉眼感觉还行，就把系统交出去使用，那风险其实很大。尤其是搜索、问答、代码生成、学习助手这类场景，错误答案可能会直接误导用户。</p>

            <h2>我把评测拆成五个维度</h2>
            <p>现在我会把大模型应用评测拆成几个更具体的问题：</p>
            <ol>
                <li><strong>事实正确性：</strong> 答案是否符合资料或真实知识。</li>
                <li><strong>指令遵循：</strong> 是否按要求的格式、语言和范围回答。</li>
                <li><strong>稳定性：</strong> 同类问题多问几次，输出是否大体一致。</li>
                <li><strong>边界处理：</strong> 不知道时能否承认不知道，而不是编造。</li>
                <li><strong>用户体验：</strong> 回答是否清晰、简洁、可执行。</li>
            </ol>
            <p>这五个维度分开看，比笼统地说“效果好不好”更容易定位问题。</p>

            <h2>准备一组固定测试题</h2>
            <p>评测最重要的是可重复。我会先准备一组固定问题，每次改 prompt、换模型或改检索策略后都跑一遍。比如 RAG 系统可以准备：</p>
            <ul>
                <li>答案明确存在于文档中的问题。</li>
                <li>需要综合两个段落才能回答的问题。</li>
                <li>文档里没有答案的问题。</li>
                <li>容易被相似概念干扰的问题。</li>
                <li>要求固定格式输出的问题。</li>
            </ul>
            <p>这些问题不需要一开始很多，十几条高质量样例就能暴露不少问题。</p>

            <h2>不要只看平均分</h2>
            <p>如果把所有问题打一个平均分，很容易掩盖关键失败。比如一个学习助手 90% 问题都答得不错，但遇到“不知道”的问题总是胡编，这在真实使用里就很危险。</p>
            <p>所以我更喜欢记录失败类型，而不是只记录分数：</p>
            <pre><code>case_id: rag_007
question: 这份资料里有没有提到 LoRA 的 rank 怎么选？
expected: 资料未提到，应说明无法从资料判断
actual: 建议 rank=8，因为通常效果较好
failure_type: unsupported_claim</code></pre>
            <p>这种记录方式可以直接反推改进方向：是 prompt 要强调引用依据，还是检索结果不够，还是模型本身太喜欢补全。</p>

            <h2>什么时候用模型当裁判？</h2>
            <p>LLM-as-a-judge 很方便，但我现在会谨慎使用。它适合做初筛，比如判断回答是否遵循格式、是否覆盖要点；但对于事实正确性，最好还是有标准答案或人工抽查。</p>
            <p>如果必须用模型裁判，我会让它输出结构化结果，并要求引用具体错误点，而不是只给一个分数。</p>
            <h2>评测集也要版本管理</h2>
            <p>评测集不是一次写完就固定不动。每次发现线上或手动测试中的新失败，都应该把它沉淀成新的测试样例。这有点像软件测试里的回归测试：曾经犯过的错，不应该在下一版里悄悄回来。</p>
            <p>我会把测试样例分成 easy、medium、hard 三类。easy 用来检查系统是否正常，medium 用来比较不同 prompt 或模型，hard 则专门收集容易幻觉、容易格式错、容易误解边界的问题。</p>
            <h2>评测结果怎么帮助改 prompt？</h2>
            <p>如果失败集中在格式不稳定，就应该强化输出 schema；如果失败集中在 unsupported claim，就要强调“只根据资料回答”；如果失败集中在回答太泛，就要改检索或要求引用更具体片段。好的评测不是为了给模型打分，而是为了告诉我们下一刀该改哪里。</p>

            <h2>我的小型评测流程</h2>
            <ol>
                <li>写 15 到 30 条固定测试问题。</li>
                <li>为每条问题写期望答案或评分要点。</li>
                <li>每次改系统后批量运行。</li>
                <li>记录失败类型，而不是只看总分。</li>
                <li>挑高风险问题做人类复核。</li>
            </ol>
            <p>大模型应用的工程感，很多时候就体现在评测上。Prompt 写得再漂亮，如果没有稳定的评测，就不知道自己是在进步还是在碰运气。</p>
        `
    },
    {
        id: 'agent-tools-learning-notes',
        title: '从聊天机器人到 Agent：工具调用到底改变了什么？',
        excerpt: '普通聊天机器人只会生成文字，而 Agent 可以调用工具、观察结果、继续决策。本文记录我对工具调用、任务分解和 Agent 边界的一些理解。',
        date: '2026-05-02',
        tags: ['Agent', '工具调用', '大模型', '工程实践'],
        image: 'images/agent-tools-learning-notes-cover.svg',
        readTime: '10 分钟阅读',
        category: '大模型应用',
        type: 'html',
        content: `
            <h2>Agent 不是“更会聊天的模型”</h2>
            <p>最近看了不少 Agent 相关内容，我最开始的理解很模糊：好像只要模型能连续思考、多轮对话，就能叫 Agent。后来慢慢意识到，Agent 真正关键的变化不是“话更多”，而是它能把语言决策连接到外部行动。</p>
            <p>普通聊天机器人主要输出文本；Agent 则可以调用搜索、文件、数据库、代码执行、浏览器等工具，拿到观察结果后再继续决定下一步。它更像一个会使用工具的任务执行器。</p>

            <h2>工具调用带来的三个变化</h2>
            <ol>
                <li><strong>信息来源变了。</strong> 模型不必完全依赖参数记忆，可以查询实时或私有信息。</li>
                <li><strong>任务边界变了。</strong> 模型可以从“建议你怎么做”变成“帮你做一部分”。</li>
                <li><strong>错误类型变了。</strong> 不仅可能答错，还可能调用错工具、传错参数、误解观察结果。</li>
            </ol>
            <p>这意味着 Agent 系统不仅是 prompt 设计问题，也是接口设计、权限控制、状态管理和错误恢复问题。</p>

            <h2>一个简单的工具调用循环</h2>
            <p>我现在会把 Agent 看成一个循环：</p>
            <pre><code>用户目标 -> 模型规划 -> 选择工具 -> 执行工具 -> 观察结果 -> 更新计划 -> 输出或继续</code></pre>
            <p>其中最重要的是“观察结果”。工具调用后，模型不能假装自己已经完成任务，而要根据真实返回继续判断。这一点和人类做实验很像：计划只是开始，结果会不断修正计划。</p>

            <h2>工具越多不一定越好</h2>
            <p>一开始我以为给 Agent 的工具越多越强。后来发现，工具太多会增加选择难度，也会带来更多误调用。一个好的工具集合应该边界清晰、命名准确、输入输出结构稳定。</p>
            <p>比如与其给一个模糊的 <code>handle_file</code> 工具，不如拆成 <code>read_file</code>、<code>search_files</code>、<code>write_file</code>，让模型更容易选择。</p>

            <h2>权限和确认很重要</h2>
            <p>Agent 一旦能执行动作，就必须考虑安全边界。读文件、写文件、发请求、删除数据、提交代码，这些动作风险完全不同。高风险动作应该有明确确认，或者被限制在沙盒里。</p>
            <p>这也是为什么我觉得 Agent 工程不能只追求“自动化程度”。有些步骤交给模型做很舒服，有些步骤必须让人确认。好的 Agent 应该知道什么时候行动，什么时候停下来问。</p>
            <h2>Agent 的记忆不应该乱长</h2>
            <p>另一个让我警惕的问题是记忆。很多 Agent demo 会把历史都塞进上下文，看起来很聪明，但上下文越长，噪声越多，成本也越高。我更倾向把记忆分成短期任务状态和长期知识库：短期状态记录当前任务进度，长期知识库保存可检索的稳定信息。</p>
            <p>这也意味着 Agent 需要会“总结”。不是把所有过程都记住，而是把关键决策、已完成步骤、未解决问题压缩成结构化状态。否则跑久了之后，它会被自己的历史拖慢。</p>
            <h2>失败恢复比一次成功更重要</h2>
            <p>真正可用的 Agent 不应该假设每个工具都会成功。网络会失败，文件会不存在，命令会报错，搜索结果会为空。系统应该把这些失败变成可观察状态，让模型选择重试、换工具、降级回答或请求用户确认。</p>

            <h2>我对 Agent 的阶段性理解</h2>
            <p>Agent 的能力来自三件事的组合：模型的语言理解、工具的真实执行能力、系统对过程的约束。缺任何一个都会出问题：模型强但工具差，只能纸上谈兵；工具强但约束弱，容易乱操作；约束太死，又失去灵活性。</p>
            <p>以后如果我要做一个自己的学习 Agent，我会先从低风险场景开始：整理笔记、搜索已有博客、生成复习清单。等这些流程稳定后，再考虑让它修改代码或自动执行更复杂的任务。</p>
        `
    },
    {
        id: 'may-learning-review-2026',
        title: '五月学习复盘：从模型原理到 AI 工程，我到底学到了什么？',
        excerpt: '从 NumPy 手写线性回归，到理解 Transformer、RAG、LoRA 和 Agent，这几个月的学习让我意识到：AI 学习不能只追新词，更要把原理、代码和工程闭环串起来。',
        date: '2026-05-16',
        tags: ['学习复盘', '人工智能', '大模型', '成长记录'],
        image: 'images/may-learning-review-2026-cover.svg',
        readTime: '9 分钟阅读',
        category: '学习复盘',
        type: 'html',
        content: `
            <h2>回头看这几个月</h2>
            <p>今天是 2026 年 5 月 16 日，翻了一下前面写的文章，突然发现这条学习线已经从“我想学 AI”慢慢走到了“我开始理解 AI 工程”。这中间不只是多知道了几个名词，而是对整个学习路径有了更清楚的层次感。</p>
            <p>最开始我关注的是模型本身：线性回归、神经网络、CNN、Transformer。后来关注点逐渐移到训练和应用：怎么 debug，怎么做 RAG，怎么微调，怎么评测，怎么让模型调用工具。这个变化挺明显的。</p>

            <h2>第一层：原理不能跳过</h2>
            <p>NumPy 手写线性回归和神经网络虽然看起来“造轮子”，但它给了我一个很重要的底座：模型训练不是魔法，就是前向计算、损失函数、梯度下降和参数更新。</p>
            <p>如果没有这层理解，后面看 PyTorch 的 <code>loss.backward()</code>、看 Transformer 的矩阵计算、看 LoRA 的低秩更新，都会停留在“会用但不踏实”的状态。原理不一定要一开始学到特别深，但关键链路必须自己走一遍。</p>

            <h2>第二层：框架是效率工具，不是思考替代品</h2>
            <p>PyTorch 让我第一次感受到现代深度学习框架的效率。自动微分、模块化网络、优化器、DataLoader，这些工具把很多繁琐细节都封装好了。</p>
            <p>但框架也容易让人产生错觉：代码能跑就代表理解了。后来训练不动、loss 不降、验证集崩掉的时候，我才知道真正的理解体现在 debug 能力上。能解释问题，才能修问题。</p>

            <h2>第三层：大模型应用是系统工程</h2>
            <p>RAG、LoRA、Agent、评测，这些主题让我意识到大模型应用不是简单调接口。一个可用系统至少要考虑知识来源、上下文组织、输出格式、失败处理、权限边界和质量评测。</p>
            <p>尤其是 RAG 和 Agent，它们都要求模型和外部世界交互。模型回答不再只是“文本生成质量”，而是和检索、工具、数据、用户目标一起构成一个系统。</p>
            <h2>这段时间最大的心态变化</h2>
            <p>以前我看到新名词会很焦虑：今天 RAG，明天 Agent，后天又是某个新框架，好像不追就会落后。现在我更愿意先问：它解决的基础问题是什么？它依赖哪些旧知识？它的失败模式是什么？</p>
            <p>这样一问，很多新东西就没那么吓人了。RAG 背后是信息检索和上下文构造，LoRA 背后是参数高效优化，Agent 背后是工具调用和状态管理。名字会变，但底层问题会反复出现。</p>
            <h2>哪些文章值得回头重写？</h2>
            <p>如果以后有时间，我想回头重写前几篇“造轮子”文章，把实验代码、可视化结果和踩坑过程补得更完整。学习博客不应该只是时间线，也应该允许旧文章随着理解变深而升级。</p>

            <h2>我现在最想补的短板</h2>
            <ul>
                <li><strong>数学表达能力：</strong> 能看懂公式，但还不够熟练地自己推导。</li>
                <li><strong>实验管理能力：</strong> 需要更系统地记录超参数、数据版本和结果。</li>
                <li><strong>工程封装能力：</strong> 很多 demo 能跑，但离可维护项目还有距离。</li>
                <li><strong>论文阅读速度：</strong> 现在读一篇论文还是偏慢，需要继续练。</li>
            </ul>

            <h2>接下来的学习计划</h2>
            <p>接下来我想把学习重点放在两个方向：一是继续补 Transformer 和大模型训练相关基础，比如 LayerNorm、位置编码、KV Cache、量化；二是做一个真正能用的小型 AI 项目，比如基于自己博客和课程笔记的学习问答助手。</p>
            <p>我不想让学习停留在“看了很多文章”。最好的学习闭环应该是：读原理，写代码，做项目，记录复盘，再回头修正理解。</p>

            <h2>最后</h2>
            <p>这个个人主页最开始只是心血来潮搭出来的，现在慢慢变成了一个学习轨迹记录器。它不一定多专业，但每篇文章都像给未来的自己留一个路标：当时我学到了哪里，卡在哪里，又是怎么往前走的。</p>
            <p>希望下一次复盘时，我不只是多会了几个工具，而是真的更接近“能独立做出一个 AI 系统”的状态。</p>
        `
    },
];
