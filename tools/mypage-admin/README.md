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
npm run dev       # 启动本地后台
```

后台里的“保存草稿”只写 Markdown 文件；“发布并推送”会生成静态数据、提交并 push 当前 Git 分支。
