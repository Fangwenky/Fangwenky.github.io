const express = require('express');
const router = express.Router();
const Province = require('../models/Province');

// 获取所有省份
router.get('/', async (req, res) => {
  try {
    const provinces = await Province.find().sort('name');
    res.json(provinces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取单个省份
router.get('/:id', async (req, res) => {
  try {
    const province = await Province.findById(req.params.id);
    if (!province) {
      return res.status(404).json({ message: '找不到该省份' });
    }
    res.json(province);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 创建新省份
router.post('/', async (req, res) => {
  const province = new Province({
    name: req.body.name,
    englishName: req.body.englishName,
    description: req.body.description,
    position: req.body.position
  });

  try {
    const newProvince = await province.save();
    res.status(201).json(newProvince);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 更新省份
router.patch('/:id', async (req, res) => {
  try {
    const province = await Province.findById(req.params.id);
    if (!province) {
      return res.status(404).json({ message: '找不到该省份' });
    }
    
    if (req.body.name) province.name = req.body.name;
    if (req.body.englishName) province.englishName = req.body.englishName;
    if (req.body.description) province.description = req.body.description;
    if (req.body.position) province.position = req.body.position;
    province.updatedAt = Date.now();
    
    const updatedProvince = await province.save();
    res.json(updatedProvince);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 删除省份
router.delete('/:id', async (req, res) => {
  try {
    const province = await Province.findById(req.params.id);
    if (!province) {
      return res.status(404).json({ message: '找不到该省份' });
    }
    
    await province.remove();
    res.json({ message: '省份已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;