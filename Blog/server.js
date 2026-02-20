require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware - MUST be before routes
app.use(cors());
app.use(express.json());

// Basic routes FIRST
app.get('/', (req, res) => {
  res.json({
    message: 'Blog API Server',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Load routes
try {
  const authRoutes = require('./routes/auth');
  const postRoutes = require('./routes/posts');
  const commentRoutes = require('./routes/comments');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/posts', commentRoutes);
} catch (error) {
  console.error('Error loading routes:', error.message);
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// MongoDB Connection
const mongoUri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✓ Connected to MongoDB');
}).catch(err => {
  console.warn('⚠ MongoDB connection error:', err.message);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
});

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
