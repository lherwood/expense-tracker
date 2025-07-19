// Google Apps Script utility for Expense Tracker
// Sheet columns: id | paidBy | amount | category | description | date
// Updated to use Apps Script instead of Google Sheets API
// Using Vercel proxy to solve CORS issues

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
  console.log('Raw data from Apps Script:', data);
  
  if (!data.values) {
    console.log('No values found in response, returning empty array');
    return [];
  }
  
  console.log('Raw values from Apps Script:', data.values);
  
  // Skip the header row (first row) and filter out empty rows
  console.log('Total rows from Apps Script:', data.values.length);
  console.log('Rows after slice(1):', data.values.slice(1));
  
  // Check if the first row is actually headers
  const firstRow = data.values[0];
  console.log('First row:', firstRow);
  const isFirstRowHeaders = firstRow && firstRow[0] === 'id' && firstRow[1] === 'paidBy' && firstRow[2] === 'amount';
  console.log('Is first row headers:', isFirstRowHeaders);
  
  // Start from the appropriate row (skip headers if present)
  const startIndex = isFirstRowHeaders ? 1 : 0;
  const dataRows = data.values.slice(startIndex).filter((row, index) => {
    console.log(`=== Checking row ${index} (original index: ${startIndex + index}) ===`);
    console.log('Row:', row);
    console.log('Row type:', typeof row);
    console.log('Row length:', row ? row.length : 'null');
    console.log('Row stringified:', JSON.stringify(row));
    
    const hasContent = row && row.length > 0;
    console.log('Has content:', hasContent);
    
    const hasNonEmptyCells = row.some(cell => cell && cell.toString().trim() !== '');
    console.log('Has non-empty cells:', hasNonEmptyCells);
    
    const isNotHeader = !(row[0] === 'id' && row[1] === 'paidBy' && row[2] === 'amount');
    console.log('Is not header:', isNotHeader);
    
    const isValid = hasContent && hasNonEmptyCells && isNotHeader;
    console.log('Row is valid:', isValid);
    console.log(`=== End checking row ${index} ===`);
    
    return isValid;
  });
  
  console.log('Data rows after filtering:', dataRows);
  
  const expenses = dataRows.map((row, index) => {
    console.log(`Processing row ${index}:`, row);
    
    // Ensure we have all required fields
    const expense = {
      id: row[0] || `temp_${Date.now()}_${index}`,
      paidBy: row[1] || 'Unknown',
      amount: row[2] ? parseFloat(row[2]) : 0,
      category: row[3] || 'Other',
      description: row[4] || '',
      date: row[5] || new Date().toISOString().split('T')[0],
    };
    
    console.log(`Processed expense ${index}:`, expense);
    return expense;
  });
  
  console.log('Final processed expenses:', expenses);
  return expenses;
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

// Delete an expense from the sheet using Apps Script proxy
export async function deleteExpenseFromSheet(expenseId) {
  console.log('Deleting expense via Apps Script proxy:', expenseId);
  
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'POST',
      action: 'deleteExpense',
      id: expenseId
    })
  });
  
  console.log('Apps Script proxy delete response status:', res.status);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Apps Script proxy delete error response:', errorData);
    throw new Error(errorData.error || 'Failed to delete expense via Apps Script proxy');
  }
  
  return true;
} 