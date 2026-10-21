const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const listingRoutes = require('./routes/listingRoutes');
app.use('/api/listings', listingRoutes);

const inquiryRoutes = require('./routes/inquiryRoutes');
app.use('/api/inquiries', inquiryRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

// Healthcheck & Diagnostic Route
app.get('/', (req, res) => {
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'online',
    service: 'PG Finder API',
    database: dbStatus,
  });
});

app.get('/api/health', (req, res) => {
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    database: dbStatus,
  });
});

const PORT = process.env.PORT || 5000;

// Start Express server immediately so backend is always accessible
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Connect to MongoDB with graceful error reporting
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('[Error] MONGO_URI is missing in server/.env');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Database] MongoDB Atlas connected successfully.');
  } catch (err) {
    console.error('\n[Database Connection Error]');
    if (err.message && err.message.includes('authentication failed')) {
      console.error('>> Bad Auth: Database username or password in MONGO_URI is incorrect.');
      console.error('>> Check your MongoDB Atlas Dashboard -> Database Access -> Users & reset password.');
    } else {
      console.error('>> ' + err.message);
    }
    console.error('>> Server is still listening on port ' + PORT + ' for API requests.\n');
  }
};

connectDB();
