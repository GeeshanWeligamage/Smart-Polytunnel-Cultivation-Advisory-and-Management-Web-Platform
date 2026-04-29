import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { X, RotateCcw } from "lucide-react";

const PriceHistoryModal = ({ isOpen, onClose, cropName, history }) => {
  const [range, setRange] = useState("all");
  const [showMin, setShowMin] = useState(true);
  const [showMax, setShowMax] = useState(true);

  if (!isOpen) return null;

  // Chart එකට දත්ත සකස් කිරීම සහ Sort කිරීම
  const getFilteredData = () => {
    if (!history || history.length === 0) return [];

    // 1. දින ටික පරණ එකේ සිට අලුත් එකට Sort කිරීම (Straight lines සඳහා මෙය අත්‍යවශ්‍යයි)
    let sortedData = [...history].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    // 2. Range එක අනුව Filter කිරීම
    if (range !== "all") {
      const daysMap = { "5D": 5, "10D": 10, "1M": 30, "1Y": 365, "5Y": 1825 };
      sortedData = sortedData.slice(-daysMap[range]);
    }
    return sortedData;
  };

  const chartData = getFilteredData();

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {cropName} Analysis
            </h2>
            <p className="text-slate-500 text-sm font-bold tracking-tight">
              Market Price History
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filter & Toggle Buttons */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
            {["5D", "10D", "1M", "1Y", "5Y", "all"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${range === r ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:bg-white"}`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowMin(!showMin)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${showMin ? "bg-emerald-800 text-white" : "bg-slate-200 text-slate-500"}`}
            >
              {showMin ? "Hide Min Price" : "Show Min Price"}
            </button>
            <button
              onClick={() => setShowMax(!showMax)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${showMax ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}
            >
              {showMax ? "Hide Max Price" : "Show Max Price"}
            </button>
          </div>
        </div>

        {/* Graph Area */}
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative">
          <button
            onClick={() => {
              setRange("all");
              setShowMin(true);
              setShowMax(true);
            }}
            className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 z-10"
          >
            <RotateCcw size={12} /> Reset View
          </button>

          <div className="h-[350px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "15px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />

                  {/* type="linear" යෙදීමෙන් රේඛාව කෙලින් (Straight) වේ. 
                    type="monotone" තිබුණොත් එය වක්‍ර (Curve) වේ.
                  */}
                  {showMax && (
                    <Line
                      name="Max (Rs)"
                      type="linear"
                      dataKey="priceMax"
                      stroke="#064e3b"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: "#064e3b",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 8 }}
                    />
                  )}
                  {showMin && (
                    <Line
                      name="Min (Rs)"
                      type="linear"
                      dataKey="priceMin"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: "#10b981",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 8 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-bold">
                No history data available for this crop.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryModal;
