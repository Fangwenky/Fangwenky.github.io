# 个人博客项目

一个功能完整的个人博客系统，包含前后端分离架构，支持文章管理、个人简介、时间线归档和评论功能。

## 功能特性

- 📝 文章管理（创建、编辑、发布）
- 👤 个人资料管理
- 📅 时间线归档
- 💬 Gitalk 评论系统
- 🔐 用户登录认证
- 🎨 精美响应式界面
- 📱 移动端适配

## 技术栈

### 后端
- Node.js + Express
- MongoDB + Mongoose
- JWT 认证
- 文件上传（Multer）

### 前端
- React + TypeScript
- React Router
- Axios
- Gitalk 评论组件
- 响应式 CSS

## 项目结构

```
blog_page/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   └── server.js       # 服务器入口
│   ├── package.json
│   └── .env.example
├── frontend/               # 前端应用
│   ├── public/
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/         # 页面
│   │   ├── styles/        # 样式
│   │   └── utils/         # 工具
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 快速开始

### 1. 环境准备

确保已安装 Node.js (v14+) 和 MongoDB。

### 2. 安装依赖

```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

### 3. 环境配置

#### 后端配置

复制后端环境配置文件：

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

#### 前端配置

复制前端环境配置文件：

```bash
cd frontend
cp .env.example .env
```

编辑 `.env` 文件，配置 Gitalk 相关参数：

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
REACT_APP_GITHUB_CLIENT_SECRET=your-github-client-secret
REACT_APP_GITHUB_REPO=your-repo-name
REACT_APP_GITHUB_OWNER=your-github-username
```

### 4. 启动服务

启动 MongoDB 服务后，分别启动前后端：

```bash
# 启动后端 (在 backend 目录)
npm run dev

# 启动前端 (在 frontend 目录)
npm start
```

### 5. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:5000

## Gitalk 配置

为了使用评论功能，需要配置 GitHub OAuth 应用：

1. 在 GitHub 上创建 OAuth 应用
2. 获取 Client ID 和 Client Secret
3. 在前端 `.env` 文件中配置相关信息
4. 确保 GitHub 仓库的设置允许 Issues

## API 接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 文章接口
- `GET /api/posts` - 获取文章列表
- `GET /api/posts/:id` - 获取单篇文章
- `POST /api/posts` - 创建文章（需认证）
- `PUT /api/posts/:id` - 更新文章（需认证）
- `DELETE /api/posts/:id` - 删除文章（需认证）
- `GET /api/posts/archive` - 获取归档数据

### 个人资料接口
- `GET /api/profile` - 获取个人资料
- `PUT /api/profile` - 更新个人资料（需认证）

## 部署

### 后端部署

可以使用 PM2、Docker 或云服务部署后端。

### 前端部署

构建生产版本：

```bash
cd frontend
npm run build
```

将 `build` 目录部署到静态文件服务器。

## 开发说明

- 后端 API 遵循 RESTful 设计
- 前端使用 TypeScript 确保类型安全
- 所有页面都支持响应式设计
- 使用 JWT 进行用户认证
- 支持文章的草稿和发布状态

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License