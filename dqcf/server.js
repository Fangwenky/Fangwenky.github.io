const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();
const configuredOrigins = String(process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// 中间件
app.use(cors({
  origin(origin, callback) {
    if (!origin || configuredOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100kb' }));

// 不将服务端源码或依赖目录作为静态资源暴露。
app.use(/^\/(?:routes|models|middleware|node_modules)(?:\/|$)|^\/(?:server|seed)\.js$|^\/package(?:-lock)?\.json$/, (req, res) => {
  res.status(404).end();
});

// 静态文件服务
app.use(express.static(path.join(__dirname), { dotfiles: 'deny' }));

// 连接MongoDB数据库
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dqcf_memorial', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB连接成功'))
.catch(err => console.error('MongoDB连接失败:', err));

// 导入路由
const provinceRoutes = require('./routes/provinces');
const classmateRoutes = require('./routes/classmates');
const messageRoutes = require('./routes/messages');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');

// 使用路由
app.use('/api/provinces', provinceRoutes);
app.use('/api/classmates', classmateRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// 前端路由处理
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
