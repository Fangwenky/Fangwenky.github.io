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
        date: '2025-11-19', // 时间线继续后推
        tags: ['计算机视觉', 'CNN', 'PyTorch', 'CIFAR-10'],
        image: 'images/cnn-cover.svg', // 封面图代码在下面
        readTime: '12 分钟阅读',
        category: '框架实战',
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
    // {
    //     id: 'article2',
    //     title: '示例文章2',
    //     excerpt: '这是另一篇示例文章的摘要内容...',
    //     date: '2024-03-14',
    //     tags: ['生活', '随笔'],
    //     image: 'images/article2.svg',
    //     readTime: '3 分钟阅读',
    //     category: '生活',
    //     content: `
    //         <h2>文章二的详细内容标题</h2>
    //         <p>这是文章二的第一段详细内容。同样，您可以在这里自由地编写内容。</p>
    //         <p>可以插入图片：</p>
    //         <img src="images/article1.svg" alt="示例图片" style="max-width: 100%; height: auto;">
    //         <p>更多内容...</p>
    //     `
    // }
];