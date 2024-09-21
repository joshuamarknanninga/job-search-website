// services/jobService.js
const axios = require('axios');
const Job = require('../models/Job');

const fetchJobs = async () => {
  try {
    const response = await axios.get('https://jobs.github.com/positions.json?description=javascript');
    const jobs = response.data.map(job => ({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      url: job.url,
    }));
    // Save to DB
    await Job.insertMany(jobs, { ordered: false });
    console.log('Jobs fetched and saved');
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
  }
};

module.exports = fetchJobs;
