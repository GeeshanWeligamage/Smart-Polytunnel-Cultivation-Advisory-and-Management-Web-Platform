import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  TrendingUp,
  RefreshCw,
  Search,
  ChevronDown,
  History,
  Clock,
  Calendar,
} from "lucide-react";
import PriceHistoryModal from "./PriceHistoryModal";

const DailyPrices = () => {
  const { user } = useContext(AuthContext);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Type");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [selectedCropForHistory, setSelectedCropForHistory] = useState(null);

  // දිනය වෙනස් වන සෑම විටම දත්ත නැවත ලබා ගනී
  useEffect(() => {
    fetchPrices();
  }, [selectedDate]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      // Backend එකෙන් අදාළ දිනයට පමණක් දත්ත ලබා ගැනීම
      const response = await fetch(`http://localhost:5000/api/prices?date=${selectedDate}`);
      const data = await response.json();

      // console.log("Fetched Data:", data); // මෙතනින් ඔයාට එන දත්ත පරීක්ෂා කළ හැකියි

      if (data && data.length > 0) {
        setPrices(data);
      } else {
        setPrices([]);
      }
    } catch (err) {
      console.error("Error fetching prices:", err);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrices = prices.filter((p) => {
    const matchesSearch = p.cropName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Type" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-10 font-sans text-slate-900">
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0.6;
        }
      `}</style>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Date Picker */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
            />
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 font-bold text-sm text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="All Type">All Type</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Search Bar */}
          <div className="relative flex-grow min-w-[200px] lg:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Price Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-white rounded-[2.5rem] border border-slate-100"></div>
          ))}
        </div>
      ) : filteredPrices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrices.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col"
            >
              <div className="h-40 overflow-hidden relative bg-slate-100">
                <img
                  src={item.image || "https://via.placeholder.com/300"}
                  alt={item.cropName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">
                  {item.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-800 tracking-tight leading-tight">
                    {item.cropName}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Current Rate (KG)
                  </p>
                  {/* මෙතන මම minPrice සහ priceMin දෙකම check කරන ලොජික් එක දැම්මා */}
                  <p className="text-xl font-black text-emerald-600 pt-1">
                    Rs. {item.minPrice || item.priceMin || "-"} - {item.maxPrice || item.priceMax || "-"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCropForHistory(item)}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border border-slate-100 rounded-2xl py-3 text-xs font-bold transition-all"
                >
                  <History size={16} /> View History
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center flex flex-col items-center justify-center space-y-5 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <Clock size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Prices Not Updated Yet
            </h3>
            <p className="text-slate-400 font-medium text-sm max-w-sm mx-auto leading-relaxed">
              Market rates for <b>{selectedDate}</b> have not been posted by the administration. 
              Only prices specifically for this date are displayed.
            </p>
          </div>
          <button 
            onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
            className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline pt-2"
          >
            Switch to Today
          </button>
        </div>
      )}

      {/* History Modal */}
      <PriceHistoryModal
        isOpen={!!selectedCropForHistory}
        onClose={() => setSelectedCropForHistory(null)}
        cropName={selectedCropForHistory?.cropName}
        history={selectedCropForHistory?.history}
      />
    </div>
  );
};

export default DailyPrices;