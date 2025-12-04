export default async function handler(req, res) {
  try {
    const token = process.env.TREFLE_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'Server token missing: set TREFLE_TOKEN in Vercel Environment Variables.' });
    }

    // path segments after /api/trefle/
    const { path } = req.query; // array of segments or string
    const endpoint = Array.isArray(path) ? path.join('/') : (path || '');

    // preserve query string from original request
    const qsIndex = req.url.indexOf('?');
    const qs = qsIndex !== -1 ? req.url.substring(qsIndex) : '';

    const url = `https://trefle.io/api/v1/${endpoint}${qs}`;

    const method = req.method || 'GET';
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const init = { method, headers };
    if (method !== 'GET' && req.body) {
      init.body = JSON.stringify(req.body);
    }

    const rsp = await fetch(url, init);
    const text = await rsp.text();

    // forward status and body; default to JSON content type
    res.status(rsp.status).setHeader('Content-Type', rsp.headers.get('content-type') || 'application/json').send(text);
  } catch (err) {
    console.error('Vercel proxy error:', err);
    res.status(500).json({ error: 'Proxy failed', details: err?.message });
  }
}
