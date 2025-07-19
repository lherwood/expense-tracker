// Google Apps Script utility for Expense Tracker
// Sheet columns: id | paidBy | amount | category | description | date
// Updated to use Apps Script instead of Google Sheets API

const getApiKey = () => localStorage.getItem('googleApiKey') || '';
const getSheetId = () => localStorage.getItem('googleSheetId') || '';
const SHEET_RANGE = 'Sheet1'; // Default sheet/tab name
const HEADERS = ['id', 'paidBy', 'amount', 'category', 'description', 'date'];

// Google Apps Script URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFWQk4YJrPj-yXGu-ktyq8nSHtR8x7GToaFIwkz6I_qbFTh4h6YUH41qi57fgPQZ9c2w/exec';

// Ensure headers exist (if sheet is blank) using Apps Script
export async function ensureSheetHeaders() {
  try {
    const url = `${APPS_SCRIPT_URL}?method=POST&action=addHeaders`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    if (!res.ok) {
      console.log('Headers may already exist or failed to add');
    }
  } catch (error) {
    console.log('Headers setup failed:', error);
  }
}

// Fetch all expenses from the sheet using Apps Script
export async function fetchExpenses() {
  console.log('Fetching expenses via Apps Script');
  
  const url = `${APPS_SCRIPT_URL}?method=GET`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Apps Script error response:', errorData);
    throw new Error(errorData.error || 'Failed to fetch expenses via Apps Script');
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

// Add a new expense to the sheet using Apps Script
export async function addExpenseToSheet(expense) {
  console.log('Adding expense via Apps Script:', expense);
  
  const params = new URLSearchParams({
    method: 'POST',
    action: 'addExpense',
    id: expense.id,
    paidBy: expense.paidBy,
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
    date: expense.date
  });
  
  const url = `${APPS_SCRIPT_URL}?${params.toString()}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  console.log('Apps Script response status:', res.status);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Apps Script error response:', errorData);
    throw new Error(errorData.error || 'Failed to add expense via Apps Script');
  }
  
  return true;
} 