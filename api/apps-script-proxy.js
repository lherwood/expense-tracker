// /api/apps-script-proxy.js

export default async function handler(req, res) {
  const { method, action, ...params } = req.method === 'GET' ? req.query : req.body;

  console.log('Apps Script proxy received request:', { method, action, params });

  if (!method) {
    return res.status(400).json({ error: 'Method is required' });
  }

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzeB5pk6klpVMlfFtK35KmsSRnIV_2fij0lkImteb37rjSFd-jRZMf1_PZAVMud1WlNbw/exec';

  try {
    let url;
    let options = {};

    if (method === 'GET') {
      url = `${APPS_SCRIPT_URL}?method=GET`;
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
      }
    }

    console.log('Making request to Apps Script:', url);

    const response = await fetch(url, options);
    const data = await response.text();

    console.log('Apps Script response:', { status: response.status, data });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Apps Script error: ${data}`,
        status: response.status
      });
    }

    // Try to parse as JSON, fallback to text
    try {
      const jsonData = JSON.parse(data);
      return res.status(200).json(jsonData);
    } catch {
      return res.status(200).json({ data: data });
    }

  } catch (error) {
    console.log('Apps Script proxy error:', error);
    return res.status(500).json({ error: 'Failed to communicate with Apps Script' });
  }
} 