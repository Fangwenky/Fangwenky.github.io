const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// 中间件：验证管理员令牌
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: '请先登录' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ message: '无效的身份验证' });
    }
    
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: '请先登录' });
  }
};

// 管理员登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }
    
    // 查找管理员
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 验证密码
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 创建初始管理员账户（仅在没有管理员时使用）
router.post('/setup', async (req, res) => {
  try {
    // 检查是否已存在管理员
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(400).json({ message: '管理员账户已存在，无法创建初始账户' });
    }
    
    const { username, password } = req.body;
    
    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }
    
    // 创建管理员
    const admin = new Admin({
      username,
      password
    });
    
    await admin.save();
    
    res.status(201).json({ message: '初始管理员账户创建成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取当前管理员信息
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      id: req.admin._id,
      username: req.admin.username
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 修改管理员密码
router.patch('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 验证输入
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '当前密码和新密码不能为空' });
    }
    
    // 验证当前密码
    const isMatch = await req.admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: '当前密码错误' });
    }
    
    // 更新密码
    req.admin.password = newPassword;
    await req.admin.save();
    
    res.json({ message: '密码修改成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;