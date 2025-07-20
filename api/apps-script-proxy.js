// /api/apps-script-proxy.js

export default async function handler(req, res) {
  const { method, action, ...params } = req.method === 'GET' ? req.query : req.body;

  console.log('Apps Script proxy received request:', { method, action, params });

  if (!method) {
    return res.status(400).json({ error: 'Method is required' });
  }

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyz_tb0t30b6DSLi0G_Zyl4FR1xyGY3A6AyqYlLWC5aaepUWXQ1wreTpu_-_bpo-Rswcw/exec';

  try {
    let url;
    let options = {};

    if (method === 'GET') {
      if (action === 'getShoppingList') {
        url = `${APPS_SCRIPT_URL}?method=GET&action=getShoppingList`;
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