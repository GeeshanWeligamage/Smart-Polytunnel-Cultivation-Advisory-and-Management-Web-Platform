import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, CalendarDays, Activity, Calendar } from "lucide-react";

const MarketTrends = () => {
  const [selectedCrop, setSelectedCrop] = useState("Capsicum");
  // අද දිනය Default එක විදිහට දානවා (YYYY-MM-DD format එකෙන්)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post("http://localhost:5001/api/prices/market-trends", {
          cropName: selectedCrop,
          selectedDate: selectedDate // තෝරගත්ත දවස Backend එකට යවනවා
        });
        setForecastData(response.data);
      } catch (error) {
        console.error("Error fetching market trends:", error);
      }
      setIsLoading(false);
    };

    fetchTrends();
  }, [selectedCrop, selectedDate]); // දවස වෙනස් වුණු ගමන් ආයෙත් API එක Call වෙනවා

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
              <Activity size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-800">Market Trends</h3>
          </div>
          <p className="text-sm font-bold text-slate-400 ml-1">Advanced Price Forecast Analysis</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Date Selector */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 px-4 rounded-2xl border border-slate-100 w-full md:w-auto">
            <Calendar size={18} className="text-slate-400" />
            <input 
              type="date"
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Crop Selector */}
          <div className="bg-slate-50 p-2 px-4 rounded-2xl border border-slate-100 w-full md:w-64">
            <select
              className="w-full bg-transparent font-bold text-slate-700 outline-none cursor-pointer appearance-none"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="Capsicum">Capsicum</option>
              <option value="Cucumber">Cucumber</option>
              <option value="Tomato">Tomato</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-500" />
            Forecast for 7 Days from {new Date(selectedDate).toLocaleDateString()}
          </h4>
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
            <CalendarDays size={14} /> Weekly Trend
          </span>
        </div>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 900, color: '#1e293b' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 700 }} />
                <Line type="monotone" dataKey="Max Price (Rs)" stroke="#10b981" strokeWidth={4} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="Min Price (Rs)" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketTrends;