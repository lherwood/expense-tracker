import React, { useState, useEffect } from 'react';
import { Home, Plus, BarChart3, Settings, List } from 'lucide-react';
import ExpenseTracker from './ExpenseTracker';
import AddExpense from './components/AddExpense';
import Insights from './components/Insights';
import SettingsScreen from './components/SettingsScreen';
import AllExpenses from './components/AllExpenses';
import { fetchExpenses, addExpenseToSheet, ensureSheetHeaders, deleteExpenseFromSheet } from './utils/googleSheets';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [expenses, setExpenses] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('expenseUser');
    if (savedName) setUserName(savedName);
  }, []);

  // Fetch expenses from Google Sheets on load
  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);
      setError('');
      
      try {
        await ensureSheetHeaders();
        const data = await fetchExpenses();
        setExpenses(data.reverse()); // Show newest first
      } catch (err) {
        console.error('Error loading expenses:', err);
        setError(`Failed to load expenses: ${err.message}`);
      }
      setLoading(false);
    };
    loadExpenses();
  }, []);

  // Add expense to Google Sheets
  const addExpense = async (newExpense) => {
    setLoading(true);
    setError('');
    const entry = {
      ...newExpense,
      id: Date.now(),
      amount: parseFloat(newExpense.amount)
    };
    try {
      await addExpenseToSheet(entry);
      // Reload expenses after adding
      const data = await fetchExpenses();
      setExpenses(data.reverse());
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(`Failed to add expense: ${err.message}`);
    }
    setLoading(false);
  };

  // Delete expense from Google Sheets
  const deleteExpense = async (expenseId) => {
    setLoading(true);
    setError('');
    try {
      await deleteExpenseFromSheet(expenseId);
      // Reload expenses after deleting
      const data = await fetchExpenses();
      setExpenses(data.reverse());
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError(`Failed to delete expense: ${err.message}`);
    }
    setLoading(false);
  };

  const renderScreen = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      );
    }
    // Don't return early on error!
    switch (currentScreen) {
      case 'home':
        return <ExpenseTracker expenses={expenses} userName={userName} setUserName={setUserName} onDeleteExpense={deleteExpense} />;
      case 'add':
        return <AddExpense onAddExpense={addExpense} userName={userName} onBack={() => setCurrentScreen('home')} />;
      case 'insights':
        return <Insights expenses={expenses} onBack={() => setCurrentScreen('home')} />;
      case 'expenses':
        return <AllExpenses expenses={expenses} onBack={() => setCurrentScreen('home')} onDeleteExpense={deleteExpense} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('home')} />;
      default:
        return <ExpenseTracker expenses={expenses} userName={userName} setUserName={setUserName} onDeleteExpense={deleteExpense} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Main Content */}
      <div className="pb-20">
        {error && (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-red-600 font-semibold mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        )}
        {renderScreen()}
      </div>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentScreen === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setCurrentScreen('add')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentScreen === 'add' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            <Plus className="w-5 h-5 mb-1" />
            <span className="text-xs">Add</span>
          </button>
          <button
            onClick={() => setCurrentScreen('expenses')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentScreen === 'expenses' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            <List className="w-5 h-5 mb-1" />
            <span className="text-xs">All</span>
          </button>
          <button
            onClick={() => setCurrentScreen('insights')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentScreen === 'insights' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs">Insights</span>
          </button>
          <button
            onClick={() => setCurrentScreen('settings')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentScreen === 'settings' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
