import React from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import InsightsDashboard from './InsightsDashboard';

const Insights = ({ expenses, onBack }) => {

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
        <h1 className="text-2xl font-bold text-gray-800">Insights & Analytics</h1>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Data Yet</h2>
          <p className="text-gray-600 mb-4">Add some expenses to see your spending insights</p>
          <button
            onClick={onBack}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Your First Expense
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Insights Dashboard */}
          <InsightsDashboard expenses={expenses} />




        </div>
      )}
    </div>
  );
};

export default Insights; 