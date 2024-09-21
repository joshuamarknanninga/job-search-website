// routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ datePosted: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific job by ID
router.get('/:id', getJob, (req, res) => {
  res.json(res.job);
});

// Middleware to get job by ID
async function getJob(req, res, next) {
  let job;
  try {
    job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.job = job;
  next();
}

module.exports = router;
