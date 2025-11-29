const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, category, published = true } = req.query;
    const query = { published: published === 'true' };
    
    if (tag) query.tags = tag;
    if (category) query.category = category;
    
    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Post.countDocuments(query);
    
    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/archive', async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .select('title createdAt')
      .sort({ createdAt: -1 });
    
    const archive = {};
    posts.forEach(post => {
      const year = post.createdAt.getFullYear();
      const month = post.createdAt.getMonth(); + 1;
      const key = `${year}年${month}月`;
      
      if (!archive[key]) {
        archive[key] = [];
      }
      archive[key].push({
        title: post.title,
        date: post.createdAt,
      });
    });
    
    res.json(archive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (!post.published) {
      return res.status(403).json({ message: 'Post not published' });
    }
    
    post.viewCount += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, tags, category, published } = req.body;
    
    const post = new Post({
      title,
      content,
      excerpt,
      tags,
      category,
      published,
      author: req.user.userId,
    });
    
    await post.save();
    await post.populate('author', 'username');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { title, content, excerpt, tags, category, published } = req.body;
    
    Object.assign(post, { title, content, excerpt, tags, category, published });
    await post.save();
    await post.populate('author', 'username');
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;