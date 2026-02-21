const express = require('express');
const dotenv = require('dotenv');
const prisma = require('./utils/prisma');

dotenv.config();

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.get('/test-db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ 
      message: 'Database connected successfully',
      userCount: userCount 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});