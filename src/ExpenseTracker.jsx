import React, { useState } from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

const ExpenseTracker = ({ expenses, userName, setUserName, sharedSavings, updateSharedSavings }) => {
  const [showNamePrompt, setShowNamePrompt] = useState(!userName);

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {userName ? `Hi, ${userName}! 👋` : 'Expense Tracker'}
        </h1>
        <p className="text-gray-600">
          {userName ? 'Track your expenses and stay on top of your spending' : 'Welcome! Let\'s get started'}
        </p>
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

      {/* Current Month Expenses */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">This Month's Expenses</h2>
        {currentMonthExpenses.length > 0 ? (
          <div className="space-y-3">
            {currentMonthExpenses.slice(0, 3).map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{expense.paidBy}</p>
                  <p className="text-sm text-gray-500">{expense.category} • {formatDate(expense.date)}</p>
                </div>
                <p className="font-semibold text-indigo-600">{formatRand(expense.amount)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-500">No expenses this month yet</p>
            <p className="text-sm text-gray-400">Add your first expense to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;