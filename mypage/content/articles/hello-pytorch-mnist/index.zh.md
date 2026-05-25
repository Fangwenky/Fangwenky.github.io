---
id: hello-pytorch-mnist
title: Hello PyTorch：从 NumPy 手推公式到 PyTorch 自动微分
excerpt: >-
  还记得上一篇为了解决 XOR 问题，我推导矩阵求导推到头秃吗？今天我遇到了 PyTorch，才发现原来只需要一行 loss.backward()
  就能搞定一切。
date: '2025-11-07'
tags:
  - PyTorch
  - 深度学习
  - MNIST
  - 自动微分
category: 框架实战
cover: images/pytorch-mnist-cover.svg
readTime: 6 分钟阅读
status: published
featured: false
updatedAt: '2026-05-25T06:46:17.395Z'
---
## 再见，手动求导

在上一篇文章中，我用 NumPy 手写了一个神经网络。虽然我很自豪能写出来，但那个反向传播的链式法则推导简直是噩梦。如果网络再深一点（比如 50 层），手动推导简直是不可能的任务。

这也是为什么我们需要 **深度学习框架**。今天我正式入坑 **PyTorch**。

## PyTorch 的核心魔法：Autograd

PyTorch 最让人感动的功能叫 **自动微分 (Automatic Differentiation)**。你只需要定义前向传播（怎么算 Loss），它会自动帮你把反向传播（怎么算梯度）全做了。

对比一下代码量：

🛑 NumPy (Old Way):

```python
d_loss = ... # 一大堆数学公式
    d_w2 = ...   # 甚至还要注意矩阵转置
    w2 -= lr * d_w2
```

* * *

🔥 PyTorch (New Way):

```python
loss.backward() # 魔法发生的地方！
    optimizer.step()
```

## 实战：MNIST 手写数字识别

为了测试 PyTorch，我选择了经典的 MNIST 数据集。这是一个包含 60,000 张手写数字图片的数据集。

我构建了一个简单的全连接网络：

```python
import torch
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
    
```

## 预测结果可视化

训练了仅仅 5 个 Epoch，准确率就达到了 97%！来看看模型对测试集图片的预测结果：

![MNIST 预测结果展示](images/mnist-prediction.svg)

如上图所示，模型非常自信地识别出了数字 7、2 和 1。这就是现代 AI 开发的效率。

## 下一步计划

虽然全连接网络能处理 MNIST，但对于复杂的彩色图片（比如猫和狗），它就力不从心了。因为它会破坏图片的二维空间结构。

**Next Stop: 计算机视觉的皇冠——卷积神经网络 (CNN)。**
