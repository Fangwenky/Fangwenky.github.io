---
id: linux-remote-training-notes
title: 第一次认真用 Linux 跑训练：服务器环境生存笔记
excerpt: >-
  从本地 Jupyter 到远程服务器，中间隔着 SSH、conda、tmux、CUDA、日志和显存管理。本文整理我第一次认真在 Linux
  服务器上跑模型训练时踩过的坑。
date: '2026-01-28'
tags:
  - Linux
  - 深度学习
  - 服务器
  - 工程实践
category: 工程笔记
cover: images/linux-remote-training-notes-cover.svg
readTime: 9 分钟阅读
status: published
featured: false
updatedAt: '2026-05-25T06:46:17.407Z'
---
## 从本地到服务器，不只是换一台电脑

以前在自己电脑上跑实验，最常见的流程是打开 IDE，点运行，等结果。真正开始用服务器训练模型后，我才发现深度学习工程里有一大块技能叫“让实验稳定地在远程机器上活下来”。

服务器不会因为你关掉电脑而停止，但如果不会用 tmux、不会看日志、不会管理环境，那它也不会自动替你变得可靠。

## SSH：进入服务器的第一扇门

最基础的连接命令是：

```bash
ssh username@server_ip
```

但频繁输入 IP 和用户名很麻烦，所以我把配置写进了 `~/.ssh/config`：

```bash
Host ai-server
    HostName 192.168.1.100
    User wenky
    Port 22
```

之后只需要 `ssh ai-server` 就能连接。这个小配置非常提升幸福感。

## tmux：让训练不要死在断网里

如果直接在 SSH 会话里跑训练，一旦网络断开，进程可能就没了。tmux 的作用是创建一个持久会话，让训练在后台继续跑。

```bash
tmux new -s train
python train.py

# 退出但不终止会话：Ctrl-b 然后按 d
tmux attach -t train
```

这大概是我学服务器训练时最值得优先掌握的工具。它不复杂，但能救命。

## 环境管理：不要污染 base

我一开始喜欢直接在 base 环境里装包，后来很快就乱了。现在的习惯是每个项目单独建环境：

```bash
conda create -n cv-exp python=3.10
conda activate cv-exp
pip install torch torchvision
```

如果项目要长期维护，就把依赖写进 `requirements.txt` 或环境文件里。否则过两周回来，自己都不知道当时装了什么。

## CUDA 和 PyTorch 版本要对齐

深度学习环境最容易炸的地方就是 CUDA。我的经验是不要凭感觉安装，先确认驱动和 CUDA 情况：

```bash
nvidia-smi
python -c "import torch; print(torch.cuda.is_available())"
```

如果 `torch.cuda.is_available()` 是 False，不要急着改代码，先看 PyTorch 安装版本、CUDA runtime 和显卡驱动是否匹配。

## 日志：训练过程要可回放

远程训练不能只靠终端输出。我现在至少会把关键日志写到文件：

```bash
python train.py 2>&1 | tee logs/train_20260128.log
```

这样即使终端滚过去了，也能回头看 loss、准确率、报错和超参数。对于长时间训练来说，日志就是实验的记忆。

## 显存管理：先看谁占了 GPU

服务器经常多人共用，训练前先看显卡状态是一种礼貌：

```bash
nvidia-smi
```

如果显存被占满，不要随便 kill 别人的进程。确认是自己的残留进程后，再处理。很多时候显存没释放，是因为之前的 notebook 或训练进程还挂着。

## 文件同步和结果备份

另一个容易忽视的问题是文件同步。代码可以用 Git 管，但数据、日志、模型权重通常不会直接提交。我现在会把目录分清楚：`src/` 放代码，`configs/` 放配置，`logs/` 放日志，`checkpoints/` 放模型，避免训练几次后项目根目录变成垃圾场。

```bash
project/
  src/
  configs/
  logs/
  checkpoints/
  data/
```

重要的实验结果要及时下载或同步。服务器不是永远可靠的，队列任务、磁盘清理、误删文件都有可能发生。工程上的“安全感”，很多时候来自朴素的备份习惯。

## 配置文件比命令行参数更适合复现实验

当参数越来越多时，一长串命令很难复现。我更喜欢把参数写成 yaml 或 json，再让训练脚本读取配置。这样每次实验都能保存一份完整配置，后面看到某个 checkpoint 时，也知道它是怎么训练出来的。

## 我的服务器训练最小工作流

1.  SSH 登录服务器。
2.  进入项目目录，激活 conda 环境。
3.  用 tmux 创建训练会话。
4.  检查 GPU 状态。
5.  运行训练，并把日志写入文件。
6.  定期查看日志和显存，不直接盯终端发呆。

服务器环境一开始很像黑盒，但把这些工具串起来之后，它就变成了一个稳定的实验平台。工程能力很多时候不是写更复杂的模型，而是让模型在正确的环境里可靠地跑完。
