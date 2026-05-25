---
id: numpy-neural-network
title: 打破线性束缚：手写一个双层神经网络，解决 XOR 问题
excerpt: 线性回归虽然美好，但它甚至无法解决简单的异或（XOR）问题。为了处理复杂的世界，我给模型加上了“隐藏层”和“激活函数”，亲手构建了我的第一个神经网络。
date: '2025-10-21'
tags:
  - 深度学习
  - 神经网络
  - 反向传播
  - XOR
category: 造轮子系列
cover: images/nn-xor-cover.svg
readTime: 10 分钟阅读
status: published
featured: false
updatedAt: '2026-05-25T06:46:17.394Z'
---
## 线性模型的极限

在上一篇实现线性回归后，我尝试用同样的方法去分类“异或”数据（XOR）。结果惨不忍睹——无论怎么训练，准确率都在 50% 徘徊。

原因很简单：**异或问题不是线性可分的**。就像下图所示，你无法画出一条直线，把红色和蓝色的点完全分开。

![线性不可分 vs 神经网络分类](images/linear-vs-nonlinear.svg)

## 引入“魔法”：隐藏层与激活函数

为了解决这个问题，我们需要引入两个变革性的概念：

1.  **隐藏层 (Hidden Layer)**：增加特征转换的能力。
2.  **激活函数 (Activation Function)**：最关键的一步！如果没有非线性的激活函数（如 Sigmoid 或 ReLU），多少层神经网络叠加最后依然只是一个线性模型。

## 代码实现：双层网络

这次的模型结构是：`Input(2) -> Hidden(10) -> Activation -> Output(1)`。

最让人头秃的是**反向传播 (Backpropagation)** 的推导，链式法则在这里变得更加复杂：

```python
# Sigmoid 激活函数及其导数
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
        weights_input_hidden += X.T.dot(d_hidden_layer) * lr
```

## 顿悟时刻

当看到 Loss 曲线终于突破瓶颈，迅速下降接近于 0 时，那种成就感无以言表。模型终于学会了画一条“弯曲”的线来分割数据。

不过，手动计算每一个矩阵的导数实在是太容易出错了（特别是维度对齐的时候）。我开始理解为什么我们需要框架了。

**Next Stop: 告别手算梯度，拥抱 PyTorch 自动微分 (Autograd)！**
