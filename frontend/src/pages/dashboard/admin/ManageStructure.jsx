import React, { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Trash2,
  RefreshCw,
  Layers,
  Edit2,
  X,
  Check,
} from "lucide-react";
import axios from "axios";

const ManageStructure = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [formData, setFormData] = useState({
    size: "",
    pricePerSqft: "",
    type: "Basic",
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/tunnel/configs");
      setConfigs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tunnel/configs", formData);
      alert("Configuration Saved! ✅");
      setFormData({ size: "", pricePerSqft: "", type: "Basic" });
      fetchConfigs();
    } catch (err) {
      alert("Error saving configuration ❌");
    }
  };

  const handleUpdatePrice = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tunnel/configs/${id}`, {
        pricePerSqft: editPrice,
      });
      setEditId(null);
      fetchConfigs();
    } catch (err) {
      alert("Update failed ❌");
    }
  };

  const deleteConfig = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tunnel/configs/${id}`);
        fetchConfigs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Function to filter configs by type
  const renderTypeSection = (type, colorClass) => {
    const filtered = configs.filter((item) => item.type === type);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
          <h4 className="font-black uppercase text-sm tracking-tighter text-slate-700">
            {type} Models
          </h4>
          <span className="ml-auto text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">
            {filtered.length} Items
          </span>
        </div>
        <div className="grid gap-3">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white ${colorClass}`}
                >
                  <span className="text-[8px] font-bold opacity-70 uppercase tracking-tighter">
                    SQFT
                  </span>
                  <span className="text-sm font-black">{item.size}</span>
                </div>
                <div>
                  {editId === item._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-24 p-1 border-2 border-blue-500 rounded-lg text-sm font-bold outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdatePrice(item._id)}
                        className="p-1 text-emerald-500 hover:bg-emerald-50 rounded-md"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        Price per SQFT
                      </p>
                      <p className="text-lg font-black text-slate-800 tracking-tight">
                        Rs. {item.pricePerSqft}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditId(item._id);
                    setEditPrice(item.pricePerSqft);
                  }}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteConfig(item._id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-[10px] text-slate-400 font-bold italic text-center py-4">
              No {type} models added yet.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-10 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      <style>{`
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
            <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
            Structure Management
          </h2>
          <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">
            Master Pricing Control
          </p>
        </div>
        <button
          onClick={fetchConfigs}
          className="p-3 bg-white border border-slate-200 rounded-xl hover:text-blue-600 transition-all shadow-sm"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Form Section */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl h-fit">
          <h3 className="font-black text-xl mb-6 uppercase tracking-tight flex items-center gap-2">
            <Plus className="text-blue-600" /> New Config
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-black outline-none focus:border-blue-500 transition-all"
              >
                <option value="Basic">Basic Tunnel</option>
                <option value="Moderate">Moderate Tunnel</option>
                <option value="High-Tech">High-Tech Tunnel</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Size (SQFT)
              </label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-black focus:border-blue-500 outline-none"
                required
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) =>
                  (e.key === "ArrowUp" || e.key === "ArrowDown") &&
                  e.preventDefault()
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Price (LKR)
              </label>
              <input
                type="number"
                value={formData.pricePerSqft}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerSqft: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-black focus:border-blue-500 outline-none"
                required
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) =>
                  (e.key === "ArrowUp" || e.key === "ArrowDown") &&
                  e.preventDefault()
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            >
              <Save size={20} /> Save Configuration
            </button>
          </form>
        </div>

        {/* List Sections */}
        <div className="lg:col-span-8 grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-20 font-bold text-slate-400 animate-pulse uppercase tracking-widest">
              Loading Data...
            </div>
          ) : (
            <>
              <div className="lg:col-span-1">
                {renderTypeSection("Basic", "bg-slate-900")}
              </div>
              <div className="lg:col-span-1">
                {renderTypeSection("Moderate", "bg-blue-600")}
              </div>
              <div className="lg:col-span-1">
                {renderTypeSection("High-Tech", "bg-purple-600")}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStructure;
