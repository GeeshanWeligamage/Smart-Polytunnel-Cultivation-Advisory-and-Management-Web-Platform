import React from 'react';
import { Sprout, Stethoscope, Calculator, ChevronRight, TrendingUp } from 'lucide-react';

const Overview = ({ onNavigate }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Welcome to Smart Cultivation</h2>
          <p className="text-emerald-100 font-medium text-lg mb-6">Your current crop "Bell Pepper" is in the flowering stage.</p>
          
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Next Harvest</p>
              <p className="text-xl font-bold">Oct 14, 2026</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Market Price</p>
              <p className="text-xl font-bold">LKR 450/kg</p>
            </div>
          </div>
        </div>
        {/* Background Decor */}
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
        <Sprout size={200} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
      </div>

      {/* Quick Actions & Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-1">
          <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate('agro-doctor')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-emerald-600 shadow-sm"><Stethoscope size={18}/></div>
                <span className="font-bold text-slate-700 group-hover:text-emerald-700">Check Disease</span>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-600"/>
            </button>
            <button 
              onClick={() => onNavigate('finance')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm"><Calculator size={18}/></div>
                <span className="font-bold text-slate-700 group-hover:text-blue-700">Calculate Profit</span>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600"/>
            </button>
          </div>
        </div>

        {/* Market Status Placeholder */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
          <TrendingUp size={48} className="text-emerald-200 mb-4" />
          <h3 className="font-bold text-slate-400">Market Trends Chart</h3>
          <p className="text-sm text-slate-400">Real-time price data will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;