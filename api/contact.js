export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://footprintforge.in');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body || {};
  const number = process.env.WA_NUMBER; // never exposed to client

  if (!number) return res.status(500).json({ error: 'Not configured' });

  const url = `https://wa.me/${number}${message ? '?text=' + encodeURIComponent(message) : ''}`;
  return res.status(200).json({ url });
}
