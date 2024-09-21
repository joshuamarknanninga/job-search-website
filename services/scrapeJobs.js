// services/scrapeJobs.js
const axios = require('axios');
const cheerio = require('cheerio');
const Job = require('../models/Job');

const scrapeJobs = async () => {
  try {
    const response = await axios.get('https://stackoverflow.com/jobs?q=javascript');
    const html = response.data;
    const $ = cheerio.load(html);
    const jobs = [];

    $('.-job').each((i, elem) => {
      const title = $(elem).find('.fc-black-700').text().trim();
      const company = $(elem).find('.fc-black-500').text().trim();
      const location = $(elem).find('.fc-black-500 ~ .fc-black-500').text().trim();
      const url = 'https://stackoverflow.com' + $(elem).find('a').attr('href');
      
      jobs.push({ title, company, location, url });
    });

    // Save to DB
    await Job.insertMany(jobs, { ordered: false });
    console.log('Scraped and saved jobs');
  } catch (error) {
    console.error('Error scraping jobs:', error.message);
  }
};

module.exports = scrapeJobs;
