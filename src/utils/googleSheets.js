// Google Sheets API utility for Expense Tracker
// Sheet columns: id | paidBy | amount | category | description | date

const getApiKey = () => localStorage.getItem('googleApiKey') || '';
const getSheetId = () => localStorage.getItem('googleSheetId') || '';
const SHEET_RANGE = 'Sheet1'; // Default sheet/tab name
const HEADERS = ['id', 'paidBy', 'amount', 'category', 'description', 'date'];

// Vercel proxy URL
const PROXY_URL = 'https://expense-tracker-zslu.vercel.app/api/sheets-proxy';

// Helper: Build Sheets API URL
function buildUrl(path, params = {}) {
  const apiKey = getApiKey();
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${getSheetId()}${path}`;
  const url = new URL(base);
  url.searchParams.set('key', apiKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

// Ensure headers exist (if sheet is blank) using Vercel proxy
export async function ensureSheetHeaders() {
  const apiKey = getApiKey();
  const sheetId = getSheetId();
  
  // First try to read headers to see if they exist
  const readUrl = `${PROXY_URL}?apiKey=${encodeURIComponent(apiKey)}&sheetId=${encodeURIComponent(sheetId)}&range=Sheet1!A1:F1`;
  
  try {
    const readRes = await fetch(readUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (readRes.ok) {
      const data = await readRes.json();
      if (data.values && data.values.length > 0) {
        // Headers already exist, no need to add them
        return;
      }
    }
  } catch (error) {
    // If reading fails, try to add headers
  }
  
  // Add headers if they don't exist
  const addUrl = `${PROXY_URL}`;
  const res = await fetch(addUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: apiKey,
      sheetId: sheetId,
      values: HEADERS,
      action: 'addHeaders'
    })
  });
  
  // Ignore errors if already exists
  if (!res.ok) {
    console.log('Headers may already exist or failed to add');
  }
}

// Fetch all expenses from the sheet using Vercel proxy
export async function fetchExpenses() {
  const apiKey = getApiKey();
  const sheetId = getSheetId();
  
  const url = `${PROXY_URL}?apiKey=${encodeURIComponent(apiKey)}&sheetId=${encodeURIComponent(sheetId)}`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch expenses via proxy');
  }
  
  const data = await res.json();
  if (!data.values) return [];
  
  return data.values.map(row => ({
    id: row[0],
    paidBy: row[1],
    amount: parseFloat(row[2]),
    category: row[3],
    description: row[4],
    date: row[5],
  }));
}

// Add a new expense to the sheet using Vercel proxy
export async function addExpenseToSheet(expense) {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: getApiKey(),
      sheetId: getSheetId(),
      values: [
        expense.id,
        expense.paidBy,
        expense.amount,
        expense.category,
        expense.description,
        expense.date
      ]
    })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add expense via proxy');
  }
  
  return true;
} 