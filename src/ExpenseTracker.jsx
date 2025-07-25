import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, DollarSign, Plus, Trash2 } from 'lucide-react';
import { fetchShoppingList, addShoppingListItem, deleteShoppingItem, fetchPushSubscriptions } from './utils/googleSheets';

const ExpenseTracker = ({ expenses, userName, setUserName, sharedSavings, updateSharedSavings }) => {
  const [showNamePrompt, setShowNamePrompt] = useState(!userName);
  const [shoppingList, setShoppingList] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);

  const formatRand = (val) => `R${parseFloat(val).toFixed(2)}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const avg = expenses.length ? total / expenses.length : 0;

  // Get current month expenses
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const currentMonthExpenses = expenses.filter(exp => {
    const expenseDate = new Date(exp.date);
    const expenseMonth = expenseDate.toISOString().slice(0, 7);
    return expenseMonth === currentMonth;
  });
  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const handleNameSet = (e) => {
    e.preventDefault();
    localStorage.setItem('expenseUser', userName);
    setShowNamePrompt(false);
  };

  // Load shopping list
  useEffect(() => {
    const loadShoppingList = async () => {
      try {
        const data = await fetchShoppingList();
        setShoppingList(data);
      } catch (err) {
        console.error('Error loading shopping list:', err);
      }
    };
    loadShoppingList();
  }, []);

  // Add new shopping list item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim() || !userName) return;
    
    setLoading(true);
    try {
      await addShoppingListItem(newItem.trim(), userName);
      setNewItem('');
      // Reload shopping list
      const data = await fetchShoppingList();
      setShoppingList(data);

      // --- Push Notification Logic ---
      try {
        const subscriptions = await fetchPushSubscriptions(userName);
        console.log('NOTIFY: About to send push notification for shopping add', subscriptions);
        await Promise.all(subscriptions.map(async (sub) => {
          const subscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          };
          const notification = {
            title: '🛒 Shopping List Updated',
            body: `${userName} added "${newItem.trim()}" to shopping list`,
            data: { type: 'shopping', user: userName, item: newItem.trim() }
          };
          await fetch('/api/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription, notification })
          });
        }));
      } catch (notifyErr) {
        console.error('Failed to send push notifications:', notifyErr);
      }
      // --- End Push Notification Logic ---

    } catch (err) {
      console.error('Error adding shopping item:', err);
    }
    setLoading(false);
  };

  // Delete shopping list item
  const handleDeleteItem = async (itemId) => {
    try {
      // Find the item for notification
      const item = shoppingList.find(i => i.id === itemId);
      await deleteShoppingItem(itemId);
      // Reload shopping list
      const data = await fetchShoppingList();
      setShoppingList(data);

      // --- Push Notification Logic ---
      if (item) {
        try {
          const subscriptions = await fetchPushSubscriptions(userName);
          console.log('NOTIFY: About to send push notification for shopping delete', subscriptions);
          await Promise.all(subscriptions.map(async (sub) => {
            const subscription = {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
              }
            };
            const notification = {
              title: '✅ Shopping Item Removed',
              body: `${userName} removed "${item.item}" from shopping list`,
              data: { type: 'shopping', user: userName, item: item.item }
            };
            await fetch('/api/send-notification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subscription, notification })
            });
          }));
        } catch (notifyErr) {
          console.error('Failed to send push notifications:', notifyErr);
        }
      }
      // --- End Push Notification Logic ---

    } catch (err) {
      console.error('Error deleting shopping item:', err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {userName ? userName : 'Expense Tracker'}
        </h1>
        {!userName && (
          <p className="text-gray-600">
            Welcome! Let's get started
          </p>
        )}
      </div>

      {/* Name prompt */}
      {showNamePrompt && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome!</h2>
          <form onSubmit={handleNameSet}>
            <label className="block text-sm font-medium text-gray-700 mb-2">What should we call you?</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition w-full font-semibold"
            >
              Get Started
            </button>
          </form>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">This Month</p>
              <p className="text-2xl font-bold text-indigo-600">{formatRand(currentMonthTotal)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Shared Savings</p>
              <p className="text-2xl font-bold text-indigo-600">{formatRand(sharedSavings)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Shopping List */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🛒 Shopping List</h2>
        
        {/* Add new item form */}
        <form onSubmit={handleAddItem} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add item to shopping list..."
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newItem.trim()}
              className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Shopping list items */}
        {shoppingList.length > 0 ? (
          <div className="space-y-2">
            {shoppingList.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="flex-1 text-gray-900">
                  {item.item}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{item.addedBy}</span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-gray-500">No items in shopping list</p>
            <p className="text-sm text-gray-400">Add your first item above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;