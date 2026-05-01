import React, { useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  Wallet,
  Sprout,
  Calculator,
  Ruler,
  Calendar,
  Leaf,
} from "lucide-react";

const IncomeForecaster = () => {
  const [inputs, setInputs] = useState({
    tunnelSize: "",
    crop: "Capsicum",
    plantCount: "",
    plantedDate: "",
  });

  const [isCalculated, setIsCalculated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState(null);

  // Expenses calculation
  const costPerPlant = 60;
  const totalExpenses = (inputs.plantCount || 0) * costPerPlant;

  // Calculate Total Expected Yield (Kg) based on harvest logic
  let totalYieldKg = 0;
  if (forecastResult && forecastResult.totalHarvests) {
    const harvests = forecastResult.totalHarvests;
    let yieldPerPlant = 0;

    if (harvests >= 1) yieldPerPlant += 0.05; // 1st harvest: 50g
    if (harvests >= 2) yieldPerPlant += 0.05; // 2nd harvest: 50g
    if (harvests >= 3) yieldPerPlant += 0.15; // 3rd harvest: 150g
    if (harvests > 3) yieldPerPlant += (harvests - 3) * 0.2; // 4th onwards: 200g

    totalYieldKg = Math.round(yieldPerPlant * Number(inputs.plantCount));
  }

  // Function to call the Backend API
  const handleCalculate = async (e) => {
    e.preventDefault();

    if (!inputs.plantCount) {
      alert("Please enter the number of plants.");
      return;
    }

    if (!inputs.plantedDate) {
      alert("Please select the planted date.");
      return;
    }

    setIsLoading(true);
    try {
      // Logging the exact payload being sent to the backend for debugging
      console.log("Sending data to backend:", {
        cropName: inputs.crop,
        plantDate: inputs.plantedDate,
        numberOfPlants: Number(inputs.plantCount),
      });

      // Sending the request to the backend with correct variable mappings
      const response = await axios.post(
        "http://localhost:5000/api/prices/calculate-income",
        {
          cropName: inputs.crop,
          numberOfPlants: Number(inputs.plantCount),
          plantDate: inputs.plantedDate,
        },
      );

      setForecastResult(response.data);
      setIsCalculated(true);
    } catch (error) {
      // Extracting the exact error message from the Node.js backend
      if (error.response && error.response.data) {
        console.error("Backend Error:", error.response.data.message);
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("Error calculating forecast:", error);
        alert(
          "Failed to fetch data. Please check if the backend server is running.",
        );
      }
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
              value={inputs.crop}
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
              value={`Rs. ${(Math.round(Number(forecastResult.expectedMinIncome) / 1000) * 1000).toLocaleString()} - ${(Math.round(Number(forecastResult.expectedMaxIncome) / 1000) * 1000).toLocaleString()}`}
              subValue="Projected gross income range"
              icon={TrendingUp}
              color="bg-emerald-500"
            />
            <StatCard
              title="Total Expected Yield"
              value={`${totalYieldKg.toLocaleString()} Kg`}
              subValue={`Estimated yield from ${inputs.plantCount} plants`}
              icon={Leaf}
              color="bg-purple-500"
            />
            <StatCard
              title="Harvest Rounds"
              value={`${forecastResult.totalHarvests || 0} Times`}
              subValue={`Total pickings for ${inputs.plantCount} plants`}
              icon={Sprout}
              color="bg-blue-500"
            />
            <StatCard
              title="Expected Expenses"
              value={`Rs. ${totalExpenses.toLocaleString()}`}
              subValue={`Cost for ${inputs.plantCount} plants`}
              icon={Wallet}
              color="bg-amber-500"
            />
            
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeForecaster;
