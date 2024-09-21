// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const path = require('path');
const cors = require('cors'); // Added CORS
const fetchJobs = require('./services/jobService'); // or require('./services/scrapeJobs')
const jobRoutes = require('./routes/jobs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Enable CORS if frontend is served from a different origin
app.use(cors({
  origin: 'http://localhost:3000', // Update this to your frontend's actual URL
  optionsSuccessStatus: 200
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/jobs', jobRoutes);

// Serve static files from frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Fallback to `index.html` for any other routes (should be after API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
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
