// models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  url: { type: String, required: true },
  datePosted: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', JobSchema);
