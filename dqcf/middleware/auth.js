const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

async function requireAdmin(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(503).json({ message: '服务器尚未配置 JWT_SECRET' });
  }

  try {
    const authorization = req.header('Authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) return res.status(401).json({ message: '请先登录' });

    const decoded = jwt.verify(token, secret);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: '无效的身份验证' });

    req.admin = admin;
    return next();
  } catch {
    return res.status(401).json({ message: '请先登录' });
  }
}

module.exports = { requireAdmin };
