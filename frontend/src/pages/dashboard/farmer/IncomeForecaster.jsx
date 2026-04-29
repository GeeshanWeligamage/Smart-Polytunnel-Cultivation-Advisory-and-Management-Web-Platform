import React, { useState } from "react";
import axios from "axios"; // 1. අනිවාර්යයෙන්ම axios import කරන්න
import {
  TrendingUp,
  Wallet,
  Sprout,
  AlertTriangle,
  Calculator,
  Ruler,
  Calendar,
  Leaf,
} from "lucide-react";

const IncomeForecaster = () => {
  const [inputs, setInputs] = useState({
    tunnelSize: "",
    crop: "Capsicum", // Default එක Capsicum විදිහටම තිබ්බා (Backend එකට යවන්න ලේසි වෙන්න)
    plantCount: "",
    plantedDate: "",
  });

  const [isCalculated, setIsCalculated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState(null); // API එකෙන් එන දත්ත තියාගන්න

  // වියදම් ගණනය කිරීම සඳහා (ඔයාගේ පරණ ලොජික් එකමයි)
  const costPerPlant = 60;
  const totalExpenses = (inputs.plantCount || 0) * costPerPlant;

  // Backend API එක Call කරන Function එක
  const handleCalculate = async (e) => {
    e.preventDefault();

    if (!inputs.plantCount) {
      alert("කරුණාකර පැළ ගණන ඇතුළත් කරන්න.");
      return;
    }

    setIsLoading(true);
    try {
      // Backend එකට Request එක යැවීම - මෙතන URL එක නිවැරදි කළා
      const response = await axios.post(
        "http://localhost:5000/api/prices/calculate-income",
        {
          cropName: inputs.crop,
          numberOfPlants: Number(inputs.plantCount),
        },
      );

      setForecastResult(response.data);
      setIsCalculated(true);
    } catch (error) {
      console.error("Error calculating forecast:", error);
      alert(
        "දත්ත ලබා ගැනීමේදී දෝෂයක් මතු විය. Backend එක Run වෙනවාදැයි පරීක්ෂා කරන්න.",
      );
    }
    setIsLoading(false);
  };

  const StatCard = ({ title, value, subValue, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all animate-in zoom-in duration-500">
      <div
        className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center text-${color.split("-")[1]}-600 mb-4`}
      >
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      {/* Range එක පෙන්වද්දී අකුරු ලොකු වැඩි නම් කැත වෙන නිසා text-xl දැම්මා */}
      <h3 className="text-xl font-black text-slate-800 tracking-tight">
        {value}
      </h3>
      <p className="text-xs font-bold text-slate-400 mt-1">{subValue}</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
            <Calculator size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-800">Forecast Inputs</h3>
        </div>

        <form
          onSubmit={handleCalculate}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end"
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <Ruler size={12} /> Tunnel Size (Sqft)
            </label>
            <input
              type="number"
              placeholder="e.g. 1000"
              required
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) =>
                setInputs({ ...inputs, tunnelSize: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <Leaf size={12} /> Select Crop
            </label>
            <select
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer"
              onChange={(e) => setInputs({ ...inputs, crop: e.target.value })}
            >
              <option value="Capsicum">Capsicum</option>
              <option value="Tomato">Tomato</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <Sprout size={12} /> Number of Plants
            </label>
            <input
              type="number"
              placeholder="e.g. 400"
              required
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) =>
                setInputs({ ...inputs, plantCount: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <Calendar size={12} /> Planted Date
            </label>
            <input
              type="date"
              required
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer uppercase"
              onChange={(e) =>
                setInputs({ ...inputs, plantedDate: e.target.value })
              }
            />
          </div>

          <div className="lg:col-span-4 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:bg-emerald-400"
            >
              {isLoading ? "Calculating..." : "Calculate Prediction"}
            </button>
          </div>
        </form>
      </div>

      {isCalculated && forecastResult && (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Expected Revenue"
              // API එකෙන් ආපු අවම සහ උපරිම ආදායම
              value={`Rs. ${Number(forecastResult.expectedMinIncome).toLocaleString()} - ${Number(forecastResult.expectedMaxIncome).toLocaleString()}`}
              subValue="Projected gross income range"
              icon={TrendingUp}
              color="bg-emerald-500"
            />
            <StatCard
              title="Yield Potential"
              // API එකෙන් ආපු අවම සහ උපරිම අස්වැන්න
              value={`${forecastResult.expectedHarvestMin} - ${forecastResult.expectedHarvestMax} Kg`}
              subValue={`Total harvest for ${inputs.plantCount} plants`}
              icon={Sprout}
              color="bg-blue-500"
            />
            <StatCard
              title="Expected Expenses"
              // වියදම් ගණනය කිරීම
              value={`Rs. ${totalExpenses.toLocaleString()}`}
              subValue={`Cost for ${inputs.plantCount} plants`}
              icon={Wallet}
              color="bg-amber-500"
            />
            <StatCard
              title="System Alert"
              value="Stable"
              subValue="Based on 6 months lifetime"
              icon={AlertTriangle}
              color="bg-rose-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeForecaster;
