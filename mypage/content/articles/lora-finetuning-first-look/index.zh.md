---
id: lora-finetuning-first-look
title: 第一次理解 LoRA：为什么微调大模型不一定要改所有参数？
excerpt: 全量微调听起来很直接，但代价太高。LoRA 的思路是冻结原模型，只训练低秩适配矩阵，用很少的参数让模型学会新任务。本文记录我第一次读懂 LoRA 的过程。
date: '2026-03-27'
tags:
  - 大模型
  - LoRA
  - 微调
  - 深度学习
category: 大模型学习
cover: images/lora-finetuning-first-look-cover.svg
readTime: 10 分钟阅读
status: published
featured: false
updatedAt: '2026-05-25T06:46:17.413Z'
---
## 为什么需要参数高效微调？

刚开始接触大模型微调时，我的第一反应很朴素：既然模型要适应新任务，那就继续训练它的全部参数。这个想法在小模型上很自然，但到了大模型时代就变得昂贵了。

一个几十亿参数的模型，如果全量微调，不仅显存压力巨大，还需要保存一整份新的模型权重。对于个人学习和中小型项目来说，这几乎不可持续。于是就有了参数高效微调（PEFT）的思路：不要动所有参数，只在关键位置加少量可训练参数。

## LoRA 的核心直觉

LoRA（Low-Rank Adaptation）的核心想法可以用一句话概括：**冻结原来的大矩阵，只学习一个低秩的更新量。**

假设某一层原本有一个权重矩阵 `W`。全量微调会直接更新 `W`，而 LoRA 认为我们可以把更新量写成两个小矩阵的乘积：

```
W' = W + BA
```

其中 `A` 和 `B` 的秩很低，参数量远小于原始矩阵。训练时 `W` 不动，只训练 `A` 和 `B`。这就像不给整栋楼重建结构，只在关键位置加一些可调节的支架。

## 为什么低秩更新可能够用？

这点我一开始也觉得奇怪：这么少的参数，真的能让模型适应新任务吗？后来我的理解是，大模型原本已经学到了非常丰富的通用能力，微调很多时候不是从零学习，而是把已有能力重新组合、偏向某个任务分布。

如果任务不需要彻底改变模型的世界知识，只需要调整表达习惯、输出格式或某类领域模式，那么一个低维的更新方向可能已经足够。

## LoRA 通常加在哪里？

在 Transformer 里，LoRA 常见地加在 Attention 的线性层上，比如 `q_proj`、`v_proj`，有时也会加到 `k_proj`、`o_proj` 或 MLP 层。不同任务和模型会有不同选择。

一个简化版的线性层 LoRA 可以这样理解：

```python
class LoRALinear(nn.Module):
    def __init__(self, in_features, out_features, rank):
        super().__init__()
        self.weight = nn.Parameter(torch.randn(out_features, in_features))
        self.weight.requires_grad = False

        self.A = nn.Parameter(torch.randn(rank, in_features) * 0.01)
        self.B = nn.Parameter(torch.zeros(out_features, rank))

    def forward(self, x):
        base = x @ self.weight.T
        delta = x @ self.A.T @ self.B.T
        return base + delta
```

真实实现还会有 scaling、dropout、merge 权重等细节，但核心就是这条额外的低秩分支。

## LoRA 的优点和限制

-   **显存友好：** 需要训练的参数少，优化器状态也少。
-   **易于保存：** 可以只保存 adapter，不必保存完整模型。
-   **方便切换：** 同一个底座模型可以挂不同任务的 LoRA。
-   **不是万能：** 如果任务和底座模型能力差距太大，LoRA 也救不了。

## rank、alpha 和数据质量

LoRA 里 rank 是一个很关键的超参数。rank 太小，表达能力可能不够；rank 太大，训练参数变多，也更容易过拟合。对于个人实验，我会先从 8 或 16 这种保守值开始，再看验证集表现。

另一个常见参数是 alpha，它决定 LoRA 分支的缩放强度。我的理解是：rank 决定这条分支能表达多少变化，alpha 决定这个变化在输出里有多大声。两者都不应该脱离数据质量讨论。数据格式混乱、答案风格不统一时，调再多参数也只是让模型更努力地学习噪声。

## 我会如何设计一次 LoRA 小实验？

如果要真正跑一次，我会选一个小任务，比如“把课程笔记整理成问答格式”。训练集控制在几百到一两千条，先保证样例质量，再观察训练 loss 和验证回答。重点不是追求模型变得无所不能，而是看它是否稳定学会了特定输出格式和领域表达。

## 我的理解小结

LoRA 给我的启发是：微调不一定意味着“重写模型”，也可以是“给模型加一个可学习的偏移”。这和残差连接、adapter、prompt tuning 等思路有某种相似气质：尽量保留已有能力，只学习任务所需的增量。

下一步如果有机会，我想用一个小的开源模型做一次 LoRA 指令微调，重点观察训练数据格式、rank 选择和过拟合情况。理解原理只是第一步，真正跑通一次才算把知识落到手上。
