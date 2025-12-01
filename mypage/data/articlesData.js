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
];