---
id: pytorch-cnn-cifar
title: 给 AI 装上眼睛：从全连接到卷积神经网络 (CNN) 实战
excerpt: >-
  当全连接网络在 CIFAR-10 数据集上屡战屡败时，我意识到 AI 需要一种新的“看”世界的方式。本文记录了我学习卷积神经网络（CNN）的笔记，以及如何用
  PyTorch 搭建一个 LeNet 风格的模型。
date: '2025-11-19'
tags:
  - 计算机视觉
  - CNN
  - PyTorch
  - CIFAR-10
category: 框架实战
cover: images/cnn-cover.svg
readTime: 8 分钟阅读
status: published
featured: false
updatedAt: '2026-05-25T06:46:17.396Z'
---
## 全连接层的死穴

上一周，我尝试把之前的 MNIST 模型直接用到 **CIFAR-10** 数据集上。结果非常尴尬：准确率卡在 45% 上不去。

这让我意识到全连接层 (Fully Connected Layer) 的一个巨大缺陷：**它暴力地把二维图像拉平成了一维向量。**

这就好比把一张拼图拆散成碎片排成一行，原本“眼睛在鼻子上面”这种空间结构信息全丢失了。对于只有黑白线条的数字还凑合，但对于复杂的猫狗照片，这简直是毁灭性的。

## 救星：卷积 (Convolution)

卷积神经网络 (CNN) 的核心思想是：**不要一次看全图，而是像手电筒一样，用一个过滤器 (Kernel) 在图片上滑动。**

我画了一张图来理解这个过程：

![CNN 架构原理图](images/cnn-architecture.svg)

-   **卷积层 (Conv):** 负责提取特征（边缘、纹理、形状）。
-   **池化层 (Pool):** 负责近视眼（模糊化），保留主要特征，减少计算量。

## PyTorch 代码实现

我参考经典的 LeNet 结构，搭建了一个简单的 CNN：

```python
class SimpleCNN(nn.Module):
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
            return x
```

## 训练结果对比

同样的训练轮数（Epochs）：

-   **MLP (全连接):** 45% 准确率（也就比瞎猜好点）
-   **CNN (本模型):** **72% 准确率** 🚀

虽然 72% 在学术界不算高（SOTA 都是 99%），但这是我第一次亲手感受到 CNN 提取空间特征的威力！

## 下一步：深度风暴

两层卷积还是太浅了。据说微软提出的 **ResNet** 有 152 层那么深……下次我要挑战一下复现经典的 ResNet 结构！
