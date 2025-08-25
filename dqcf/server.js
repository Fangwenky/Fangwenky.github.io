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

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname)));

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