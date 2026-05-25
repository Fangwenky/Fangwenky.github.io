---
id: transformer-attention-notes
title: 读懂 Transformer 的第一步：从 Attention 公式开始拆解
excerpt: >-
  Transformer 总被说成是大模型时代的地基，但第一次看 Attention 公式时很容易只记住 Q、K、V
  三个字母。本文从直觉、矩阵形状和代码实现三个角度，记录我第一次真正读懂注意力机制的过程。
date: '2025-12-14'
tags:
  - Transformer
  - Attention
  - NLP
  - 论文精读
category: 论文精读
cover: images/transformer-attention-notes-cover.svg
readTime: 9 分钟阅读
status: published
featured: false
updatedAt: '2026-05-25T06:46:17.397Z'
---
## 为什么 Attention 这么重要？

学深度学习时，总会在某个节点遇到 Transformer。无论是 ChatGPT、BERT、ViT，还是各种多模态模型，最后都会绕回那个看起来很简洁的公式：

```
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V
```

这行公式第一次看非常像咒语：Q 是什么，K 是什么，为什么要除以根号 d，最后为什么又乘 V？如果只是背下来，其实很快就会忘掉。我这次的目标不是“能说出 Transformer 很强”，而是把这个公式拆到自己能用 NumPy 写出来。

## 先从直觉理解：在一堆信息里找重点

Attention 的核心想法可以粗暴理解成：当前这个 token 想知道“我应该重点看谁”。比如句子“我把书放进书包，因为它很重”里，“它”到底指书还是书包？模型需要根据上下文分配注意力权重。

Query 可以看成“我想找什么”，Key 可以看成“我这里有什么特征”，Value 则是“如果你关注我，就从我这里拿走的信息”。Q 和 K 做点积，就是在算“需求”和“特征”有多匹配；softmax 把匹配分数变成概率；最后用这些概率去加权 V。

## 矩阵形状比公式更重要

我以前看公式总是卡住，后来发现最有效的方法是盯住 shape。假设一个句子有 6 个 token，每个 token 的向量维度是 64，那么输入矩阵可以记作：

```
X: [6, 64]
W_q, W_k, W_v: [64, 64]
Q = XW_q: [6, 64]
K = XW_k: [6, 64]
V = XW_v: [6, 64]
```

接下来 `QK^T` 的形状是 `[6, 6]`。这张 6×6 的表非常关键：第 i 行代表第 i 个 token 对所有 token 的关注程度。也就是说，Attention 并不是某种玄学，它首先是一张“token 之间互相关注的关系表”。

## 为什么要除以 sqrt(d\_k)？

这个细节我卡过一会儿。直觉上，向量维度越大，点积的数值波动也会越大。如果不做缩放，softmax 前的分数可能特别极端，导致输出概率过早接近 0 或 1，梯度变得不好训练。

除以 `sqrt(d_k)` 本质上是在稳定数值范围，让 softmax 不至于太“自信”。这和很多深度学习技巧的气质很像：不是改变表达能力，而是让训练更稳。

## 用 NumPy 写一个最小版 Self-Attention

理解 Attention 后，我试着写了一个最小版本。代码没有考虑 batch 和多头，只保留最核心的计算过程：

```python
import numpy as np

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
    return output, weights
```

写完之后再回头看公式，感觉就完全不一样了。公式不是在描述某个不可触碰的黑箱，而是在写一个非常具体的矩阵计算流程。

## Multi-Head Attention 到底多了什么？

多头注意力并不是把 Attention 变复杂，而是让模型从多个角度看同一段文本。有的头可能关注语法关系，有的头可能关注指代关系，有的头可能关注局部相邻信息。

从实现上看，就是把 hidden dimension 切成多个 head，每个 head 单独做一次 Attention，再拼接回来。它像是给模型配了多副不同焦距的眼镜，而不是只用一种相似度标准理解整句话。

## 这次学习留下的三个结论

-   **先看 shape，再看公式。** 对深度学习模型来说，shape 经常比符号本身更能解释问题。
-   **Q、K、V 不是神秘概念。** 它们只是同一个输入经过三组不同线性变换得到的表示。
-   **Attention 的本质是动态加权。** 模型不是固定抽取特征，而是根据当前 token 动态决定看哪里。

## 实现时最容易踩的几个坑

真正写代码时，我发现 Attention 的难点不在公式，而在维度管理和 mask。训练语言模型时，当前位置不能看到未来 token，所以需要 causal mask；处理不同长度句子时，又需要 padding mask。两个 mask 的含义不同，但都会作用在 softmax 之前的 score 上。

```python
# mask 的常见做法：在 softmax 前把禁止关注的位置变成很小的数
scores = scores.masked_fill(mask == 0, -1e9)
weights = softmax(scores)
```

另一个坑是数值稳定。softmax 之前如果 score 太大，很容易出现溢出，所以实现 softmax 时通常会先减去最大值。很多框架帮我们做了这些细节，但自己写一遍后才知道“稳定训练”背后有很多小心思。

## 我会如何检查自己是否真的懂了？

我给自己设了三个检验标准：第一，能画出 Q、K、V 的 shape 流程；第二，能解释为什么输出是所有 value 的加权和；第三，能说清 mask 加在哪里以及为什么。只要其中任何一个说不清，就说明理解还停留在背公式阶段。

下一步我打算继续拆 Transformer 的 Feed Forward、残差连接和 LayerNorm。真正读懂一个模型，大概就是把每一块“看起来理所当然”的模块都重新问一遍为什么。
