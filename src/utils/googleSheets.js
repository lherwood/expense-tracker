// Google Apps Script utility for Expense Tracker
// Sheet columns: id | paidBy | amount | category | description | date
// Updated to use Apps Script instead of Google Sheets API

const getApiKey = () => localStorage.getItem('googleApiKey') || '';
const getSheetId = () => localStorage.getItem('googleSheetId') || '';
const SHEET_RANGE = 'Sheet1'; // Default sheet/tab name
const HEADERS = ['id', 'paidBy', 'amount', 'category', 'description', 'date'];

// Vercel proxy URL for Apps Script
const PROXY_URL = 'https://expense-tracker-zslu.vercel.app/api/apps-script-proxy';

// Ensure headers exist (if sheet is blank) using Apps Script proxy
export async function ensureSheetHeaders() {
  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'POST',
        action: 'addHeaders'
      })
    });
    
    if (!res.ok) {
      console.log('Headers may already exist or failed to add');
    }
  } catch (error) {
    console.log('Headers setup failed:', error);
  }
}

// Fetch all expenses from the sheet using Apps Script proxy
export async function fetchExpenses() {
  console.log('Fetching expenses via Apps Script proxy');
  
  const res = await fetch(`${PROXY_URL}?method=GET`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Apps Script proxy error response:', errorData);
    throw new Error(errorData.error || 'Failed to fetch expenses via Apps Script proxy');
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

// Add a new expense to the sheet using Apps Script proxy
export async function addExpenseToSheet(expense) {
  console.log('Adding expense via Apps Script proxy:', expense);
  
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'POST',
      action: 'addExpense',
      id: expense.id,
      paidBy: expense.paidBy,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date
    })
  });
  
  console.log('Apps Script proxy response status:', res.status);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Apps Script proxy error response:', errorData);
    throw new Error(errorData.error || 'Failed to add expense via Apps Script proxy');
  }
  
  return true;
} 