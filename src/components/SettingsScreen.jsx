import React, { useState } from 'react';
import { ArrowLeft, Download, Trash2, Info, ExternalLink, TrendingUp, Bell } from 'lucide-react';
import notificationService from '../utils/notifications';

const SettingsScreen = ({ onBack, sharedSavings, updateSharedSavings }) => {
  const [message, setMessage] = useState('');
  const [newSavingsAmount, setNewSavingsAmount] = useState(sharedSavings.toString());
  const [saving, setSaving] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  const exportToCSV = () => {
    const expenses = JSON.parse(localStorage.getItem('expenseData')) || [];
    if (expenses.length === 0) {
      setMessage('No expenses to export');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const csvContent = [
      ['Name', 'Amount', 'Category', 'Date', 'Description'],
      ...expenses.map(expense => [
        expense.paidBy,
        expense.amount,
        expense.category,
        expense.date,
        expense.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setMessage('CSV exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete all your expense data? This cannot be undone.')) {
      localStorage.removeItem('expenseData');
      localStorage.removeItem('expenseUser');
      setMessage('All data cleared successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const saveSharedSavings = async () => {
    const amount = parseFloat(newSavingsAmount);
    if (isNaN(amount) || amount < 0) {
      setMessage('Please enter a valid amount');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setSaving(true);
    try {
      await updateSharedSavings(amount);
      setMessage('Shared savings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update shared savings. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
    setSaving(false);
  };

  const enableNotifications = async () => {
    setNotifLoading(true);
    const result = await notificationService.initialize();
    if (result) {
      setMessage('Notifications enabled!');
    } else {
      setMessage('Failed to enable notifications or permission denied.');
    }
    setNotifLoading(false);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Enable Notifications */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔔 Notifications</h2>
          <p className="text-gray-600 mb-4">
            Get notified instantly when Amy or you update savings, add expenses, or change the shopping list.
          </p>
          <button
            onClick={enableNotifications}
            disabled={notifLoading}
            className="w-full flex items-center justify-center p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bell className="w-5 h-5 mr-2" />
            {notifLoading ? 'Enabling...' : 'Enable Notifications'}
          </button>
        </div>

        {/* Shared Savings */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">💰 Shared Savings</h2>
          <p className="text-gray-600 mb-4">
            Update your shared savings amount that displays on the home page.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Amount: R{sharedSavings.toFixed(2)}
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter new amount"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newSavingsAmount}
                onChange={(e) => setNewSavingsAmount(e.target.value)}
              />
            </div>
            <button
              onClick={saveSharedSavings}
              disabled={saving}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Shared Savings'}
            </button>
          </div>
        </div>

        {/* Google Sheets Integration */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Google Sheets Integration</h2>
          <p className="text-gray-600 mb-4">
            Your expense data is automatically synced with Google Sheets using Google Apps Script.
            No API keys or configuration needed!
          </p>
          <div className="space-y-4">
            <a
              href="https://docs.google.com/spreadsheets/d/1lRn0CSCBpGA_YTDF4-Zby-AToqqPj0MjvkrWNqvGwfk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Google Sheet
            </a>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Management</h2>
          <div className="space-y-4">
            <button
              onClick={exportToCSV}
              className="w-full flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Download className="w-5 h-5 mr-3 text-green-600" />
              <span className="font-semibold text-green-900">Export to CSV</span>
            </button>
            
            <button
              onClick={clearAllData}
              className="w-full flex items-center justify-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5 mr-3 text-red-600" />
              <span className="font-semibold text-red-900">Clear All Data</span>
            </button>
          </div>
        </div>

        {/* App Information */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">App Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Version</p>
                <p className="text-sm text-gray-500">1.0.0</p>
              </div>
            </div>
            <div className="flex items-center">
              <Info className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Currency</p>
                <p className="text-sm text-gray-500">South African Rand (R)</p>
              </div>
            </div>
            <div className="flex items-center">
              <Info className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Storage</p>
                <p className="text-sm text-gray-500">Google Sheets (Real-time sync)</p>
              </div>
            </div>
            <div className="flex items-center">
              <Info className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Authentication</p>
                <p className="text-sm text-gray-500">Google Apps Script</p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
          <p className="text-gray-600 mb-4">
            This expense tracker helps you monitor your spending habits and stay on top of your finances.
            All data is synced with Google Sheets for easy access and sharing.
          </p>
          <p className="text-sm text-gray-500">
            Built with React, Tailwind CSS, and Vite. Deployed on Vercel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen; 