import React, { useState, useEffect, useRef } from "react";
import {
  Calculator,
  Ruler,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Package,
  Info,
  Layout,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

// --- Custom Blueprint Canvas Component ---
const PolytunnelCanvas = ({ width, length }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.textAlign = "center";

    const cW = canvas.width;

    const topW = cW * 0.25;
    const topH = 100;
    const topX = 50;
    const topY = 80;
    ctx.strokeStyle = "#1e293b";
    ctx.fillStyle = "rgba(186, 230, 253, 0.3)";
    ctx.fillRect(topX, topY, topW, topH);
    ctx.strokeRect(topX, topY, topW, topH);
    ctx.strokeStyle = "#cbd5e1";
    for (let i = 1; i < 6; i++) {
      const archX = topX + (topW * i) / 6;
      ctx.beginPath();
      ctx.moveTo(archX, topY);
      ctx.lineTo(archX, topY + topH);
      ctx.stroke();
    }
    ctx.fillStyle = "#64748b";
    ctx.fillText("TOP VIEW (PLAN)", topX + topW / 2, topY - 20);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(`${length} ft`, topX + topW / 2, topY + topH + 20);

    const frontW = 120;
    const frontH = 60;
    const frontX = topX + topW + 80;
    const frontY = topY + topH - frontH;
    ctx.strokeStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(frontX - 20, frontY + frontH);
    ctx.lineTo(frontX + frontW + 20, frontY + frontH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(frontX, frontY + frontH);
    ctx.bezierCurveTo(
      frontX,
      frontY - 10,
      frontX + frontW,
      frontY - 10,
      frontX + frontW,
      frontY + frontH,
    );
    ctx.fillStyle = "rgba(167, 243, 208, 0.4)";
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.stroke();
    ctx.fillStyle = "#64748b";
    ctx.fillText(
      "SIDE VIEW (FRONT)",
      frontX + frontW / 2,
      frontY + frontH + 20,
    );

    const sideViewW = 180;
    const sideViewH = 60;
    const sideViewX = frontX + frontW + 80;
    const sideViewY = topY + topH - sideViewH;
    ctx.strokeStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(sideViewX - 20, sideViewY + sideViewH);
    ctx.lineTo(sideViewX + sideViewW + 20, sideViewY + sideViewH);
    ctx.stroke();
    ctx.fillStyle = "rgba(203, 213, 225, 0.3)";
    ctx.fillRect(sideViewX, sideViewY, sideViewW, sideViewH);
    ctx.strokeStyle = "#1e293b";
    ctx.strokeRect(sideViewX, sideViewY, sideViewW, sideViewH);
    ctx.fillStyle = "#64748b";
    ctx.fillText(
      "SIDE VIEW (SIDE)",
      sideViewX + sideViewW / 2,
      sideViewY + sideViewH + 20,
    );
  }, [width, length]);

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm mt-6 w-full animate-in fade-in duration-700">
      <h4 className="font-black text-slate-800 mb-8 flex items-center gap-3 text-sm uppercase tracking-widest">
        <Layout size={20} className="text-emerald-500" /> Technical Structural
        Blueprint
      </h4>
      <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 h-[350px] overflow-x-auto shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full min-w-[800px]" />
      </div>
    </div>
  );
};

const TunnelDesign = () => {
  const [land, setLand] = useState({ length: "", width: "" });
  const [result, setResult] = useState(null);
  const [allConfigs, setAllConfigs] = useState([]);
  const [availableConfigs, setAvailableConfigs] = useState([]);

  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [typesForSelectedSize, setTypesForSelectedSize] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const BUFFER = 4;

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tunnel/configs");
        setAllConfigs(res.data);
      } catch (err) {
        console.error("Error fetching tunnel configs:", err);
      }
    };
    fetchConfigs();
  }, []);

  const processResult = (config) => {
    const estimatedWidth = Math.sqrt(config.size / 4);
    const estimatedLength = config.size / estimatedWidth;

    setResult({
      ...config,
      length: estimatedLength.toFixed(0),
      width: estimatedWidth.toFixed(0),
      poly: (config.size * 1.6).toFixed(0),
      mesh: (Math.sqrt(config.size) * 40).toFixed(0),
      arches: Math.ceil(estimatedLength / 10) + 1,
      cost: config.size * config.pricePerSqft,
      showWarning: config.size >= 5000,
    });
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    setTimeout(() => {
      const l = parseFloat(land.length);
      const w = parseFloat(land.width);

      if (!l || !w || l <= 0 || w <= 0) {
        setError("Please enter valid dimensions.");
        setLoading(false);
        return;
      }

      const netArea = (l - BUFFER) * (w - BUFFER);
      const possible = allConfigs.filter((c) => netArea >= c.size);

      if (possible.length === 0) {
        setError("Land area is too small for any configuration.");
        setLoading(false);
        return;
      }

      setAvailableConfigs(possible);
      const sizes = [...new Set(possible.map((c) => c.size))].sort(
        (a, b) => b - a,
      );
      setUniqueSizes(sizes);

      const initialSize = sizes[0];
      setSelectedSize(initialSize);

      const filteredTypes = possible.filter((c) => c.size === initialSize);
      setTypesForSelectedSize(filteredTypes);

      const initialConfig = filteredTypes[0];
      setSelectedType(initialConfig.type);
      processResult(initialConfig);

      setLoading(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }, 800);
  };

  const onSizeChange = (size) => {
    const sizeVal = parseInt(size);
    setSelectedSize(sizeVal);
    const filteredTypes = availableConfigs.filter((c) => c.size === sizeVal);
    setTypesForSelectedSize(filteredTypes);
    const firstType = filteredTypes[0];
    setSelectedType(firstType.type);
    processResult(firstType);
  };

  const onTypeChange = (type) => {
    setSelectedType(type);
    const selectedConfig = typesForSelectedSize.find((c) => c.type === type);
    if (selectedConfig) processResult(selectedConfig);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 pb-20 font-sans text-slate-800">
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* Header */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight uppercase">
            Smart Structure Planner
          </h2>
          <p className="text-slate-400 text-sm font-bold">
            Engineering Blueprint & Advisor
          </p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
          <Calculator size={16} /> Technical Advisor
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <form onSubmit={handleCalculate} className="space-y-8">
          <h3 className="font-bold text-slate-800 flex items-center gap-3">
            <Ruler className="text-emerald-500" size={22} /> Land Dimensions
            (ft)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Length
              </label>
              <input
                type="number"
                value={land.length}
                onChange={(e) => setLand({ ...land, length: e.target.value })}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) =>
                  (e.key === "ArrowUp" || e.key === "ArrowDown") &&
                  e.preventDefault()
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                placeholder="0"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Width
              </label>
              <input
                type="number"
                value={land.width}
                onChange={(e) => setLand({ ...land, width: e.target.value })}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) =>
                  (e.key === "ArrowUp" || e.key === "ArrowDown") &&
                  e.preventDefault()
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                placeholder="0"
              />
            </div>
          </div>
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
              ⚠️ {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                Generate Comprehensive Plan <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Recommendation Section */}
      <div ref={resultRef} className="scroll-mt-10">
        {result ? (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in zoom-in duration-500 space-y-12">
            {/* New Warning Notice Section */}
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-[1.5rem] flex items-start gap-4 shadow-sm">
              <AlertCircle
                className="text-amber-600 shrink-0 mt-0.5"
                size={20}
              />
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                  Safety Advisory
                </h4>
                <p className="text-xs font-black text-amber-700 uppercase leading-relaxed">
                  NOTICE: WE RECOMMEND STARTING WITH A MAX 2,500 SQFT STRUCTURE
                  IF YOU ARE NEW TO THIS FIELD.
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-10">
              <h3 className="font-bold text-slate-800 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500" size={22} />{" "}
                Selection
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">
                    1. Select Size
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSize}
                      onChange={(e) => onSizeChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20"
                    >
                      {uniqueSizes.map((size) => (
                        <option key={size} value={size}>
                          {size} SQFT
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">
                    2. Select Type
                  </label>
                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => onTypeChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20"
                    >
                      {typesForSelectedSize.map((c) => (
                        <option key={c._id} value={c.type}>
                          {c.type} Model
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100/50 relative overflow-hidden group shadow-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-2">
                  {result.type} Tier
                </p>
                <p className="text-5xl font-black text-slate-800">
                  {result.size} <span className="text-sm">SQFT</span>
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                  Estimated Budget
                </p>
                <p className="text-4xl font-black text-emerald-600 tracking-tight">
                  LKR {result.cost.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                <Package size={22} className="mx-auto mb-3 text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  GI Pipes
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {result.arches}{" "}
                  <span className="text-xs font-bold text-slate-400">Sets</span>
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                <div className="w-5 h-5 mx-auto mb-3 bg-blue-100 rounded-sm border border-blue-200"></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  UV Poly
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {result.poly}{" "}
                  <span className="text-xs font-bold text-slate-400">FT²</span>
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                <div className="w-5 h-5 mx-auto mb-3 bg-emerald-100 rounded-sm border border-emerald-200"></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Mesh
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {result.mesh}{" "}
                  <span className="text-xs font-bold text-slate-400">FT²</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center flex flex-col items-center justify-center">
            <Calculator size={48} className="text-slate-200 mb-4" />
            <h3 className="text-slate-400 font-bold uppercase text-sm tracking-widest">
              Awaiting Data
            </h3>
            <p className="text-slate-300 text-xs mt-1 font-medium">
              Input land area to see dynamic recommendations.
            </p>
          </div>
        )}
      </div>

      {result && (
        <PolytunnelCanvas width={result.width} length={result.length} />
      )}

      {result && (
        <button
          onClick={() => {
            setResult(null);
            setLand({ length: "", width: "" });
          }}
          className="w-full py-5 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 hover:text-emerald-600 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
        >
          <RotateCcw size={18} /> Reset Planner Tool
        </button>
      )}
    </div>
  );
};

export default TunnelDesign;
