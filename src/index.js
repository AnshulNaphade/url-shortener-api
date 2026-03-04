const express = require('express');
const dotenv = require('dotenv');
const prisma = require('./utils/prisma');
const authController = require('./controllers/authController');
const urlController = require('./controllers/urlController');
const { requireAuth } = require('./middleware/auth');

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

app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
// URL routes
app.post('/urls', requireAuth, urlController.createShortUrl);
app.get('/urls/:shortCode/analytics', requireAuth, urlController.getAnalytics);
app.get('/:shortCode', urlController.redirect);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});