const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Comment = require('../models/Comment');

// 获取所有显示状态的留言
router.get('/public', async (req, res) => {
  try {
    const messages = await Message.find({ status: '显示' }).sort('-createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取置顶留言
router.get('/pinned', async (req, res) => {
  try {
    const pinnedMessage = await Message.findOne({ isPinned: true, status: '显示' });
    if (!pinnedMessage) {
      return res.status(404).json({ message: '没有置顶留言' });
    }
    res.json(pinnedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取单个留言及其评论
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: '找不到该留言' });
    }
    
    // 获取该留言的所有显示状态的评论
    const comments = await Comment.find({ 
      messageId: message._id,
      status: '显示'
    }).sort('-likes');
    
    res.json({ message, comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 提交新留言
router.post('/', async (req, res) => {
  // 验证请求数据
  if (!req.body.author || !req.body.content) {
    return res.status(400).json({ message: '作者和内容不能为空' });
  }
  
  const message = new Message({
    author: req.body.author,
    content: req.body.content
  });

  try {
    const newMessage = await message.save();
    res.status(201).json({
      message: newMessage,
      info: '留言已提交，等待管理员审核'
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 点赞留言
router.post('/:id/like', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: '找不到该留言' });
    }
    
    message.likes += 1;
    await message.save();
    
    res.json({ likes: message.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 管理员获取所有留言（包括未审核和不显示的）
router.get('/admin/all', async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 管理员按状态获取留言
router.get('/admin/status/:status', async (req, res) => {
  try {
    const messages = await Message.find({ status: req.params.status }).sort('-createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 管理员更新留言状态
router.patch('/admin/:id/status', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: '找不到该留言' });
    }
    
    if (!['显示', '不显示', '未审核'].includes(req.body.status)) {
      return res.status(400).json({ message: '无效的状态值' });
    }
    
    message.status = req.body.status;
    message.updatedAt = Date.now();
    
    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 管理员设置/取消置顶留言
router.patch('/admin/:id/pin', async (req, res) => {
  try {
    // 先将所有留言设为非置顶
    if (req.body.isPinned) {
      await Message.updateMany({}, { isPinned: false });
    }
    
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: '找不到该留言' });
    }
    
    message.isPinned = req.body.isPinned;
    message.updatedAt = Date.now();
    
    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 管理员删除留言
router.delete('/admin/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: '找不到该留言' });
    }
    
    // 同时删除该留言下的所有评论
    await Comment.deleteMany({ messageId: message._id });
    
    await message.deleteOne();
    res.json({ message: '留言及其评论已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;