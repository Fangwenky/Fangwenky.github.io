# 大桥初复 - 同学录网站

这是一个基于Node.js和Express的同学录网站，用于展示同学信息、按省份分类浏览同学、留言互动等功能。

## 功能特点

- 按省份分类展示同学信息
- 中国地图交互式导航
- 留言墙功能，支持点赞和评论
- 后台管理系统，管理同学信息、留言和评论

## 技术栈

- 前端：HTML, CSS, JavaScript
- 后端：Node.js, Express
- 数据库：MongoDB
- 认证：JWT (JSON Web Token)

## 安装步骤

1. 克隆仓库

```bash
git clone <仓库地址>
cd dqcf
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

```bash
cp .env.example .env
```

然后编辑 `.env` 文件，填入你的MongoDB连接URI和JWT密钥。

4. 启动服务器

```bash
npm start
```

开发模式（使用nodemon自动重启）：

```bash
npm run dev
```

5. 访问网站

打开浏览器访问 `http://localhost:3000`

## 项目结构

```
├── models/             # 数据模型
│   ├── Admin.js        # 管理员模型
│   ├── Classmate.js    # 同学模型
│   ├── Comment.js      # 评论模型
│   ├── Message.js      # 留言模型
│   └── Province.js     # 省份模型
├── routes/             # API路由
│   ├── admin.js        # 管理员相关路由
│   ├── classmates.js   # 同学相关路由
│   ├── comments.js     # 评论相关路由
│   ├── messages.js     # 留言相关路由
│   └── provinces.js    # 省份相关路由
├── js/                 # 前端JavaScript
│   └── api.js          # 前端API调用
├── images/             # 图片资源
├── *.html              # 前端页面
├── server.js           # 服务器入口文件
├── package.json        # 项目依赖
└── .env                # 环境变量
```

## API接口

### 省份API

- `GET /api/provinces` - 获取所有省份
- `GET /api/provinces/:id` - 获取单个省份
- `POST /api/provinces` - 创建新省份 (需管理员权限)
- `PUT /api/provinces/:id` - 更新省份 (需管理员权限)
- `DELETE /api/provinces/:id` - 删除省份 (需管理员权限)

### 同学API

- `GET /api/classmates` - 获取所有同学
- `GET /api/classmates/province/:provinceId` - 获取特定省份的同学
- `GET /api/classmates/:id` - 获取单个同学
- `POST /api/classmates` - 创建新同学 (需管理员权限)
- `PUT /api/classmates/:id` - 更新同学 (需管理员权限)
- `DELETE /api/classmates/:id` - 删除同学 (需管理员权限)

### 留言API

- `GET /api/messages` - 获取所有显示状态的留言
- `GET /api/messages/pinned` - 获取置顶留言
- `GET /api/messages/:id` - 获取单个留言及其评论
- `POST /api/messages` - 提交新留言
- `POST /api/messages/:id/like` - 点赞留言

### 评论API

- `GET /api/comments/message/:messageId` - 获取特定留言的显示评论
- `POST /api/comments` - 提交新评论
- `POST /api/comments/:id/like` - 点赞评论

### 管理员API

- `POST /api/admin/login` - 管理员登录
- `GET /api/admin/me` - 获取当前管理员信息
- `PUT /api/admin/password` - 修改管理员密码

## 管理后台

访问 `/admin.html` 进入管理后台，可以管理省份、同学、留言和评论。

## 初始管理员账户

首次运行系统时，会自动创建一个默认管理员账户：

- 用户名：admin
- 密码：admin123

请在登录后立即修改默认密码。

## 许可证

[MIT](LICENSE)