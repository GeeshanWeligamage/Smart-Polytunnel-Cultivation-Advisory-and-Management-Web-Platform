import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X, RefreshCw, History } from "lucide-react";

const PriceManagement = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);

  // සාමාන්‍ය බෝගයක් ඇතුළත් කිරීමට
  const [formData, setFormData] = useState({
    cropName: "",
    category: "Vegetable",
    priceMin: "",
    priceMax: "",
    image: "",
  });

  // දිනපතා මිල update කිරීමට
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [dailyData, setDailyData] = useState({
    date: new Date().toISOString().split("T")[0],
    priceMin: "",
    priceMax: "",
  });

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
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

  // අලුත් බෝගයක් මුලින්ම ඇතුළත් කිරීම
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

  // දිනපතා මිල Update කිරීම (PUT Request)
  const handleDailyUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/prices/update-daily/${selectedCrop._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dailyData),
        },
      );
      if (res.ok) {
        setIsDailyModalOpen(false);
        setDailyData({
          date: new Date().toISOString().split("T")[0],
          priceMin: "",
          priceMax: "",
        });
        fetchPrices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePrice = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this crop and its entire history?",
      )
    ) {
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

  const openDailyUpdate = (crop) => {
    setSelectedCrop(crop);
    setDailyData({
      ...dailyData,
      priceMin: crop.currentPriceMin,
      priceMax: crop.currentPriceMax,
    });
    setIsDailyModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">
          Crop Price Control Panel
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> Add New Crop
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Crop Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Current Price (Rs)
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10">
                  <RefreshCw className="animate-spin inline mr-2" /> Loading...
                </td>
              </tr>
            ) : (
              prices.map((price) => (
                <tr
                  key={price._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={price.image}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-800">
                        {price.cropName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {price.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-blue-600">
                      {price.currentPriceMin} - {price.currentPriceMax}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openDailyUpdate(price)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                      title="Update Today's Price"
                    >
                      <History size={18} />
                    </button>
                    <button
                      onClick={() => deletePrice(price._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL: ADD NEW CROP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black mb-6">Register New Crop</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Crop Name"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                onChange={(e) =>
                  setFormData({ ...formData, cropName: e.target.value })
                }
              />
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option>Vegetable</option>
                <option>Fruits</option>
                <option>Grains</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Initial Min Price"
                  required
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  onChange={(e) =>
                    setFormData({ ...formData, priceMin: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Initial Max Price"
                  required
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  onChange={(e) =>
                    setFormData({ ...formData, priceMax: e.target.value })
                  }
                />
              </div>
              <input
                type="text"
                placeholder="Image URL"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 font-bold text-slate-500 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 font-bold bg-blue-600 text-white rounded-xl"
                >
                  Save Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: DAILY PRICE UPDATE --- */}
      {isDailyModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800">
                Update Prices
              </h2>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-bold">
                {selectedCrop?.cropName}
              </span>
            </div>
            <form onSubmit={handleDailyUpdate} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Update Date
                </label>
                <input
                  type="date"
                  value={dailyData.date}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  onChange={(e) =>
                    setDailyData({ ...dailyData, date: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={dailyData.priceMin}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    onChange={(e) =>
                      setDailyData({ ...dailyData, priceMin: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={dailyData.priceMax}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    onChange={(e) =>
                      setDailyData({ ...dailyData, priceMax: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsDailyModalOpen(false)}
                  className="flex-1 py-3 font-bold text-slate-500 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 font-bold bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Update Today
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceManagement;
