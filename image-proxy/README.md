Image Proxy (HEIC → JPEG)
=================================

This small Express service fetches images from Google Drive by file ID, converts HEIC/HEIF to JPEG using `sharp`, resizes optionally, caches results, and serves a stable JPEG URL that works in browsers.

Usage
-----

1. Install dependencies:

```bash
cd image-proxy
npm install
```

2. Run locally:

```bash
npm start
# service will run on http://localhost:3333
```

3. Example URL (in your frontend):

```
http://localhost:3333/image?id=<DRIVE_FILE_ID>&w=1200
```

Deployment
----------
- Deploy to any Node hosting (Vercel Serverless function, Render, Heroku). For serverless, you may need to adapt to the platform's function signature.
- Make sure to set `NODE_ENV=production` and expose the service port.

Frontend changes
----------------
- Replace Drive image URLs in `app/media.tsx` with proxy URLs like `https://<your-proxy>/image?id=${id}&w=1200`.
- The proxy will dynamically convert HEIC to JPEG so your site will render images without manual conversion.

Notes
-----
- The Drive file must be shared to allow the proxy to fetch it ("Anyone with the link can view").
- For production, add persistent disk caching (S3) or increase LRU cache TTL.
