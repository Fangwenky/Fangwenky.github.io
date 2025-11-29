const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Message = require('../models/Message');

// 获取特定留言的所有显示状态的评论
router.get('/message/:messageId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      messageId: req.params.messageId,
      status: '显示'
    }).sort('-likes');
    
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 提交新评论
router.post('/', async (req, res) => {
  // 验证请求数据
  if (!req.body.author || !req.body.content || !req.body.messageId) {
    return res.status(400).json({ message: '作者、内容和留言ID不能为空' });
  }
  
  try {
    // 检查留言是否存在
    const message = await Message.findById(req.body.messageId);
    if (!message) {
      return res.status(404).json({ message: '找不到该留言' });
    }
    
    const comment = new Comment({
      messageId: req.body.messageId,
      author: req.body.author,
      content: req.body.content
    });

    const newComment = await comment.save();
    res.status(201).json({
      comment: newComment,
      info: '评论已提交，等待管理员审核'
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 点赞评论
router.post('/:id/like', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: '找不到该评论' });
    }
    
    comment.likes += 1;
    await comment.save();
    
    res.json({ likes: comment.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 管理员获取所有评论
router.get('/admin/all', async (req, res) => {
  try {
    const comments = await Comment.find().populate('messageId').sort('-createdAt');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 管理员按状态获取评论
router.get('/admin/status/:status', async (req, res) => {
  try {
    const comments = await Comment.find({ status: req.params.status }).populate('messageId').sort('-createdAt');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 管理员更新评论状态
router.patch('/admin/:id/status', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: '找不到该评论' });
    }
    
    if (!['显示', '不显示', '未审核'].includes(req.body.status)) {
      return res.status(400).json({ message: '无效的状态值' });
    }
    
    comment.status = req.body.status;
    comment.updatedAt = Date.now();
    
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 管理员删除评论
router.delete('/admin/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: '找不到该评论' });
    }
    
    await comment.deleteOne();
    res.json({ message: '评论已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;