// /api/apps-script-proxy.js

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const { method, action, ...params } = req.method === 'GET' ? req.query : req.body;

  console.log('Apps Script proxy received request:', { method, action, params });

  if (!method) {
    return res.status(400).json({ error: 'Method is required' });
  }

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5g3Y-p2zreXCXcXFUK6iKdqOE7gLBuTgxolnzANGHngYrmxFMM-YFEj1ea1P0R9jTtA/exec';

  try {
    let url;
    let options = {};

    if (method === 'GET') {
      if (action === 'getShoppingList') {
        url = `${APPS_SCRIPT_URL}?method=GET&action=getShoppingList`;
      } else if (action === 'getSharedSavings') {
        url = `${APPS_SCRIPT_URL}?method=GET&action=getSharedSavings`;
      } else if (action === 'getPushSubscriptions') {
        url = `${APPS_SCRIPT_URL}?method=GET&action=getPushSubscriptions`;
      } else {
        url = `${APPS_SCRIPT_URL}?method=GET`;
      }
      options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };
    } else if (method === 'POST') {
      if (action === 'addExpense') {
        const searchParams = new URLSearchParams({
          method: 'POST',
          action: 'addExpense',
          ...params
        });
        url = `${APPS_SCRIPT_URL}?${searchParams.toString()}`;
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
      } else if (action === 'addHeaders') {
        url = `${APPS_SCRIPT_URL}?method=POST&action=addHeaders`;
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
      } else if (action === 'deleteExpense') {
        const searchParams = new URLSearchParams({
          method: 'POST',
          action: 'deleteExpense',
          ...params
        });
        url = `${APPS_SCRIPT_URL}?${searchParams.toString()}`;
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
      } else if (action === 'addShoppingItem') {
        const searchParams = new URLSearchParams({
          method: 'POST',
          action: 'addShoppingItem',
          ...params
        });
        url = `${APPS_SCRIPT_URL}?${searchParams.toString()}`;
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
      } else if (action === 'deleteShoppingItem') {
        const searchParams = new URLSearchParams({
          method: 'POST',
          action: 'deleteShoppingItem',
          ...params
        });
        url = `${APPS_SCRIPT_URL}?${searchParams.toString()}`;
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
      } else if (action === 'updateSharedSavings') {
        const searchParams = new URLSearchParams({
          method: 'POST',
          action: 'updateSharedSavings',
          ...params
        });
        url = `${APPS_SCRIPT_URL}?${searchParams.toString()}`;
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
      }
    }

    console.log('Making request to Apps Script:', url);

    const response = await fetch(url, options);
    const data = await response.text();

    console.log('Apps Script response status:', response.status);
    console.log('Apps Script response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Apps Script raw response data:', data);

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Apps Script error: ${data}`,
        status: response.status
      });
    }

    // Try to parse as JSON, fallback to text
    try {
      const jsonData = JSON.parse(data);
      console.log('Parsed JSON data:', jsonData);
      return res.status(200).json(jsonData);
    } catch (parseError) {
      console.log('Failed to parse as JSON, returning as text:', parseError);
      return res.status(200).json({ data: data });
    }

  } catch (error) {
    console.log('Apps Script proxy error:', error);
    return res.status(500).json({ error: 'Failed to communicate with Apps Script' });
  }
} 