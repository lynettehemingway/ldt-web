const express = require('express');
const fetch = require('node-fetch');
const sharp = require('sharp');
const morgan = require('morgan');
const crypto = require('crypto');
const LRU = require('lru-cache');

const app = express();
app.use(morgan('dev'));

// Simple in-memory cache for converted buffers (LRU)
const cache = new LRU({ max: 200, ttl: 1000 * 60 * 60 * 24 });

function cacheKey(id, opts) {
  return crypto.createHash('md5').update(id + JSON.stringify(opts)).digest('hex');
}

// GET /image?id=<driveId>&w=1200
app.get('/image', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send('Missing id param');

  const width = parseInt(req.query.w || '1600', 10);
  const key = cacheKey(id, { width });
  const cached = cache.get(key);
  if (cached) {
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(cached);
  }

  try {
    // Try Drive's direct download endpoint
    const urls = [
      `https://drive.google.com/uc?export=download&id=${id}`,
      `https://drive.google.com/uc?export=view&id=${id}`,
      `https://lh3.googleusercontent.com/d/${id}`,
    ];

    let resp = null;
    for (const u of urls) {
      try {
        resp = await fetch(u, { timeout: 15000 });
        if (resp.ok) break;
      } catch (e) {
        // try next
      }
    }

    if (!resp || !resp.ok) return res.status(502).send('Failed to fetch file from Drive');

    const buf = await resp.buffer();

    // Use sharp to convert to jpeg and resize if requested
    let img = sharp(buf).rotate();
    if (width) img = img.resize({ width, withoutEnlargement: true });
    const out = await img.jpeg({ quality: 85 }).toBuffer();

    cache.set(key, out);
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(out);
  } catch (err) {
    console.error(err);
    res.status(500).send('Conversion error');
  }
});

const port = process.env.PORT || 3333;
app.listen(port, () => console.log('Image proxy running on', port));
