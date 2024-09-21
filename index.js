// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const path = require('path');

const fetchJobs = require('./services/jobService'); // or require('./services/scrapeJobs')
const jobRoutes = require('./routes/jobs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Fallback to `index.html` for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send('Job Search API');
});

// routes/jobs.js (add query parameters for pagination)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, keyword } = req.query;
    const query = keyword ? { title: { $regex: keyword, $options: 'i' } } : {};

    const jobs = await Job.find(query)
      .sort({ datePosted: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Schedule job fetching
cron.schedule('0 0 * * *', () => {
  console.log('Fetching jobs...');
  fetchJobs(); // or scrapeJobs()
});

// Initial fetch
fetchJobs(); // or scrapeJobs()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
