import React, { useState, useEffect } from "react";
import { Edit3, RefreshCw, X, Calendar } from "lucide-react";
import axios from "axios";

const UpdatePrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [dailyData, setDailyData] = useState({
    date: new Date().toISOString().split("T")[0],
    priceMin: "",
    priceMax: "",
  });

  // අනාගත දින Block කිරීමට අද දිනය ලබා ගැනීම
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/prices");
      setPrices(res.data);
    } catch (err) {
      console.error("Error fetching prices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatePayload = {
        cropName: selectedCrop.cropName,
        date: dailyData.date,
        priceMin: Number(dailyData.priceMin),
        priceMax: Number(dailyData.priceMax),
      };

      const res = await axios.post(
        "http://localhost:5000/api/prices/update",
        updatePayload,
      );

      if (res.status === 200) {
        alert(`Price for ${dailyData.date} updated successfully! ✅`);
        setSelectedCrop(null);
        fetchPrices();
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Update failed! ❌");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
          Update Daily Prices
        </h2>
        <button
          onClick={fetchPrices}
          className="p-2 hover:bg-white rounded-full transition-all shadow-sm group"
        >
          <RefreshCw
            size={20}
            className={`${loading ? "animate-spin text-emerald-500" : "text-slate-500 group-hover:text-emerald-500"}`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 flex flex-col items-center gap-3">
            <RefreshCw className="animate-spin text-emerald-500" size={32} />
            <span className="font-bold text-slate-400">
              Syncing Market Data...
            </span>
          </div>
        ) : (
          prices.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="h-44 overflow-hidden bg-slate-100 relative">
                <img
                  src={item.image || "https://via.placeholder.com/300"}
                  alt={item.cropName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[11px] font-black text-emerald-600 shadow-sm border border-emerald-50">
                  Rs. {item.currentPriceMin} - {item.currentPriceMax}
                </div>
              </div>
              <div className="p-5 space-y-4">
                <h4 className="text-lg font-black text-slate-800 tracking-tight">
                  {item.cropName}
                </h4>
                <button
                  onClick={() => {
                    setSelectedCrop(item);
                    setDailyData({
                      date: today,
                      priceMin: item.currentPriceMin,
                      priceMax: item.currentPriceMax,
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Edit3 size={14} /> Update Price
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedCrop && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[420px] rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300 relative">
            <button
              onClick={() => setSelectedCrop(null)}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col mb-10">
              <h2 className="text-[28px] font-black text-slate-800 tracking-tight leading-none mb-2">
                Update Price
              </h2>
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <div className="h-1 w-6 bg-emerald-500 rounded-full"></div>
                {selectedCrop.cropName}
              </span>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                  Select Target Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dailyData.date}
                    max={today}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[1.2rem] text-slate-700 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none"
                    onChange={(e) =>
                      setDailyData({ ...dailyData, date: e.target.value })
                    }
                  />
                  <Calendar
                    className="absolute right-4 top-4 text-slate-300 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                    Min Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={dailyData.priceMin}
                    required
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) =>
                      (e.key === "ArrowUp" || e.key === "ArrowDown") &&
                      e.preventDefault()
                    }
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[1.2rem] text-slate-700 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    onChange={(e) =>
                      setDailyData({ ...dailyData, priceMin: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                    Max Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={dailyData.priceMax}
                    required
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) =>
                      (e.key === "ArrowUp" || e.key === "ArrowDown") &&
                      e.preventDefault()
                    }
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[1.2rem] text-slate-700 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    onChange={(e) =>
                      setDailyData({ ...dailyData, priceMax: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedCrop(null)}
                  className="flex-1 py-4 font-black text-slate-400 bg-white border-2 border-slate-100 rounded-[1.5rem] hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 font-black bg-emerald-600 text-white rounded-[1.5rem] shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all tracking-wide"
                >
                  Update Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePrices;
