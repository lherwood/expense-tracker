// Google Sheets API utility for Expense Tracker
// Sheet columns: id | paidBy | amount | category | description | date

const getApiKey = () => localStorage.getItem('googleApiKey') || '';
const getSheetId = () => localStorage.getItem('googleSheetId') || '';
const SHEET_RANGE = 'Sheet1'; // Default sheet/tab name
const HEADERS = ['id', 'paidBy', 'amount', 'category', 'description', 'date'];

// Helper: Build Sheets API URL
function buildUrl(path, params = {}) {
  const apiKey = getApiKey();
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${getSheetId()}${path}`;
  const url = new URL(base);
  url.searchParams.set('key', apiKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

// Ensure headers exist (if sheet is blank)
export async function ensureSheetHeaders() {
  const url = buildUrl(`/values/${SHEET_RANGE}!A1:F1`, { valueInputOption: 'RAW' });
  const res = await fetch(url.replace('/values/', '/values:append'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      values: [HEADERS],
      range: `${SHEET_RANGE}!A1:F1`,
      majorDimension: 'ROWS',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
    })
  });
  // Ignore errors if already exists
}

// Fetch all expenses from the sheet
export async function fetchExpenses() {
  const url = buildUrl(`/values/${SHEET_RANGE}!A2:F1000`);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch expenses from Google Sheets');
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

// Add a new expense to the sheet
export async function addExpenseToSheet(expense) {
  const url = buildUrl(`/values/${SHEET_RANGE}!A2:F2:append`, { valueInputOption: 'RAW' });
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      values: [[
        expense.id,
        expense.paidBy,
        expense.amount,
        expense.category,
        expense.description,
        expense.date
      ]]
    })
  });
  if (!res.ok) throw new Error('Failed to add expense to Google Sheets');
  return true;
} 