---
id: training-debugging-diary
title: 模型训练不动时，我通常按这个清单排查
excerpt: >-
  训练深度学习模型最痛苦的时刻，不是报错，而是 loss 一动不动。本文整理了我在 PyTorch
  训练中常用的排查顺序：数据、标签、学习率、梯度、模型容量和验证集。
date: '2025-12-29'
tags:
  - PyTorch
  - 训练技巧
  - Debug
  - 深度学习
category: 工程笔记
cover: images/training-debugging-diary-cover.svg
readTime: 8 分钟阅读
status: published
featured: false
updatedAt: '2026-05-25T06:46:17.402Z'
---
## 最可怕的 bug：它不报错

写深度学习代码有一种很折磨人的情况：程序能跑，显存正常占用，进度条也很优雅地往前走，但 loss 像被钉住了一样，准确率也像随机猜测。它不报错，所以你甚至不知道该骂谁。

踩过几次坑之后，我逐渐整理出一套自己的排查顺序。它不保证能解决所有问题，但至少能让我不要在凌晨两点盯着 loss 曲线开始怀疑人生。

## 第一步：先看数据，不要先怪模型

很多训练问题最后都不是模型问题，而是数据问题。我的第一步永远是把一个 batch 取出来，直接打印或可视化。

```python
images, labels = next(iter(train_loader))
print(images.shape, labels.shape)
print(images.min().item(), images.max().item())
print(labels[:16])
```

如果是图像任务，我会把图片画出来，确认增强没有把图弄坏；如果是文本任务，我会把 token decode 回文本，确认分词和截断没有离谱。不要小看这一步，我见过标签错位、图片全黑、归一化做了两次、类别编号从 1 开始但 loss 期望从 0 开始等各种问题。

## 第二步：做一个 overfit 小实验

这是我觉得最有用的检查方法：拿 16 或 32 条样本，让模型强行记住它们。如果模型连这点数据都拟合不了，那说明训练链路一定有问题。

```python
small_dataset = torch.utils.data.Subset(train_dataset, range(32))
small_loader = DataLoader(small_dataset, batch_size=32, shuffle=True)
```

正常情况下，一个容量足够的模型应该能很快把这 32 条样本的 loss 打到很低。如果做不到，我就会继续检查 loss、optimizer、梯度和标签。

## 第三步：检查 loss 和输出是否匹配

PyTorch 里有些 loss 的输入要求非常具体。比如 `nn.CrossEntropyLoss` 期待的是未经过 softmax 的 logits，而不是概率。如果你手动做了 softmax，再送进 CrossEntropyLoss，训练可能就会变得很怪。

```python
# 正确：model 输出 logits
logits = model(x)
loss = nn.CrossEntropyLoss()(logits, y)

# 不推荐：先 softmax 再 CrossEntropyLoss
probs = torch.softmax(logits, dim=1)
loss = nn.CrossEntropyLoss()(probs, y)
```

二分类、多标签分类、回归任务也各有不同的 loss 搭配。这里一旦错了，模型可能还能跑，但学到的东西完全不对。

## 第四步：观察梯度，而不是只看 loss

如果 loss 不动，我会打印几个关键层的梯度范数。梯度全是 0，可能是激活饱和、detach 断图、学习率太小；梯度特别大，可能是学习率太高或数据尺度有问题。

```python
for name, param in model.named_parameters():
    if param.grad is not None:
        print(name, param.grad.norm().item())
```

这一步能直接告诉我：模型到底有没有收到学习信号。很多时候我们以为模型在训练，其实梯度根本没传到某些层。

## 第五步：学习率是第一嫌疑人

学习率太大，loss 会震荡甚至爆炸；学习率太小，loss 像睡着一样。我现在一般会先尝试 `1e-3`、`3e-4`、`1e-4` 三档，再根据曲线微调。

如果训练前期完全不下降，我会先把学习率调大一点试试；如果 loss 上下乱跳，就降学习率。不要在模型结构上急着动刀，学习率往往比想象中更关键。

## 第六步：区分“学不会”和“泛化差”

训练集 loss 下不去，说明优化或模型容量有问题；训练集很好但验证集差，说明过拟合或数据分布有问题。这两个问题的解决方向完全不同。

-   训练集也很差：检查数据、loss、学习率、模型容量。
-   训练集很好，验证集差：加数据增强、正则化、dropout，或者检查验证集分布。
-   训练和验证都忽上忽下：检查 batch size、学习率、随机种子和数据采样。

## 我现在会记录哪些训练信息？

以前我只记得“这个模型好像跑到 80% 了”，过几天再回来完全不知道当时用了什么参数。现在我会强迫自己至少记录这些内容：数据版本、模型结构、学习率、batch size、随机种子、训练轮数、最好的验证指标和失败备注。

```
run_name: cnn_cifar10_aug_v2
lr: 3e-4
batch_size: 128
seed: 42
best_val_acc: 78.4
note: color jitter helps, random crop too strong hurts
```

这件事看起来很笨，但它能避免大量重复试错。训练模型最怕的是“凭感觉调参”，因为感觉不会自动保存，也没法复盘。

## 关于数据增强的一点经验

数据增强不是越强越好。比如图像分类里随机裁剪、颜色扰动、翻转都很常见，但如果增强破坏了类别本身的关键特征，模型会学得更乱。我的做法是每加一种增强，都先可视化几十张增强后的图片，确认人眼还能判断标签。

## 我的最终排查清单

1.  可视化一个 batch，确认输入和标签正确。
2.  用极小数据集做 overfit 测试。
3.  确认 loss 输入格式与任务匹配。
4.  打印梯度范数，确认反向传播没有断。
5.  扫几档学习率，看 loss 曲线是否有响应。
6.  分别观察训练集和验证集，判断是优化问题还是泛化问题。

训练模型像排水管堵塞：不要一上来就拆整栋楼，先沿着水流一段段看哪里堵了。把这个过程清单化之后，debug 的痛苦会少很多。
