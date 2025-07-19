import React, { useState, useMemo } from 'react';
import { Filter, Calendar, User, DollarSign, ArrowLeft, Trash2 } from 'lucide-react';

const AllExpenses = ({ expenses, onBack, onDeleteExpense }) => {
  const [filterPerson, setFilterPerson] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Get unique categories and people
  const categories = useMemo(() => {
    const cats = [...new Set(expenses.map(exp => exp.category))];
    return cats.sort();
  }, [expenses]);

  const people = useMemo(() => {
    const peeps = [...new Set(expenses.map(exp => exp.paidBy).filter(Boolean))];
    return peeps.sort();
  }, [expenses]);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;

    // Filter by person
    if (filterPerson !== 'all') {
      filtered = filtered.filter(exp => exp.paidBy === filterPerson);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === filterCategory);
    }

    // Sort
    switch (sortBy) {
      case 'date':
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'amount':
        return filtered.sort((a, b) => b.amount - a.amount);
      case 'category':
        return filtered.sort((a, b) => a.category.localeCompare(b.category));
      case 'person':
        return filtered.sort((a, b) => (a.paidBy || '').localeCompare(b.paidBy || ''));
      default:
        return filtered;
    }
  }, [expenses, filterPerson, filterCategory, sortBy]);

  // Calculate totals
  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpenses = filteredExpenses.length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Groceries': 'bg-green-100 text-green-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Petrol': 'bg-orange-100 text-orange-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Bills': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-teal-100 text-teal-800',
      'Travel': 'bg-yellow-100 text-yellow-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Home & Garden': 'bg-emerald-100 text-emerald-800',
      'Personal Care': 'bg-rose-100 text-rose-800',
      'Gifts & Donations': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">All Expenses</h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-lg font-bold text-gray-900">R{totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-lg font-bold text-gray-900">{totalExpenses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex items-center mb-3">
          <Filter className="w-4 h-4 text-gray-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Person Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person</label>
            <select
              value={filterPerson}
              onChange={(e) => setFilterPerson(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All People</option>
              {people.map(person => (
                <option key={person} value={person}>{person}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="date">Date (Newest First)</option>
            <option value="amount">Amount (Highest First)</option>
            <option value="category">Category (A-Z)</option>
            <option value="person">Person (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-500">No expenses found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div key={expense.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">{expense.paidBy || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">R{expense.amount.toFixed(2)}</span>
                  <button
                    onClick={() => {
                      console.log('Delete button clicked for expense:', expense.id);
                      if (window.confirm('Are you sure you want to delete this expense?')) {
                        console.log('Delete confirmed, calling onDeleteExpense');
                        onDeleteExpense(expense.id);
                      }
                    }}
                    className="p-2 bg-red-500 text-white hover:bg-red-700 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                  <span className="text-sm text-gray-500">{expense.description}</span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(expense.date)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllExpenses; 