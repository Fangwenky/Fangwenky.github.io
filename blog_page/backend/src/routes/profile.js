const express = require('express');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const profileData = req.body;
    
    let profile = await Profile.findOne();
    if (profile) {
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      profile = new Profile(profileData);
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    const profileData = req.body;
    Object.assign(profile, profileData);
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;