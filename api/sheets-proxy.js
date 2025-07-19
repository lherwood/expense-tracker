// /api/sheets-proxy.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, sheetId, values } = req.body;

  if (!apiKey || !sheetId || !values) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A2:F2:append?valueInputOption=RAW&key=${apiKey}`;

  const googleRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [values] }),
  });

  const data = await googleRes.json();

  if (!googleRes.ok) {
    return res.status(googleRes.status).json({ error: data.error || 'Google Sheets error' });
  }

  return res.status(200).json({ success: true, data });
}
