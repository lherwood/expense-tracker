// /api/sheets-proxy.js

export default async function handler(req, res) {
  const { apiKey, sheetId } = req.body || req.query;

  if (!apiKey || !sheetId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (req.method === 'GET') {
    // Handle GET request for fetching expenses
    const { range } = req.query;
    const sheetRange = range || 'Sheet1!A2:F1000';
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${apiKey}`;
    
    const googleRes = await fetch(url);
    const data = await googleRes.json();

    if (!googleRes.ok) {
      return res.status(googleRes.status).json({ error: data.error || 'Google Sheets error' });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    // Handle POST request for adding expenses or headers
    const { values, action } = req.body;

    if (!values) {
      return res.status(400).json({ error: 'Missing values' });
    }

    let url;
    let body;

    if (action === 'addHeaders') {
      // Add headers to the first row
      url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:F1?valueInputOption=RAW&key=${apiKey}`;
      body = JSON.stringify({ values: [values] });
    } else {
      // Add expense data
      url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A2:F2:append?valueInputOption=RAW&key=${apiKey}`;
      body = JSON.stringify({ values: [values] });
    }

    const googleRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });

    const data = await googleRes.json();

    if (!googleRes.ok) {
      return res.status(googleRes.status).json({ error: data.error || 'Google Sheets error' });
    }

    return res.status(200).json({ success: true, data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
