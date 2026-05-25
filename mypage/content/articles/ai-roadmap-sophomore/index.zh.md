---
id: ai-roadmap-sophomore
title: 我的 AI 学习路线图：大二这一年我打算学什么？
excerpt: 大二是一个分水岭。不再满足于调包，我决定用这一年时间，从数学底层到深度学习框架，系统构建我的 AI 知识体系。本文记录了我的年度学习计划与 Flag...
date: '2025-10-01'
tags:
  - 人工智能
  - 学习路线
  - 深度学习
  - 年度计划
category: 学习笔记
cover: images/ai-roadmap-cover.svg
readTime: 5 分钟阅读
status: published
featured: false
updatedAt: '2026-05-25T06:46:17.390Z'
---
## 为什么写这篇文章？

步入大二，我意识到人工智能不仅仅是调用 `model.fit()` 那么简单。在过去的一年里，我接触了基础的编程，但面对复杂的论文和底层原理时常常感到吃力。

大二这一年是打基础的黄金时期。我信奉 **"Learning in Public"（公开学习）** 的理念，所以这篇博文既是我的路线图，也是我立下的 Flag。我希望通过系统化的学习，从一名 AI 爱好者转变为一名具备工程能力的 AI 开发者。

![学习路线思维导图](images/roadmap-mindmap.svg)

## 第一阶段：重铸数学之魂 (Foundations)

AI 的本质是数学。我不想做一个只会调参数的“炼丹师”，我要理解黑盒背后的原理。本学期的重点是：

-   **线性代数：** 重点复习特征值与特征向量、SVD 奇异值分解（在降维中非常重要）。
-   **微积分：** 彻底搞懂梯度下降（Gradient Descent）的数学推导，理解链式法则在反向传播中的应用。
-   **概率论：** 深入理解贝叶斯定理和极大似然估计。

## 第二阶段：机器学习——从原理到手写 (Classic ML)

虽然 Scikit-learn 很强大，但正如费曼所说：“_What I cannot create, I do not understand._”

我的目标是**不依赖高级库，仅用 NumPy 实现以下算法**：

1.  线性回归与逻辑回归（实现梯度下降优化器）
2.  K-Means 聚类算法
3.  简单的神经网络（手动实现 Backpropagation）

## 第三阶段：拥抱深度学习与 PyTorch (Deep Learning)

在打好基础后，我将全面转向深度学习。目前的计划是深入学习 **PyTorch** 框架。

-   **计算机视觉 (CV)：** 复现经典的 CNN 模型（如 AlexNet, ResNet），做一个自己的图像分类项目。
-   **自然语言处理 (NLP)：** 啃透 Transformer 架构，精读《Attention Is All You Need》，尝试微调一个小的语言模型。

这期间，我会把学习笔记整理成博客文章，发布在“论文精读”专栏。

## 第四阶段：工程化与工具 (MLOps & Tools)

模型在 Jupyter Notebook 里跑通只是第一步。我希望提升我的工程素养：

-   **Linux 与命令行：** 熟练使用服务器进行远程训练。
-   **Git 版本控制：** 规范化我的代码提交习惯。
-   **Docker：** 学习如何打包我的环境，解决“在我的机器上能跑”的问题。

## 结语

路漫漫其修远兮。这是一份充满挑战的计划，但我已经准备好了。如果你也正在学习 AI，欢迎在下方留言或者通过邮件与我交流，我们一起进步！

_Next Stop: NumPy 实现线性回归。Stay tuned!_
