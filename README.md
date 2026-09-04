# Fangwenky · Personal Homepage

> 一个 AI 本科生的个人作品集与学习笔记：双语（中文 / 英文）静态站 + 本地 Markdown 内容管理后台 + GitHub Pages / VPS 自动化发布。

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-222?logo=githubpages&logoColor=white)](https://fangwenky.github.io/mypage/)
[![Node](https://img.shields.io/badge/Node-%E2%89%A522.12-339933?logo=node.js&logoColor=white)](tools/mypage-admin/package.json)
[![Markdown](https://img.shields.io/badge/Content-Markdown-000?logo=markdown&logoColor=white)](mypage/content/articles)
[![License](https://img.shields.io/badge/Use-Personal%20Portfolio-blue)](#)

仓库地址：[`Fangwenky/Fangwenky.github.io`](https://github.com/Fangwenky/Fangwenky.github.io)
线上站点：[fangwenky.github.io/mypage](https://fangwenky.github.io/mypage/)
备用站点：<https://fangwenky.dpdns.org>

---

## ✨ 项目亮点

- 🖥️ **零依赖静态站**：`mypage/` 目录是纯 HTML/CSS/JS 的双语作品集，托管在 GitHub Pages，可直接 fork 复用。
- ✍️ **Markdown 写作流**：所有文章和项目都以 `index.zh.md` / `index.en.md` 形式存放在源码里，Frontmatter + Markdown，正文与样式彻底解耦。
- 🛠️ **本地内容工作台**：`tools/mypage-admin` 是一个基于 Node.js + Express 的本地后台，支持草稿、双语元信息、图片上传、文件夹导入、预览、静态数据生成与 Git 发布。
- 🚀 **一键发布到 GitHub 与 VPS**："准备发布"流程会自动生成数据 → 内容审计 → 显示 Git 差异 → 推送 `origin/main` → VPS 部署，全程使用 hash 校验、心跳锁与多版本回滚，避免夹带本地草稿。
- 🔐 **本地优先 / 默认安全**：后台仅监听 `127.0.0.1`，启动时附带一次性 session token；纯草稿永远停留在本地，不会被自动推送到公开仓库。

---

## 📑 目录

1. [项目结构](#-项目结构)
2. [快速开始](#-快速开始)
3. [静态站本地预览](#-静态站本地预览)
4. [内容工作台（mypage-admin）](#-内容工作台mypage-admin)
5. [文章与项目格式](#-文章与项目格式)
6. [文件夹导入](#-文件夹导入)
7. [发布与部署](#-发布与部署)
8. [常用脚本](#-常用脚本)
9. [注意事项与约定](#-注意事项与约定)

---

## 🗂️ 项目结构

```text
.
├── mypage/                       # 静态个人主页（GitHub Pages 实际托管的目录）
│   ├── index.html                # 首页（作品集）
│   ├── articles.html             # 文章列表
│   ├── article-detail.html       # 文章详情
│   ├── projects.html             # 项目列表
│   ├── project-detail.html       # 项目详情
│   ├── archive.html              # 归档
│   ├── about.html                # 关于我
│   ├── search.html               # 搜索
│   ├── style.css / script.js     # 全站样式与脚本
│   ├── content/                  # Markdown 源文件
│   │   ├── articles/<article-id>/# 每篇文章一个目录，含 index.zh.md / index.en.md
│   │   └── projects/<project-id>/# 项目源文件
│   ├── data/                     # 由后台生成的静态数据（articlesData.js 等）
│   └── images/                   # 全站图片资源
├── tools/mypage-admin/           # 本地 Node.js 内容管理后台
│   ├── src/                      # Express 服务、解析器、Git / 部署服务
│   ├── scripts/                  # generate / migrate / audit 等命令行脚本
│   ├── public/                   # 后台前端静态资源
│   └── test/                     # node:test 测试
├── ai-doodle/                    # 另一个独立小项目：浏览器端 AI 涂鸦 demo
├── dqcf/                         # 另一个独立项目：词汇记忆 Web App
├── start-mypage-admin.command    # macOS 一键启动后台的脚本
└── README.md
```

> `docs/`、`dogfood-output/`、`.claude/`、`claude/` 等目录是个人本地笔记或 agent 输出，已通过 `.gitignore` 忽略，不会进入公开仓库。

---

## 🚀 快速开始

### 0. 环境要求

| 工具       | 版本        | 用途                                         |
| ---------- | ----------- | -------------------------------------------- |
| Node.js    | ≥ 22.12.0   | 启动 `mypage-admin` 后台                     |
| npm        | 随 Node 安装 | 安装后台依赖                                 |
| Git        | 任意较新版本 | 拉取与推送代码                               |
| Python 3   | 任意较新版本 | 可选：用于本地静态预览                       |
| `ssh`/`scp`/`tar` | 系统自带 | 可选：仅 VPS 部署时需要，缺失时仍可本地编辑 |

### 1. 一键启动后台（macOS 推荐）

在仓库根目录**双击** `start-mypage-admin.command`，启动器会：

1. 检查 Node.js 版本（要求 ≥ 22.12）；
2. 按需执行 `npm ci` 安装后台依赖；
3. 启动一个只监听 `127.0.0.1` 的本地后台；
4. 自动打开带一次性 session token 的浏览器页面。

> 编辑期间**保持终端窗口打开**，按 `Control-C` 停止后台。重复双击会重新打开已在运行的后台，不会重复占用端口。

### 2. 手动启动后台

```bash
cd tools/mypage-admin
npm ci
npm run dev
```

启动后终端会输出类似：

```text
mypage admin: http://127.0.0.1:8787/?token=xxxxxxxx
session token: xxxxxxxx
```

打开带 `token` 的地址即可进入后台。也可附加 `--open` 自动打开浏览器：

```bash
npm run dev -- --open
```

---

## 🖥️ 静态站本地预览

后台启动后可直接在浏览器里访问 `index.html`，但如果你只想**预览静态站**，可以单独跑一个本地服务：

```bash
cd mypage
python3 -m http.server 8123
# 然后访问 http://127.0.0.1:8123/index.html
```

> 建议先在后台运行 `npm run generate` 生成最新的 `data/*.js`，再预览，以避免看到陈旧的静态数据。

---

## 🛠️ 内容工作台（mypage-admin）

后台是一个本地 Web 应用，所有数据落在工作区文件里，几乎所有操作都可从 UI 完成，也可以命令行触发。

主要功能：

- 📝 **Markdown 编辑器**：支持双语同步编辑、分屏预览。
- 🏷️ **双语元信息**：中文为必填正稿；英文可只填元信息（标题、摘要、标签），由后台区分「EN 元信息」与「EN 正文」。
- 🖼️ **图片 / 附件上传**：PNG / JPG / WebP / GIF；附件额外支持 PDF、Office、压缩包、音视频、TXT、CSV，单文件 ≤ 25 MB，整个文件夹 ≤ 100 MB。**不接受 HTML / JS / SVG 附件**（避免同源脚本风险）。
- 📥 **文件夹导入**：选中一个文件夹即可批量导入文章或项目。
- 👁️ **预览**：内置 HTML 预览，所见即所得。
- 🧪 **草稿恢复**：浏览器每 2 秒持久化未保存的恢复稿，但**不会自动改源码**。
- 🚦 **静态数据生成 & 内容审计**：`"生成静态数据"` 后自动校验路径一致性与 Frontmatter。
- 🚀 **准备发布 & 一键推送**："准备发布" 会先预览准确的 Git 差异，再决定是否 commit + push 到 `origin/main`。

后台默认只监听 `127.0.0.1`，**不会暴露到公网**；session token 也只在本地通过 URL 参数注入。

---

## 📚 文章与项目格式

### 文章

每篇文章一个目录：

```text
mypage/content/articles/<article-id>/
  ├── index.zh.md      # 中文正文（必填）
  ├── index.en.md      # 英文正文（可选）
  └── assets/          # 文章专属图片与附件
```

Frontmatter 固定字段：

```yaml
id: article-id
title: 标题
excerpt: 摘要
date: '2026-05-16'
tags:
  - 人工智能
category: 学习笔记
cover: images/example-cover.svg
readTime: 8 分钟阅读
status: published       # draft / published
featured: false
updatedAt: '2026-05-25T00:00:00.000Z'
```

### 项目

项目使用类似结构，放在 `mypage/content/projects/<project-id>/`，可在 Frontmatter 提供 `title`、`description`、`image`/`cover`、`link`、`tags` 等字段。

### 通用约定

- **ID 必须 `kebab-case`**，且**目录名、Frontmatter `id`、生成数据、英文翻译 key 四者保持一致**。
- **图片路径**相对文章目录写，生成阶段会被改写为站点相对路径（如 `images/xxx.png`）。
- **不要手动编辑 `mypage/data/*.js`**，这些文件由 `npm run generate` 重新生成。

---

## 📥 文件夹导入

在文章库或项目库顶部点击 **"导入"**，选择一个文件夹即可。后台支持以下布局：

```text
任意文件夹名/
  任意名称.md        # 顶层只能有 1 个 Markdown
  图片和附件/        # 其他文件必须全部放这里
    cover.png
    reference.pdf
```

- Markdown 内部继续使用相对路径，例如：

  ```markdown
  ![封面](<图片和附件/cover.png>)
  [下载附件](图片和附件/reference.pdf)
  ```

  后台会复制附件并自动改写为网站路径。
- 可在 Frontmatter 中提供 `id`、`title`、`excerpt`/`description`、`date`、`tags`、`category`、`cover`/`image`、`link` 等；缺省字段会从文件名、一级标题和首段推断。
- **导入文章会创建为本地草稿**，**导入项目会写入本地项目源码**，两者都**不会自动发布**。
- 如果文件夹没有图片，会暂时使用头像作为封面，导入后可在编辑器中更换。

---

## 🚀 发布与部署

### 后台内的发布流程（推荐）

1. **启动后台**：`start-mypage-admin.command` 或 `npm run dev`。
2. **新建 / 编辑文章** → 先点 **"保存到源码"**（只写 Markdown，不自动 push）。
3. **点击 "生成静态数据"** → 重新生成 `mypage/data/*.js`，前台立即可预览。
4. **点击 "准备发布"** → 后台会自动：生成数据 → 内容审计 → 在 UI 上展示**准确的 Git 差异**。
5. **确认无误后** → 点 **"发布并推送"** → 自动 commit + push 到 `origin/main`，再触发 VPS 部署。

### 发布前置条件（硬约束）

- 当前分支必须是 `main`；
- 本地与 `origin/main` 同步；
- 没有历史待推送提交；
- 暂存区为空；
- **无关的未暂存 / 未跟踪文件不会阻止文章发布，也不会被后台提交**。

> 后台工具本身的改动需要手动提交，不会随文章发布一起 push。

### VPS 部署安全机制

部署不是简单的 `scp` 覆盖，而是 **Git 快照 + 多重校验**：

- **Git 快照**：VPS 部署只读取**刚刚推送的 Git 提交**，不直接上传工作区，避免夹带本地草稿或未跟踪文件。
- **跨进程部署锁**：使用带心跳的锁 + 唯一 release 名，防止并发部署打架；超过 15 分钟无心跳的锁会被下一次任务接管。
- **单一压缩包 + 哈希校验**：先打包为单一 tar 归档，禁用 macOS 扩展属性；VPS 解压后清理 AppleDouble `._*` 元数据，再验证哈希。
- **文件树稳定等待**：验证压缩包哈希后，等待文件树哈希稳定；若不一致会重新解压，最终失败时报告具体缺失 / 多余 / 变化的文件。
- **失败回滚**：切换前失败会自动删除半成品 release；公网验证成功后默认**只保留当前版本和最近 4 个历史版本**。
- **完整验证后才切换**：仅当哈希、权限与公网 manifest 三者全部通过后才完成切换。

### VPS 参数（环境变量覆盖）

```bash
MYPAGE_DEPLOY_HOST=root@107.175.115.136
MYPAGE_DEPLOY_ROOT=/var/www/fangwenky-home
MYPAGE_DEPLOY_URL=https://fangwenky.dpdns.org
MYPAGE_GITHUB_PAGES_URL=https://fangwenky.github.io/mypage
MYPAGE_DEPLOY_KEEP_RELEASES=5
```

---

## 🧪 常用脚本

在 `tools/mypage-admin/` 下：

| 命令                  | 作用                                                         |
| --------------------- | ------------------------------------------------------------ |
| `npm run dev`         | 启动本地后台（监听 127.0.0.1:8787）                          |
| `npm run migrate`     | **一次性**：从旧 `articlesData.js` 迁移到 Markdown 目录       |
| `npm run generate`    | 从 Markdown 重新生成 `mypage/data/*.js` 静态数据             |
| `npm run audit`       | 检查文章 / 项目数据、生成结果、图片路径一致性                |
| `npm test`            | 运行 node:test 单元测试                                       |
| `npm run check`       | 对后台源码与生成脚本做语法检查，并跑测试 + audit              |

---

## ⚠️ 注意事项与约定

- 🚫 `npm run migrate` 是**一次性**迁移脚本。文章已经迁到 Markdown 后，**不要再日常运行**，以免覆盖手工编辑。
- 🆔 文章 ID 一律使用 `kebab-case`，并保证目录名、Frontmatter `id`、生成数据、英文翻译 key **四者一致**。
- 🌐 英文文件可以**只包含标题、摘要、标签等元信息**；后台会区分「EN 元信息」与「EN 正文」。
- 🖼️ 上传图片仅允许 **PNG / JPG / WebP / GIF**；**SVG** 作为全站资源可以**手动维护**，但不通过后台上传。
- 📦 后台 "保存到源码" 只写 Markdown；**草稿永远只在本地**，不会被自动推到公开仓库。
- 🔒 后台默认仅监听 `127.0.0.1`，**仅本机可访问**，避免误部署到公网。

---

## 🤝 致谢与说明

- 站点的样式与交互大量使用 [Font Awesome](https://fontawesome.com)、[IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)、[Nunito](https://fonts.google.com/specimen/Nunito) 等开源字体与图标。
- 文章内容均为本人学习笔记，欢迎通过 Issue / PR 指出错误或补充。
- 仓库中 `ai-doodle/`、`dqcf/` 是作者另两个独立的小项目，仅作归档展示，与本主页的发布流程相互独立。

如果你喜欢这个项目，欢迎 ⭐️ Star 支持一下。