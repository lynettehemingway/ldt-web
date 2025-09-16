const sharp = require('sharp');

// Simple in-memory cache (may persist across warm lambda instances)
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

function cacheKey(id, width) {
  return `${id}::${width}`;
}

module.exports = async (req, res) => {
  try {
    const id = req.query.id || req.url && new URL('http://a'+req.url).searchParams.get('id');
    const width = parseInt(req.query.w || req.url && new URL('http://a'+req.url).searchParams.get('w') || '1600', 10);
    if (!id) return res.status(400).send('Missing id param');

    const key = cacheKey(id, width);
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && (now - cached.t) < CACHE_TTL) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.end(cached.buf);
    }

    // Candidate Drive URLs
    const candidates = [
      `https://drive.google.com/uc?export=download&id=${id}`,
      `https://drive.google.com/uc?export=view&id=${id}`,
      `https://lh3.googleusercontent.com/d/${id}`,
      `https://drive.google.com/thumbnail?id=${id}&sz=w2400`,
    ];

    let fetched = null;
    for (const u of candidates) {
      try {
        const r = await fetch(u, { method: 'GET' });
        if (!r.ok) continue;
        const ct = r.headers.get('content-type') || '';
        if (!ct.startsWith('image') && !ct.includes('heic') && !ct.includes('heif')) {
          // Some Drive endpoints return HTML redirect pages; still try to parse buffer
        }
        const buf = await r.arrayBuffer();
        fetched = Buffer.from(buf);
        break;
      } catch (e) {
        // try next candidate
      }
    }

    if (!fetched) return res.status(502).send('Failed to fetch file from Drive');

    // Convert with sharp (handles HEIC if libvips supports it on platform)
    let img = sharp(fetched).rotate();
    if (width && width > 0) img = img.resize({ width, withoutEnlargement: true });
    const out = await img.jpeg({ quality: 85 }).toBuffer();

    cache.set(key, { buf: out, t: Date.now() });

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.end(out);
  } catch (err) {
    console.error('image function error', err);
    res.status(500).send('Server error');
  }
};
