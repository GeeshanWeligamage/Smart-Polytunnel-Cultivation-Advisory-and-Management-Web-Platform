import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  RefreshCw,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

const ManageCrops = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    cropName: "",
    category: "Vegetable",
    priceMin: "",
    priceMax: "",
    image: "",
  });

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/prices");
      const data = await res.json();
      setPrices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert(
        "සමාවන්න, මෙම ඡායාරූපය 10MB ට වඩා වැඩියි. කරුණාකර කුඩා ඡායාරූපයක් තෝරන්න.",
      );
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          cropName: "",
          category: "Vegetable",
          priceMin: "",
          priceMax: "",
          image: "",
        });
        fetchPrices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePrice = async (id) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        await fetch(`http://localhost:5000/api/prices/${id}`, {
          method: "DELETE",
        });
        fetchPrices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Manage Crops
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} /> Add New Crop
        </button>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 flex flex-col items-center gap-3">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
            <span className="font-bold text-slate-400">Loading Crops...</span>
          </div>
        ) : (
          prices.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="h-44 overflow-hidden bg-slate-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>
              <div className="p-5 space-y-4">
                <h4 className="text-lg font-black text-slate-800 tracking-tight">
                  {item.cropName}
                </h4>
                <button
                  onClick={() => deletePrice(item._id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-2xl text-xs font-black hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 size={16} /> Delete Crop
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Crop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-10 pb-4">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Add New Crop
              </h2>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-10 py-2 custom-scrollbar">
              <form
                id="add-crop-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nai Miris"
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={(e) =>
                      setFormData({ ...formData, cropName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Category
                  </label>
                  <select
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Vegetable</option>
                    <option>Fruits</option>
                    <option>Grains</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      placeholder="150"
                      required
                      /* Arrows ඉවත් කිරීමට අවශ්‍ය CSS classes මෙන්න */
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      onChange={(e) =>
                        setFormData({ ...formData, priceMin: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      placeholder="180"
                      required
                      /* Arrows ඉවත් කිරීමට අවශ්‍ය CSS classes මෙන්න */
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      onChange={(e) =>
                        setFormData({ ...formData, priceMax: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2 pb-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Crop Image (Max 10MB)
                  </label>
                  <div className="flex flex-col items-center gap-4">
                    {!formData.image ? (
                      <label className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group">
                        <Upload
                          size={28}
                          className="text-slate-400 mb-2 group-hover:text-blue-500 transition-colors"
                        />
                        <span className="text-xs font-bold text-slate-500 text-center">
                          Click to upload photo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          required
                        />
                      </label>
                    ) : (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-blue-100 shadow-inner group">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, image: "" })
                            }
                            className="bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-all"
                          >
                            Remove & Change
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-10 pt-4 bg-white border-t border-slate-50 rounded-b-[2.5rem] flex gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 font-black text-slate-500 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-crop-form"
                className="flex-1 py-4 font-black bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCrops;
