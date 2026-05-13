import React, { useState, useRef } from "react";
import axios from "axios";
import {
  TrendingUp,
  Wallet,
  Sprout,
  Calculator,
  Ruler,
  Calendar,
  Leaf,
  RotateCcw,
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
  const [appliedInputs, setAppliedInputs] = useState(null); // Locks in inputs for calculation results view
  const resultRef = useRef(null);

  // Prepare values using the FROZEN snapshot state
  const activeInputs = appliedInputs || { tunnelSize: "0", crop: "Capsicum", plantCount: "0" };

  // Managing Cost calculation (Based on active snapshot data)
  const selectedSize = parseFloat(activeInputs.tunnelSize) || 0;
  const baseRate = activeInputs.crop === "Capsicum" ? 80000 : 60000; 
  const totalManagingCost = (selectedSize / 1000) * baseRate;

  // Calculate Total Expected Yield (Kg) based on active snapshot data
  let totalYieldKg = 0;
  if (forecastResult && forecastResult.totalHarvests) {
    const harvests = forecastResult.totalHarvests;
    let yieldPerPlant = 0;
    const activeCrop = activeInputs.crop;

    if (activeCrop === "Capsicum") {
      if (harvests >= 1) yieldPerPlant += 0.05;
      if (harvests >= 2) yieldPerPlant += 0.05;
      if (harvests >= 3) yieldPerPlant += 0.15;
      if (harvests > 3) yieldPerPlant += (harvests - 3) * 0.2;
    } else if (activeCrop === "Cucumber") {
      if (harvests >= 1) yieldPerPlant += 0.4;
      if (harvests >= 2) yieldPerPlant += 0.6;
      if (harvests > 2) yieldPerPlant += (harvests - 2) * 0.6;
    } else if (activeCrop === "Tomato") {
      if (harvests >= 1) yieldPerPlant += 0.2;
      if (harvests >= 2) yieldPerPlant += 0.25;
      if (harvests > 2) yieldPerPlant += (harvests - 2) * 0.25;
    }

    totalYieldKg = Math.round(yieldPerPlant * Number(activeInputs.plantCount));
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
      console.log("Sending data to backend:", {
        cropName: inputs.crop,
        plantDate: inputs.plantedDate,
        numberOfPlants: Number(inputs.plantCount),
      });

      const response = await axios.post(
        "http://localhost:5001/api/prices/calculate-income",
        {
          cropName: inputs.crop,
          numberOfPlants: Number(inputs.plantCount),
          plantDate: inputs.plantedDate,
        },
      );

      setForecastResult(response.data);
      setAppliedInputs({ ...inputs }); // Freezes dynamic data based on current fields
      setIsCalculated(true);
      
      // Delayed focus triggers absolute auto scrolling down to view panel
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    } catch (error) {
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

  const StatCard = ({ title, value, subValue, icon: Icon, color, delay = 0 }) => (
    <div 
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
      className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
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
      <div data-aos="fade-up" className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
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
            <select
              required
              value={inputs.tunnelSize}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer"
              onChange={(e) => {
                const sizeVal = e.target.value;
                if (sizeVal) {
                  const numericSize = parseInt(sizeVal);
                  const calculatedPlants = Math.round(numericSize * 0.25); // 250 plants per 1000 sqft ratio (0.25)
                  setInputs({
                    ...inputs,
                    tunnelSize: sizeVal,
                    plantCount: calculatedPlants.toString(),
                  });
                } else {
                  setInputs({ ...inputs, tunnelSize: "", plantCount: "" });
                }
              }}
            >
              <option value="" disabled>Select Size</option>
              <option value="1000">1000 SQFT</option>
              <option value="1500">1500 SQFT</option>
              <option value="2500">2500 SQFT</option>
              <option value="5000">5000 SQFT</option>
              <option value="7500">7500 SQFT</option>
              <option value="10000">10000 SQFT</option>
            </select>
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
              <option value="Cucumber">Cucumber</option>
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
              value={inputs.plantCount}
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
              value={inputs.plantedDate}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer uppercase"
              onChange={(e) =>
                setInputs({ ...inputs, plantedDate: e.target.value })
              }
            />
          </div>

          <div className="lg:col-span-4 mt-4 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 md:flex-none bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:bg-emerald-400"
            >
              {isLoading ? "Calculating..." : "Calculate Prediction"}
            </button>
            <button
              type="button"
              onClick={() => {
                setInputs({ tunnelSize: "", crop: "Capsicum", plantCount: "", plantedDate: "" });
                setIsCalculated(false);
                setForecastResult(null);
                setAppliedInputs(null);
              }}
              className="bg-white hover:bg-slate-50 text-slate-500 hover:text-red-500 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all border-2 border-slate-100 hover:border-red-200 active:scale-[0.98]"
            >
              <RotateCcw size={18} /> Reset Prediction
            </button>
          </div>
        </form>
      </div>

      {isCalculated && forecastResult && appliedInputs && (
        <div
          ref={resultRef}
          data-aos="fade-up"
          className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 animate-in slide-in-from-bottom duration-700 scroll-mt-10"
        >
          <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">Forecast Calculations</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                Snapshot: {activeInputs.crop} • {activeInputs.tunnelSize} SQFT • {activeInputs.plantCount} Plants
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Expected Revenue"
              value={`Rs. ${(Math.round(Number(forecastResult.expectedMinIncome) / 1000) * 1000).toLocaleString()} - ${(Math.round(Number(forecastResult.expectedMaxIncome) / 1000) * 1000).toLocaleString()}`}
              subValue="Projected gross income range"
              icon={TrendingUp}
              color="bg-emerald-500"
              delay={0}
            />
            <StatCard
              title="Total Expected Yield"
              value={`${totalYieldKg.toLocaleString()} Kg`}
              subValue={`Estimated yield from ${activeInputs.plantCount} plants`}
              icon={Leaf}
              color="bg-purple-500"
              delay={100}
            />
            <StatCard
              title="Harvest Rounds"
              value={`${forecastResult.totalHarvests || 0} Times`}
              subValue={`Total pickings for ${activeInputs.plantCount} plants`}
              icon={Sprout}
              color="bg-blue-500"
              delay={200}
            />
            <StatCard
              title="Managing Cost"
              value={`Rs. ${totalManagingCost.toLocaleString()}`}
              subValue="Full Period (Excludes Labour)"
              icon={Wallet}
              color="bg-amber-500"
              delay={300}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeForecaster;
