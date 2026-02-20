require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.post('/api/auth/signup', (req, res) => {
  res.json({ message: 'Signup received', body: req.body });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
