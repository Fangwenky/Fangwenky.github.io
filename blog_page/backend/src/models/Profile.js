const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  avatar: { type: String },
  email: { type: String },
  github: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  website: { type: String },
  location: { type: String },
  skills: [{ type: String }],
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String,
  }],
  education: [{
    school: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);