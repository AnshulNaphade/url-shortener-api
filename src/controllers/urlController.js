const { nanoid } = require('nanoid');
const prisma = require('../utils/prisma');

// CREATE SHORT URL
exports.createShortUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: 'longUrl is required' });
    }

    // Basic URL validation
    try {
      new URL(longUrl);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Generate unique short code
    const shortCode = nanoid(7);

    // Save to database
    const url = await prisma.url.create({
      data: {
        longUrl,
        shortCode,
        userId: req.user.userId
      }
    });

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    res.status(201).json({
      message: 'Short URL created',
      shortUrl,
      shortCode: url.shortCode,
      longUrl: url.longUrl
    });

  } catch (error) {
    console.error('Create URL error:', error);
    res.status(500).json({ error: 'Failed to create short URL' });
  }
};

// REDIRECT
exports.redirect = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await prisma.url.findUnique({
      where: { shortCode }
    });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Track the click
    await prisma.click.create({
      data: {
        urlId: url.id,
        userAgent: req.headers['user-agent'] || null
      }
    });

    // Redirect to the long URL
    res.redirect(url.longUrl);

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Redirect failed' });
  }
};

// ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await prisma.url.findUnique({
      where: { shortCode },
      include: {
        clicks: {
          orderBy: { clickedAt: 'desc' }
        }
      }
    });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Check if requesting user owns this URL
    if (url.userId !== req.user.userId) {
      return res.status(403).json({ error: 'You do not own this URL' });
    }

    res.json({
      shortCode: url.shortCode,
      longUrl: url.longUrl,
      totalClicks: url.clicks.length,
      createdAt: url.createdAt,
      recentClicks: url.clicks.slice(0, 10).map(click => ({
        clickedAt: click.clickedAt,
        userAgent: click.userAgent
      }))
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// LIST USER'S URLS
exports.getUserUrls = async (req, res) => {
  try {
    const urls = await prisma.url.findMany({
      where: { userId: req.user.userId },
      include: {
        _count: {
          select: { clicks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      count: urls.length,
      urls: urls.map(url => ({
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        longUrl: url.longUrl,
        clicks: url._count.clicks,
        createdAt: url.createdAt
      }))
    });

  } catch (error) {
    console.error('Get URLs error:', error);
    res.status(500).json({ error: 'Failed to fetch URLs' });
  }
};