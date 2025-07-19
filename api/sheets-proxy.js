// /api/sheets-proxy.js

export default async function handler(req, res) {
  // Get parameters from either query (GET) or body (POST)
  const apiKey = req.method === 'GET' ? req.query.apiKey : req.body.apiKey;
  const sheetId = req.method === 'GET' ? req.query.sheetId : req.body.sheetId;

  console.log('Proxy received request:', {
    method: req.method,
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
    sheetId: sheetId || 'missing'
  });

  if (!apiKey || !sheetId) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields: apiKey and sheetId are required' });
  }

  // First, let's test if we can access the sheet at all
  const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
  console.log('Testing sheet access with:', testUrl);
  
  try {
    const testRes = await fetch(testUrl);
    const testData = await testRes.json();
    console.log('Sheet access test result:', { status: testRes.status, data: testData });
    
    if (!testRes.ok) {
      return res.status(testRes.status).json({ 
        error: `Cannot access sheet: ${testData.error?.message || 'Unknown error'}`,
        details: testData
      });
    }
  } catch (error) {
    console.log('Sheet access test failed:', error);
    return res.status(500).json({ error: 'Failed to test sheet access' });
  }

  if (req.method === 'GET') {
    // Handle GET request for fetching expenses
    const { range } = req.query;
    const sheetRange = range || 'Sheet1!A2:F1000';
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${apiKey}`;
    
    console.log('Making GET request to:', url);
    
    try {
      const googleRes = await fetch(url);
      const data = await googleRes.json();

      console.log('Google Sheets GET response:', { status: googleRes.status, data });

      if (!googleRes.ok) {
        return res.status(googleRes.status).json({ error: data.error || 'Google Sheets error' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.log('GET request failed:', error);
      return res.status(500).json({ error: 'Failed to fetch from Google Sheets' });
    }
  }

  if (req.method === 'POST') {
    // Handle POST request for adding expenses or headers
    const { values, action } = req.body;

    console.log('POST request details:', { action, values });

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

    console.log('Making POST request to:', url);
    console.log('POST request body:', body);

    try {
      const googleRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const data = await googleRes.json();

      console.log('Google Sheets POST response:', { status: googleRes.status, data });

      if (!googleRes.ok) {
        return res.status(googleRes.status).json({ error: data.error || 'Google Sheets error' });
      }

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.log('POST request failed:', error);
      return res.status(500).json({ error: 'Failed to write to Google Sheets' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
