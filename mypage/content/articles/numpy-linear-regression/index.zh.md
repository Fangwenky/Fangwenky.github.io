---
id: numpy-linear-regression
title: 拒绝调包：用 NumPy 手写线性回归，彻底搞懂梯度下降
excerpt: >-
  Scikit-learn 的 fit() 很好用，但它掩盖了太多细节。为了彻底理解机器学习的核心——梯度下降，我决定抛弃框架，仅用 NumPy
  徒手实现一个线性回归模型。
date: '2025-10-10'
tags:
  - 机器学习
  - NumPy
  - 数学原理
  - 代码实现
category: 造轮子系列
cover: images/linear-regression-cover.svg
readTime: 8 分钟阅读
status: published
featured: false
updatedAt: '2026-05-25T06:46:17.392Z'
---
## 为什么要重新发明轮子？

在上一篇《学习路线图》中，我立下了一个 Flag：要深入理解算法底层。线性回归（Linear Regression）看起来最简单，但它是理解神经网络训练过程（前向传播、损失计算、反向传播/梯度更新）的最佳跳板。

很多大二同学（包括之前的我）只会写：

```python
from sklearn.linear_model import LinearRegression
    model = LinearRegression()
    model.fit(X, y) # 魔法发生了，但怎么发生的？
```

今天，我要拆解这个黑盒。

## 核心数学原理：梯度下降 (Gradient Descent)

我们的目标是找到一条直线 ( y = wx + b )，使得它离所有数据点都尽可能近。这就需要定义一个**损失函数 (Loss Function)**，通常使用均方误差 (MSE)：

![MSE公式](images/loss-function-formula.svg)

为了让 Loss 最小，我们需要求导，计算梯度，然后沿着梯度的反方向更新参数 ( w ) 和 ( b )。这就好比下山，每一步都往最陡峭的下坡方向走。

## 代码实现：Talk is cheap

首先，生成一些带噪声的模拟数据：

```python
import numpy as np
    import matplotlib.pyplot as plt

    # 生成数据：y = 2x + 5 + noise
    X = np.random.rand(100, 1)
    y = 2 * X + 5 + 0.1 * np.random.randn(100, 1)
```

接着，核心的训练循环（Training Loop）：

```python
# 初始化参数
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
        b = b - lr * db
```

## 可视化结果

经过 1000 次迭代，我的模型终于学会了这条直线！看看拟合的效果：

![线性回归拟合结果](images/linear-regression-plot.svg)

## 总结与反思

虽然代码只有短短十几行，但我真正理解了**学习率 (Learning Rate)** 的作用。如果把 lr 调大到 1.0，Loss 直接飞了（梯度爆炸）；调得太小，训练速度又极慢。

既然搞定了线性回归，**下一站：尝试用同样的逻辑，手写一个简单的神经网络分类器！**
