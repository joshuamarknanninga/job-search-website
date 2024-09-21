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
