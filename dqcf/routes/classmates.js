const express = require('express');
const router = express.Router();
const Classmate = require('../models/Classmate');
const Province = require('../models/Province');
const multer = require('multer');
const path = require('path');

// 配置文件上传
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // 限制5MB
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('错误：只允许上传图片文件！');
    }
  }
});

// 获取所有同学
router.get('/', async (req, res) => {
  try {
    const classmates = await Classmate.find().populate('province');
    res.json(classmates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 按省份获取同学
router.get('/province/:provinceId', async (req, res) => {
  try {
    const classmates = await Classmate.find({ province: req.params.provinceId }).populate('province');
    res.json(classmates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取单个同学
router.get('/:id', async (req, res) => {
  try {
    const classmate = await Classmate.findById(req.params.id).populate('province');
    if (!classmate) {
      return res.status(404).json({ message: '找不到该同学' });
    }
    res.json(classmate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 创建新同学
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // 检查省份是否存在
    const province = await Province.findById(req.body.province);
    if (!province) {
      return res.status(404).json({ message: '找不到该省份' });
    }
    
    const classmate = new Classmate({
      name: req.body.name,
      province: req.body.province,
      school: req.body.school,
      major: req.body.major,
      imagePath: req.file ? `images/${req.file.filename}` : 'images/default.png'
    });

    const newClassmate = await classmate.save();
    res.status(201).json(newClassmate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 更新同学
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const classmate = await Classmate.findById(req.params.id);
    if (!classmate) {
      return res.status(404).json({ message: '找不到该同学' });
    }
    
    if (req.body.name) classmate.name = req.body.name;
    if (req.body.province) {
      // 检查省份是否存在
      const province = await Province.findById(req.body.province);
      if (!province) {
        return res.status(404).json({ message: '找不到该省份' });
      }
      classmate.province = req.body.province;
    }
    if (req.body.school) classmate.school = req.body.school;
    if (req.body.major) classmate.major = req.body.major;
    if (req.file) classmate.imagePath = `images/${req.file.filename}`;
    classmate.updatedAt = Date.now();
    
    const updatedClassmate = await classmate.save();
    res.json(updatedClassmate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 删除同学
router.delete('/:id', async (req, res) => {
  try {
    const classmate = await Classmate.findById(req.params.id);
    if (!classmate) {
      return res.status(404).json({ message: '找不到该同学' });
    }
    
    await classmate.deleteOne();
    res.json({ message: '同学信息已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;