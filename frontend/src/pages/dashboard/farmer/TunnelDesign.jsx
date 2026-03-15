import React, { useState } from 'react';
import { 
  Calculator, 
  Ruler, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Hammer,
  RotateCcw
} from 'lucide-react';

const TunnelDesign = () => {
  // State for inputs
  const [land, setLand] = useState({ length: '', width: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Constants (වෙනස් කරගන්න පුළුවන්)
  const BUFFER_SPACE = 4; // ඉඩමේ මායිමෙන් අඩි 4ක් ඉඩ තබයි (ඇතුලට යන්න එන්න පාරවල් වලට)
  const COST_PER_SQFT = 650; // වර්ග අඩියකට යන දළ වියදම (LKR) - යකඩ, පොලිතීන්, දැල් සහ කුලිය ඇතුලත්ව

  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    // Simulation of calculation delay
    setTimeout(() => {
      const len = parseFloat(land.length);
      const wid = parseFloat(land.width);

      // Validation
      if (!len || !wid || len <= 0 || wid <= 0) {
        setError("Please enter valid positive numbers for dimensions.");
        setLoading(false);
        return;
      }

      if (len < 15 || wid < 10) {
        setError("Land area is too small for a standard polytunnel. Minimum 15x10 ft required.");
        setLoading(false);
        return;
      }

      // Calculation Logic
      // ඉඩමේ ප්‍රමාණයෙන් Buffer එක අඩු කරලා Tunnel එකේ Size එක ගන්නවා
      const tunnelLength = len - BUFFER_SPACE; 
      const tunnelWidth = wid - BUFFER_SPACE;
      
      const tunnelArea = tunnelLength * tunnelWidth;
      const totalCost = tunnelArea * COST_PER_SQFT;
      
      // Calculate Material Estimates (Approximate)
      const giPipes = Math.ceil(tunnelLength / 5) + 2; // Arches count roughly
      const polythene = Math.ceil((tunnelLength + 10) * (tunnelWidth + 15)); // Extra for curvature

      setResult({
        tunnelLength: tunnelLength.toFixed(1),
        tunnelWidth: tunnelWidth.toFixed(1),
        area: tunnelArea.toFixed(1),
        cost: totalCost,
        details: {
          giPipes: giPipes,
          polythene: polythene
        }
      });
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setLand({ length: '', width: '' });
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Smart Structure Planner</h2>
          <p className="text-slate-500 text-sm">Calculate optimal polytunnel size and cost based on your land.</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
           <Calculator size={16} /> Auto-Estimator
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* --- 1. INPUT FORM --- */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Ruler className="text-emerald-500" size={20} /> Land Dimensions (square feet)
          </h3>
          
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Length (ft)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 50"
                  value={land.length}
                  onChange={(e) => setLand({...land, length: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Width (ft)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 20"
                  value={land.width}
                  onChange={(e) => setLand({...land, width: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm font-medium p-4 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Calculating...' : <>Generate Plan <ArrowRight size={18} /></>}
              </button>
              {result && (
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-4 rounded-xl transition-colors"
                >
                  <RotateCcw size={20} />
                </button>
              )}
            </div>
          </form>

          {/* Info Note */}
          <div className="mt-6 bg-blue-50 p-4 rounded-xl text-xs text-blue-700 leading-relaxed">
            <strong>Note:</strong> The system automatically deducts <strong>{BUFFER_SPACE} feet</strong> from length and width for maintenance paths and drainage.
          </div>
        </div>

        {/* --- 2. RESULTS DISPLAY --- */}
        <div className="relative">
          {result ? (
            <div className="space-y-6 animate-in zoom-in duration-500">
              
              {/* Cost Card */}
              <div className="bg-slate-900 text-white p-8 rounded-[2rem] relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Estimated Cost</p>
                  <h2 className="text-4xl font-black text-emerald-400">
                    LKR {result.cost.toLocaleString()}
                  </h2>
                  <p className="text-xs text-slate-500 mt-2">*Includes GI pipes, UV polythene, netting & labor estimate.</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              </div>

              {/* Dimensions Card */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" size={20} /> Recommended Structure
                </h4>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-emerald-50 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-emerald-600 uppercase">Tunnel Length</p>
                    <p className="text-2xl font-black text-slate-800">{result.tunnelLength} ft</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-emerald-600 uppercase">Tunnel Width</p>
                    <p className="text-2xl font-black text-slate-800">{result.tunnelWidth} ft</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Material Requirements</p>
                  <div className="space-y-2 text-sm font-medium text-slate-600">
                    <div className="flex justify-between">
                      <span><Hammer size={14} className="inline mr-2"/> GI Arches (Approx)</span>
                      <span className="font-bold text-slate-900">{result.details.giPipes} Units</span>
                    </div>
                    <div className="flex justify-between">
                      <span><DollarSign size={14} className="inline mr-2"/> Polythene Area</span>
                      <span className="font-bold text-slate-900">{result.details.polythene} sq.ft</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            // Placeholder State (Empty)
            <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Calculator size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-400">Waiting for Data</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-xs">Enter your land dimensions to generate a cost-effective structural plan.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TunnelDesign;