import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const InsightsDashboard = ({ expenses }) => {
  const totals = expenses.reduce((acc, exp) => {
    const name = exp.paidBy || 'Unknown';
    acc[name] = (acc[name] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const data = Object.entries(totals).map(([name, total]) => ({
    name,
    total: parseFloat(total.toFixed(2))
  }));

  // Calculate category breakdown
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const categoryData = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total: parseFloat(total.toFixed(2))
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5); // Top 5 categories

  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const averagePerExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;

  return (
    <div className="space-y-6">
      {/* Spending Summary Chart */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Spending by Person</h2>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `R${value}`}
              />
              <Tooltip 
                formatter={(value) => [`R${value.toFixed(2)}`, 'Total']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="total" 
                fill="#6366f1" 
                radius={[6, 6, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500">No spending data yet</p>
          </div>
        )}
      </div>



      {/* Top Categories */}
      {categoryData.length > 0 && (
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h3>
          <div className="space-y-3">
            {categoryData.map((item, index) => {
              const percentage = ((item.total / totalSpent) * 100).toFixed(1);
              return (
                <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center flex-1">
                    <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                    <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="bg-gray-200 rounded-full h-2 w-20">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">R{item.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{percentage}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsDashboard; 