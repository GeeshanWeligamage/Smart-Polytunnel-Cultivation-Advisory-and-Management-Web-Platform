import React from 'react';

const ProfitCalculator = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-slate-800">Financial Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-3xl text-blue-900">
          <p className="text-sm font-bold uppercase tracking-wider opacity-60">Total Income</p>
          <p className="text-3xl font-black mt-2">LKR 125,000</p>
        </div>
        <div className="bg-red-50 p-6 rounded-3xl text-red-900">
          <p className="text-sm font-bold uppercase tracking-wider opacity-60">Expenses</p>
          <p className="text-3xl font-black mt-2">LKR 45,000</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-3xl text-emerald-900">
          <p className="text-sm font-bold uppercase tracking-wider opacity-60">Net Profit</p>
          <p className="text-3xl font-black mt-2">LKR 80,000</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-3xl border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">Recent Transactions</h3>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase font-bold border-b">
            <tr><th className="py-3">Date</th><th>Description</th><th>Amount</th><th>Type</th></tr>
          </thead>
          <tbody className="text-slate-600">
            <tr className="border-b border-slate-50"><td className="py-3">Oct 24</td><td>Fertilizer Purchase</td><td className="text-red-500">-5,000</td><td>Expense</td></tr>
            <tr className="border-b border-slate-50"><td className="py-3">Oct 20</td><td>Bell Pepper Sales</td><td className="text-emerald-600">+25,000</td><td>Income</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitCalculator;