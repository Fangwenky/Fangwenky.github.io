# mypage-admin

本地内容管理后台，用来维护 `mypage` 静态个人主页的文章和项目。

## 一键启动（macOS）

在仓库根目录双击 `start-mypage-admin.command`。启动器会检查 Node.js 22.12 或更高版本及其他本机命令、按需安装依赖、启动只监听 `127.0.0.1` 的后台，并自动打开带会话口令的浏览器页面。重复双击会重新打开正在运行的后台，不会再次占用端口。`ssh`、`scp` 和 `tar` 仅在发布时需要，缺少它们不会阻止本地编辑。

编辑期间保持终端窗口打开，按 `Control-C` 停止后台。

## 命令行启动

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

打开带 `token` 的地址即可进入后台。后台只监听 `127.0.0.1`，不会部署到公网。也可以使用 `npm run dev -- --open` 自动打开浏览器。

## 文章格式

每篇文章一个目录：

```text
mypage/content/articles/<article-id>/
  index.zh.md
  index.en.md
  assets/
```

中文正文必填，英文正文可选。Frontmatter 固定字段：

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
status: published
featured: false
updatedAt: '2026-05-25T00:00:00.000Z'
```

## 从文件夹导入

在文章库或项目库顶部点击“导入”，选择整个文件夹。文件夹格式为：

```text
任意文件夹名/
  任意名称.md
  图片和附件/
    cover.png
    reference.pdf
```

顶层必须只有一个 Markdown 文件，其他文件必须放进“图片和附件”。Markdown 中继续使用相对路径，例如 `![封面](<图片和附件/cover.png>)` 或 `[下载附件](图片和附件/reference.pdf)`；后台会复制附件并自动改写为网站路径。

导入文章会创建为本地草稿，导入项目会写入本地项目源码，两者都不会自动发布。Markdown 可用 YAML Frontmatter 提供 `id`、`title`、`excerpt` 或 `description`、`date`、`tags`、`category`、`cover` 或 `image`、`link` 等字段；缺少的字段会从文件名、一级标题和首段推断。若没有图片，会暂时使用头像作为封面，导入后可在编辑器中更换。

附件支持 PNG、JPG、WebP、GIF、PDF、Office 文档、压缩包、常见音视频、TXT 和 CSV，单文件不超过 25 MB，整个文件夹不超过 100 MB。为避免同源脚本风险，不接受 HTML、JavaScript 和 SVG 附件。

## 常用命令

```bash
npm run migrate   # 从旧 articlesData.js 迁移到 Markdown 目录
npm run generate  # 从 Markdown 重新生成静态数据
npm run audit     # 检查文章与项目数据、生成结果、图片路径一致性
npm run check     # 语法检查后台和生成脚本
npm run dev       # 启动本地后台
```

后台里的“保存到源码”只写 Markdown 文件。浏览器会每 2 秒保留未保存恢复稿，但不会自动改源码。

“准备发布”会先生成静态数据、运行内容审计并展示准确的 Git 差异；确认后才提交并推送 `origin/main`，随后部署 VPS。纯草稿只保留在本机，不会被提交到公开 GitHub 仓库。

VPS 部署始终从刚刚推送的 Git 提交创建只读快照，不直接上传仍可能变化的工作区，因此不会夹带本地草稿或未跟踪文件。上传使用带心跳的跨后台进程部署锁和唯一 release 名，并先打包为单一压缩包；打包时禁用 macOS 扩展属性，VPS 解压后还会清理 AppleDouble `._*` 元数据，防止系统附加文件污染目录哈希。VPS 验证压缩包哈希后才解压，随后等待完整文件树哈希稳定。若文件树仍不一致会重新解压，并在最终失败时报告缺失、多余或内容变化的具体文件。切换前失败会自动删除半成品 release；公网验证成功后默认只保留当前版本和最近 4 个历史版本。只有哈希、权限和公网 manifest 全部验证通过后才完成切换。部署进程异常退出后，超过 15 分钟且没有心跳的锁会被下一次任务安全接管。

发布前要求当前分支为 `main`、本地与 `origin/main` 同步、没有旧的待推送提交且暂存区为空。无关的未暂存或未跟踪文件不会阻止文章发布，也不会被后台提交。

VPS 参数可通过环境变量覆盖：

```bash
MYPAGE_DEPLOY_HOST=root@107.175.115.136
MYPAGE_DEPLOY_ROOT=/var/www/fangwenky-home
MYPAGE_DEPLOY_URL=https://fangwenky.dpdns.org
MYPAGE_GITHUB_PAGES_URL=https://fangwenky.github.io/mypage
MYPAGE_DEPLOY_KEEP_RELEASES=5
```

## 注意事项

- `npm run migrate` 是一次性迁移脚本。现有文章已经迁移到 Markdown 后，日常维护不要重复运行它，避免覆盖手工编辑。
- 文章 ID 统一使用 `kebab-case`，目录名、Frontmatter `id`、生成数据和英文翻译 key 必须一致。
- 英文文件可以只包含标题、摘要、标签等元信息；后台会区分“EN元信息”和“EN正文”。
- 上传图片仅允许 PNG、JPG、WebP、GIF。SVG 作为全站资源可以手动维护，但不通过后台上传。
- 发布内容只会 stage 文章源码、项目数据、项目专属附件、共享图片和生成后的静态数据，后台工具本身的改动需要手动提交。
