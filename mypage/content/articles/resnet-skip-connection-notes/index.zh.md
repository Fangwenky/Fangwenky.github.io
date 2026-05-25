---
id: resnet-skip-connection-notes
title: 为什么 ResNet 能训练得更深？我对残差连接的理解
excerpt: 深层网络并不是简单地“层数越多越强”。ResNet 的残差连接解决了深层网络退化问题，也给后来的大模型结构留下了很深的影响。
date: '2026-02-16'
tags:
  - ResNet
  - CNN
  - 计算机视觉
  - 深度学习
category: 论文精读
cover: images/resnet-skip-connection-notes-cover.svg
readTime: 10 分钟阅读
status: published
featured: false
updatedAt: '2026-05-25T06:46:17.411Z'
---
## 层数越深，模型一定越好吗？

刚学神经网络时，我很自然地以为：模型层数越多，表达能力越强，效果也应该越好。但 ResNet 论文告诉我，事情没有这么简单。

深层网络会遇到退化问题：不是过拟合，而是训练集误差本身变高。也就是说，模型明明更复杂，却连训练数据都拟合得更差。这说明问题出在优化过程，而不是模型容量不够。

## 残差连接的核心想法

普通网络学习的是一个映射 `H(x)`。ResNet 改成让网络学习残差 `F(x) = H(x) - x`，最后输出：

```
y = F(x) + x
```

如果某几层暂时学不到有用东西，最差也可以让 `F(x)` 接近 0，这样输出就接近输入。换句话说，残差连接给深层网络提供了一条“保底通道”。

## 这条捷径为什么有用？

我对 skip connection 的理解有三层：

1.  **信息更容易流动。** 输入可以直接跨层传到后面，不必每一层都重新编码。
2.  **梯度更容易回传。** 反向传播时，梯度也有更短的路径传回浅层。
3.  **优化目标更温和。** 学一个“修改量”有时比学完整映射更容易。

这让我想起写代码时的补丁：与其重写整个系统，不如在已有结果上学习一个增量修改。

## 一个最小残差块

用 PyTorch 写一个非常简化的残差块，大概是这样：

```python
class ResidualBlock(nn.Module):
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
        return self.relu(self.conv(x) + x)
```

真实 ResNet 会处理通道数变化、下采样、瓶颈结构等细节，但核心精神就是这句 `self.conv(x) + x`。

## 残差思想不只属于 CNN

后来我发现 Transformer 里也大量使用残差连接。Self-Attention 后面加 residual，Feed Forward 后面也加 residual。它已经变成深度网络的基础设计语言。

这说明残差连接解决的不是某个视觉任务的小问题，而是深层模型训练的普遍问题：如何让信息和梯度穿过很深的网络。

## BatchNorm 和残差块的配合

读 ResNet 时我还注意到一个细节：残差块里经常搭配 BatchNorm。BatchNorm 可以稳定每层输入分布，让训练更容易；残差连接提供更顺畅的信息路径。两者一起出现，不是偶然。

后来很多新结构会把 BatchNorm 换成 LayerNorm、GroupNorm，或者改变归一化位置，但“归一化 + 残差”这个组合一直保留下来。这说明现代深度网络不仅靠表达能力，也靠一整套让优化变稳定的结构设计。

## 如果要复现 ResNet，我会先做什么？

我不会一上来复现 ResNet-50，而会先在 CIFAR-10 上写一个小型 ResNet：少量残差块、固定通道数、清晰的训练脚本。目标不是刷榜，而是确认残差网络确实比同等深度的普通 CNN 更容易训练。

这个实验如果能跑通，就可以进一步观察层数、学习率、数据增强对结果的影响。比起直接复制大型代码仓库，这种小复现更能建立直觉。

## 读完后的收获

ResNet 给我的启发是：深度学习里的很多突破并不是“堆更多计算”，而是改变优化路径。残差连接看起来只是加了一条线，但它让训练非常深的网络变得现实。

以后看模型结构时，我会更关注这些看似普通的连接方式。很多时候，真正决定模型能不能训练起来的，正是这些结构上的细节。
