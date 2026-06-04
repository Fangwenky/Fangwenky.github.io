# mypage-admin

本地文章管理后台，用来维护 `mypage` 静态个人主页的文章内容。

## 启动

```bash
cd tools/mypage-admin
npm install
npm run dev
```

启动后终端会输出类似：

```text
mypage admin: http://127.0.0.1:8787/?token=xxxxxxxx
one-time token: xxxxxxxx
```

打开带 `token` 的地址即可进入后台。后台只监听 `127.0.0.1`，不会部署到公网。

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

## 常用命令

```bash
npm run migrate   # 从旧 articlesData.js 迁移到 Markdown 目录
npm run generate  # 从 Markdown 重新生成静态数据
npm run audit     # 检查文章源文件、生成数据、封面路径一致性
npm run check     # 语法检查后台和生成脚本
npm run dev       # 启动本地后台
```

后台里的“保存草稿”只写 Markdown 文件；“发布并推送”会生成静态数据、提交并 push 当前 Git 分支。

## 注意事项

- `npm run migrate` 是一次性迁移脚本。现有文章已经迁移到 Markdown 后，日常维护不要重复运行它，避免覆盖手工编辑。
- 文章 ID 统一使用 `kebab-case`，目录名、Frontmatter `id`、生成数据和英文翻译 key 必须一致。
- 英文文件可以只包含标题、摘要、标签等元信息；后台会区分“EN元信息”和“EN正文”。
- 上传图片仅允许 PNG、JPG、WebP、GIF。SVG 作为全站资源可以手动维护，但不通过后台上传。
- 发布文章只会 stage `mypage/content/articles` 和生成后的 `mypage/data/articlesData.js`、`mypage/data/i18nData.js`，后台工具本身的改动需要手动提交。
