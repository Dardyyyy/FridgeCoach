export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return res.status(500).json({ error: 'No Unsplash key configured' });

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&client_id=${key}`;
    const r = await fetch(url);
    const data = await r.json();
    return res.status(200).json(data);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
