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
  Wind,
  Droplets,
  Settings,
  ShieldCheck,
  Construction,
  Sun,
  Maximize,
  Layers,
  Sprout,
} from "lucide-react";
import axios from "axios";

// --- Custom Blueprint Canvas Component ---
const PolytunnelCanvas = ({ width, length }) => {
  const canvasRef = useRef(null);
  const tunnelHeight = 12; // Standard polytunnel height in ft
  const archSpacing = 10; // Spacing between arches in ft
  const numArches = Math.ceil(Number(length) / archSpacing) + 1;

  // Helper: draw a dimension line with arrows and label
  const drawDimLine = (ctx, x1, y1, x2, y2, label, offset = 0, color = "#10b981") => {
    const isHorizontal = Math.abs(y2 - y1) < 2;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);

    const arrowSize = 6;

    if (isHorizontal) {
      const oy = offset;
      // extension lines
      ctx.strokeStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1, y1 + oy);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2, y2 + oy);
      ctx.stroke();
      // main line
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1, y1 + oy);
      ctx.lineTo(x2, y2 + oy);
      ctx.stroke();
      // left arrow
      ctx.beginPath();
      ctx.moveTo(x1, y1 + oy);
      ctx.lineTo(x1 + arrowSize, y1 + oy - arrowSize / 2);
      ctx.lineTo(x1 + arrowSize, y1 + oy + arrowSize / 2);
      ctx.closePath();
      ctx.fill();
      // right arrow
      ctx.beginPath();
      ctx.moveTo(x2, y2 + oy);
      ctx.lineTo(x2 - arrowSize, y2 + oy - arrowSize / 2);
      ctx.lineTo(x2 - arrowSize, y2 + oy + arrowSize / 2);
      ctx.closePath();
      ctx.fill();
      // label
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0f172a";
      const midX = (x1 + x2) / 2;
      const textY = y1 + oy + (oy >= 0 ? 14 : -10);
      // label background
      const tw = ctx.measureText(label).width + 12;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(midX - tw / 2, textY - 8, tw, 16);
      ctx.fillStyle = color;
      ctx.font = "800 11px Inter, sans-serif";
      ctx.fillText(label, midX, textY);
    } else {
      const ox = offset;
      // extension lines
      ctx.strokeStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + ox, y1);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 + ox, y2);
      ctx.stroke();
      // main line
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1 + ox, y1);
      ctx.lineTo(x2 + ox, y2);
      ctx.stroke();
      // top arrow
      ctx.beginPath();
      ctx.moveTo(x1 + ox, y1);
      ctx.lineTo(x1 + ox - arrowSize / 2, y1 + arrowSize);
      ctx.lineTo(x1 + ox + arrowSize / 2, y1 + arrowSize);
      ctx.closePath();
      ctx.fill();
      // bottom arrow
      ctx.beginPath();
      ctx.moveTo(x2 + ox, y2);
      ctx.lineTo(x2 + ox - arrowSize / 2, y2 - arrowSize);
      ctx.lineTo(x2 + ox + arrowSize / 2, y2 - arrowSize);
      ctx.closePath();
      ctx.fill();
      // label
      ctx.font = "800 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const midY = (y1 + y2) / 2;
      const textX = x1 + ox + (ox >= 0 ? 16 : -16);
      ctx.save();
      ctx.translate(textX, midY);
      ctx.rotate(-Math.PI / 2);
      const tw = ctx.measureText(label).width + 12;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-tw / 2, -8, tw, 16);
      ctx.fillStyle = color;
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const cW = rect.width;
    const cH = rect.height;
    ctx.clearRect(0, 0, cW, cH);

    // --- SECTION SPACING ---
    const sectionWidth = (cW - 80) / 3;
    const margin = 20;

    // ===========================
    // 1. TOP VIEW (PLAN)
    // ===========================
    const topX = margin + 30;
    const topY = 65;
    const topW = sectionWidth - 60;
    const topH = topW * 0.45;

    // Title
    ctx.font = "800 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#64748b";
    ctx.fillText("TOP VIEW (PLAN)", topX + topW / 2, topY - 30);

    // Main rectangle fill
    ctx.fillStyle = "rgba(186, 230, 253, 0.25)";
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.fillRect(topX, topY, topW, topH);
    ctx.strokeRect(topX, topY, topW, topH);

    // Arch lines (dashed)
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 1; i < numArches - 1; i++) {
      const ax = topX + (topW * i) / (numArches - 1);
      ctx.beginPath();
      ctx.moveTo(ax, topY);
      ctx.lineTo(ax, topY + topH);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Arch count label
    ctx.font = "600 9px Inter, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`${numArches} arches @ ${archSpacing} ft spacing`, topX + topW / 2, topY + topH / 2 + 4);

    // Dimension: Length (bottom)
    drawDimLine(ctx, topX, topY + topH, topX + topW, topY + topH, `${length} ft (Length)`, 22, "#10b981");
    // Dimension: Width (left side)
    drawDimLine(ctx, topX, topY, topX, topY + topH, `${width} ft (W)`, -28, "#3b82f6");

    // ===========================
    // 2. FRONT VIEW (CROSS SECTION)
    // ===========================
    const frontCX = margin + sectionWidth + sectionWidth / 2;
    const frontW = sectionWidth * 0.5;
    const frontH = frontW * 0.55;
    const frontBaseY = topY + topH + 10;
    const frontX = frontCX - frontW / 2;
    const frontTopY = frontBaseY - frontH;

    // Title
    ctx.font = "800 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#64748b";
    ctx.fillText("FRONT VIEW (CROSS SECTION)", frontCX, topY - 30);

    // Ground line
    ctx.strokeStyle = "#78716c";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(frontX - 25, frontBaseY);
    ctx.lineTo(frontX + frontW + 25, frontBaseY);
    ctx.stroke();
    // Ground hatch
    ctx.strokeStyle = "#d6d3d1";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const hx = frontX - 20 + i * 20;
      ctx.beginPath();
      ctx.moveTo(hx, frontBaseY);
      ctx.lineTo(hx - 8, frontBaseY + 8);
      ctx.stroke();
    }

    // Arch shape (semi-ellipse)
    ctx.beginPath();
    ctx.moveTo(frontX, frontBaseY);
    ctx.bezierCurveTo(
      frontX, frontTopY - frontH * 0.15,
      frontX + frontW, frontTopY - frontH * 0.15,
      frontX + frontW, frontBaseY
    );
    ctx.fillStyle = "rgba(167, 243, 208, 0.3)";
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Vertical center dashed line
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(frontCX, frontBaseY);
    ctx.lineTo(frontCX, frontTopY - frontH * 0.08);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dimension: Width (bottom)
    drawDimLine(ctx, frontX, frontBaseY, frontX + frontW, frontBaseY, `${width} ft (Width)`, 22, "#3b82f6");
    // Dimension: Height (right side)
    const archPeakY = frontTopY - frontH * 0.08;
    drawDimLine(ctx, frontX + frontW, archPeakY, frontX + frontW, frontBaseY, `${tunnelHeight} ft (H)`, 28, "#f59e0b");

    // ===========================
    // 3. SIDE VIEW (ELEVATION)
    // ===========================
    const sideX = margin + sectionWidth * 2 + 30;
    const sideW = sectionWidth - 60;
    const sideH = sideW * 0.35;
    const sideBaseY = frontBaseY;
    const sideTopY = sideBaseY - sideH;

    // Title
    ctx.font = "800 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#64748b";
    ctx.fillText("SIDE VIEW (ELEVATION)", sideX + sideW / 2, topY - 30);

    // Ground line
    ctx.strokeStyle = "#78716c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sideX - 20, sideBaseY);
    ctx.lineTo(sideX + sideW + 20, sideBaseY);
    ctx.stroke();
    // Ground hatch
    ctx.strokeStyle = "#d6d3d1";
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const hx = sideX - 15 + i * 20;
      ctx.beginPath();
      ctx.moveTo(hx, sideBaseY);
      ctx.lineTo(hx - 8, sideBaseY + 8);
      ctx.stroke();
    }

    // Main body rectangle
    ctx.fillStyle = "rgba(203, 213, 225, 0.2)";
    ctx.fillRect(sideX, sideTopY, sideW, sideH);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.strokeRect(sideX, sideTopY, sideW, sideH);

    // Arch top curve
    ctx.beginPath();
    ctx.moveTo(sideX, sideTopY);
    ctx.bezierCurveTo(
      sideX + sideW * 0.1, sideTopY - sideH * 0.25,
      sideX + sideW * 0.9, sideTopY - sideH * 0.25,
      sideX + sideW, sideTopY
    );
    ctx.fillStyle = "rgba(167, 243, 208, 0.2)";
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Vertical arch lines inside
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 1; i < numArches - 1; i++) {
      const ax = sideX + (sideW * i) / (numArches - 1);
      ctx.beginPath();
      ctx.moveTo(ax, sideTopY);
      ctx.lineTo(ax, sideBaseY);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Dimension: Length (bottom)
    drawDimLine(ctx, sideX, sideBaseY, sideX + sideW, sideBaseY, `${length} ft (Length)`, 22, "#10b981");
    // Dimension: Height (left side)
    drawDimLine(ctx, sideX, sideTopY, sideX, sideBaseY, `${tunnelHeight} ft (H)`, -28, "#f59e0b");

    // ===========================
    // LEGEND
    // ===========================
    const legendY = cH - 18;
    ctx.font = "700 9px Inter, sans-serif";
    ctx.textAlign = "left";
    const legendItems = [
      { color: "#10b981", label: "Length" },
      { color: "#3b82f6", label: "Width" },
      { color: "#f59e0b", label: "Height" },
    ];
    let lx = margin + 10;
    legendItems.forEach((item) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(lx, legendY - 4, 12, 8);
      ctx.fillStyle = "#64748b";
      ctx.fillText(item.label, lx + 16, legendY + 3);
      lx += ctx.measureText(item.label).width + 36;
    });

    // Specs summary on right
    ctx.textAlign = "right";
    ctx.font = "700 9px Inter, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(
      `${length}L × ${width}W × ${tunnelHeight}H ft  |  ${numArches} Arches  |  ${Number(length) * Number(width)} sqft`,
      cW - margin - 10,
      legendY + 3
    );
  }, [width, length, numArches]);

  return (
    <div data-aos="fade-up" className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm mt-6 w-full animate-in fade-in duration-700">
      <h4 className="font-black text-slate-800 mb-8 flex items-center gap-3 text-sm uppercase tracking-widest">
        <Layout size={20} className="text-emerald-500" /> Technical Structural
        Blueprint
      </h4>
      <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 h-[380px] overflow-x-auto shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full min-w-[900px]" />
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

  // Defines the custom sorting order for types
  const typeOrder = { Basic: 1, Moderate: 2, "High-Tech": 3 };

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

  const getIncludedItems = (type) => {
    const baseItems = [
      { name: "GI Pipes (Structure)", icon: <Construction size={16} /> },
      { name: "Shade Net", icon: <Layers size={16} /> },
      { name: "UV Polythine", icon: <Sun size={16} /> },
      { name: "Insect Proof Net", icon: <ShieldCheck size={16} /> },
    ];

    if (type === "Moderate") {
      return [
        ...baseItems,
        { name: "Exhaust Fans", icon: <Wind size={16} /> },
        { name: "Cooling Pads", icon: <Droplets size={16} /> },
      ];
    }

    if (type === "High-Tech") {
      return [
        ...baseItems,
        { name: "Exhaust Fans", icon: <Wind size={16} /> },
        { name: "Cooling Pads", icon: <Droplets size={16} /> },
        { name: "Automation Systems", icon: <Settings size={16} /> },
        { name: "Internal Fences", icon: <Maximize size={16} /> },
        { name: "Supporting Yarns", icon: <Sprout size={16} /> },
      ];
    }

    return baseItems;
  };

  const processResult = (config) => {
    const l = parseFloat(land.length) || 0;
    const w = parseFloat(land.width) || 0;
    const targetArea = config.size;

    let estimatedLength, estimatedWidth;

    if (l > BUFFER && w > BUFFER) {
      const maxL = l - BUFFER;
      const maxW = w - BUFFER;

      // Start with standard 4:1 aspect ratio
      let idealW = Math.sqrt(targetArea / 4);
      let idealL = targetArea / idealW;

      let finalL, finalW;
      // Match the physical orientation of the land
      if (maxW > maxL) {
        finalW = Math.max(idealL, idealW);
        finalL = Math.min(idealL, idealW);
      } else {
        finalL = Math.max(idealL, idealW);
        finalW = Math.min(idealL, idealW);
      }

      // Enforce boundary limits. If constrained, recalculate other dimension.
      if (finalL > maxL) {
        finalL = maxL;
        finalW = targetArea / finalL;
      }
      if (finalW > maxW) {
        finalW = maxW;
        finalL = targetArea / finalW;
      }

      estimatedLength = finalL;
      estimatedWidth = finalW;
    } else {
      // Fallback to hardcoded ratio
      estimatedWidth = Math.sqrt(targetArea / 4);
      estimatedLength = targetArea / estimatedWidth;
    }

    setResult({
      ...config,
      length: estimatedLength.toFixed(0),
      width: estimatedWidth.toFixed(0),
      poly: (config.size * 1.6).toFixed(0),
      mesh: (Math.sqrt(config.size) * 40).toFixed(0),
      arches: Math.ceil(estimatedLength / 10) + 1,
      cost: config.size * config.pricePerSqft,
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

      // Filter and Sort types for the selected size
      const filteredTypes = possible
        .filter((c) => c.size === initialSize)
        .sort((a, b) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99));

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
    const filteredTypes = availableConfigs
      .filter((c) => c.size === sizeVal)
      .sort((a, b) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99));

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
      <div data-aos="fade-down" className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
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
      <div data-aos="fade-up" data-aos-delay="100" className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <form onSubmit={handleCalculate} className="space-y-8">
          <h3 className="font-bold text-slate-800 flex items-center gap-3">
            <Ruler className="text-emerald-500" size={22} /> Land Dimensions
            (ft)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Length(ft)
              </label>
              <input
                type="number"
                value={land.length}
                onChange={(e) => setLand({ ...land, length: e.target.value })}
                onWheel={(e) => e.target.blur()}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                placeholder="ft"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Width(ft)
              </label>
              <input
                type="number"
                value={land.width}
                onChange={(e) => setLand({ ...land, width: e.target.value })}
                onWheel={(e) => e.target.blur()}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                placeholder="ft"
              />
            </div>
          </div>
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
              ⚠️ {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Generate Comprehensive Plan <ArrowRight size={20} />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setLand({ length: "", width: "" });
                setError("");
                setSelectedSize("");
                setSelectedType("");
                setAvailableConfigs([]);
                setUniqueSizes([]);
                setTypesForSelectedSize([]);
              }}
              className="sm:w-auto bg-white hover:bg-slate-50 text-slate-500 hover:text-red-500 p-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border-2 border-slate-100 hover:border-red-200 active:scale-[0.98]"
            >
              <RotateCcw size={18} /> Reset Plan
            </button>
          </div>
        </form>
      </div>

      {/* Result Section */}
      <div ref={resultRef} className="scroll-mt-10">
        {result ? (
          <div data-aos="fade-up" className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in zoom-in duration-500 space-y-10">
            {/* Warning - only for size > 2500 */}
            {result.size > 2500 && (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-[1.5rem] flex items-start gap-4 shadow-sm animate-in fade-in">
                <AlertCircle
                  className="text-amber-600 shrink-0 mt-0.5"
                  size={20}
                />
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                    Safety Advisory
                  </h4>
                  <p className="text-xs font-black text-amber-700 uppercase leading-relaxed">
                    NOTICE: WE RECOMMEND STARTING WITH A MAX 2,500 SQFT
                    STRUCTURE IF YOU ARE NEW TO THIS FIELD.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-10">
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

              {/* Dynamic Components List */}
              <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Info size={14} className="text-blue-500" /> What's included
                  in {selectedType} package:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getIncludedItems(selectedType).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white p-3 px-4 rounded-xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="text-emerald-500">{item.icon}</div>
                      <span className="text-xs font-bold text-slate-700">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget & Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100/50 shadow-sm">
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
