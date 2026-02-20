require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

console.log('Server starting...');
console.log('MongoDB URI:', process.env.MONGODB_ATLAS_URI ? 'Set' : 'Not set');

const mongoUri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

// Routes first, before MongoDB connection
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

// Connect to MongoDB asynchronously
console.log('Connecting to MongoDB...');
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✓ Connected to MongoDB');
}).catch(err => {
  console.error('⚠  MongoDB connection error (API still running):', err.message);
});
