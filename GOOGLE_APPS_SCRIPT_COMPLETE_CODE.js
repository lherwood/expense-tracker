// Complete Google Apps Script Code for Expense Tracker
// Copy and paste this entire code into your Google Apps Script editor

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // Handle case where e might be undefined (when running directly in editor)
  if (!e) {
    return createResponse({ error: 'No request parameters provided' }, 400);
  }
  
  const method = e.parameter ? (e.parameter.method || 'GET') : 'GET';
  const action = e.parameter ? e.parameter.action : null;
  
  console.log('Request received:', { method, action, parameters: e.parameter });
  
  try {
    if (method === 'GET') {
      if (action === 'getShoppingList') {
        return getShoppingList();
      } else if (action === 'getSharedSavings') {
        return getSharedSavings();
      } else {
        return getExpenses();
      }
    } else if (method === 'POST') {
      if (action === 'addExpense') {
        return addExpense(e.parameter);
      } else if (action === 'deleteExpense') {
        return deleteExpense(e.parameter);
      } else if (action === 'addHeaders') {
        return addHeaders();
      } else if (action === 'addShoppingItem') {
        return addShoppingItem(e.parameter);
      } else if (action === 'deleteShoppingItem') {
        return deleteShoppingItem(e.parameter);
      } else if (action === 'updateSharedSavings') {
        return updateSharedSavings(e.parameter);
      }
    }
    
    return createResponse({ error: 'Invalid method or action' }, 400);
  } catch (error) {
    console.error('Error handling request:', error);
    return createResponse({ error: error.toString() }, 500);
  }
}

// Test function - you can run this directly in the Apps Script editor
function testSetup() {
  console.log('Setting up test data...');
  
  try {
    // Test adding headers
    const headerResult = addHeaders();
    console.log('Headers result:', headerResult);
    
    // Test getting shared savings
    const savingsResult = getSharedSavings();
    console.log('Shared savings result:', savingsResult);
    
    // Test getting expenses
    const expensesResult = getExpenses();
    console.log('Expenses result:', expensesResult);
    
    // Test getting shopping list
    const shoppingResult = getShoppingList();
    console.log('Shopping list result:', shoppingResult);
    
    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

function getExpenses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Expenses');
  if (!sheet) {
    return createResponse({ values: [] });
  }
  
  const data = sheet.getDataRange().getValues();
  console.log('Raw expense data:', data);
  
  return createResponse({ values: data });
}

function addExpense(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Expenses');
  if (!sheet) {
    const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Expenses');
    addHeaders();
  }
  
  const { id, paidBy, amount, category, description, date } = params;
  
  const row = [
    id,
    paidBy,
    parseFloat(amount),
    category,
    description,
    date
  ];
  
  sheet.appendRow(row);
  console.log('Added expense:', row);
  
  return createResponse({ success: true });
}

function deleteExpense(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Expenses');
  if (!sheet) {
    return createResponse({ error: 'Expenses sheet not found' }, 404);
  }
  
  const { id } = params;
  const data = sheet.getDataRange().getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      console.log('Deleted expense with ID:', id);
      return createResponse({ success: true });
    }
  }
  
  return createResponse({ error: 'Expense not found' }, 404);
}

function addHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Expenses');
  if (!sheet) {
    return createResponse({ error: 'Expenses sheet not found' }, 404);
  }
  
  // Check if headers already exist
  const firstRow = sheet.getRange(1, 1, 1, 6).getValues()[0];
  if (firstRow[0] === 'id' && firstRow[1] === 'paidBy' && firstRow[2] === 'amount') {
    console.log('Headers already exist');
    return createResponse({ success: true, message: 'Headers already exist' });
  }
  
  const headers = ['id', 'paidBy', 'amount', 'category', 'description', 'date'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  console.log('Added headers');
  
  return createResponse({ success: true });
}

// Shopping List Functions
function getShoppingList() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ShoppingList');
  if (!sheet) {
    return createResponse({ values: [] });
  }
  
  const data = sheet.getDataRange().getValues();
  console.log('Raw shopping list data:', data);
  
  return createResponse({ values: data });
}

function addShoppingItem(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ShoppingList');
  if (!sheet) {
    const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('ShoppingList');
    const headers = ['id', 'item', 'addedBy', 'addedDate', 'completed'];
    newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  const { item, addedBy, addedDate } = params;
  const id = Date.now();
  
  const row = [
    id,
    item,
    addedBy,
    addedDate,
    false
  ];
  
  sheet.appendRow(row);
  console.log('Added shopping item:', row);
  
  return createResponse({ success: true });
}

function deleteShoppingItem(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ShoppingList');
  if (!sheet) {
    return createResponse({ error: 'Shopping list sheet not found' }, 404);
  }
  
  const { id } = params;
  const data = sheet.getDataRange().getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      console.log('Deleted shopping item with ID:', id);
      return createResponse({ success: true });
    }
  }
  
  return createResponse({ error: 'Shopping item not found' }, 404);
}

// Shared Savings Functions
function getSharedSavings() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SharedSavings');
  if (!sheet) {
    // Create the sheet with default value
    const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('SharedSavings');
    const headers = ['amount'];
    newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    newSheet.getRange(2, 1).setValue(15000);
    console.log('Created SharedSavings sheet with default value');
    return createResponse({ values: [[15000]] });
  }
  
  const data = sheet.getDataRange().getValues();
  console.log('Raw shared savings data:', data);
  
  return createResponse({ values: data });
}

function updateSharedSavings(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SharedSavings');
  if (!sheet) {
    // Create the sheet if it doesn't exist
    const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('SharedSavings');
    const headers = ['amount'];
    newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  const { amount } = params;
  const savingsAmount = parseFloat(amount);
  
  if (isNaN(savingsAmount)) {
    return createResponse({ error: 'Invalid amount' }, 400);
  }
  
  // Update the amount in row 2 (after header)
  sheet.getRange(2, 1).setValue(savingsAmount);
  console.log('Updated shared savings to:', savingsAmount);
  
  return createResponse({ success: true });
}

function createResponse(data, statusCode = 200) {
  const response = ContentService.createTextOutput(JSON.stringify(data));
  response.setMimeType(ContentService.MimeType.JSON);
  
  // Note: CORS headers are automatically handled by Google Apps Script
  // No need to set them manually
  
  return response;
} 