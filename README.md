# Fangwenky.github.io

这是 Fangwenky 的 GitHub Pages 个人主页仓库，主要内容在 `mypage/` 目录中。

## 目录结构

```text
mypage/
  index.html                  # 首页
  articles.html               # 文章列表
  article-detail.html         # 文章详情页
  data/                       # 静态站运行时数据，由管理工具生成
  content/articles/           # Markdown 文章源文件
  images/                     # 全站图片资源
tools/mypage-admin/           # 本地文章管理后台
```

## 本地预览静态站

```bash
cd mypage
python3 -m http.server 8123
```

然后打开 `http://127.0.0.1:8123/index.html`。

## 文章管理后台

```bash
cd tools/mypage-admin
npm install
npm run dev
```

启动后终端会输出带一次性 token 的本地地址。后台支持 Markdown 编辑、双语元信息、图片上传、预览、生成静态数据和发布到当前 Git 分支。

## 文章发布流程

1. 在 `tools/mypage-admin` 中启动后台。
2. 新建或编辑文章，先保存草稿。
3. 点击“生成静态数据”检查前台展示。
4. 点击“发布并推送”提交并推送当前 Git 分支。

也可以手动生成静态数据：

```bash
cd tools/mypage-admin
npm run generate
npm run check
```
