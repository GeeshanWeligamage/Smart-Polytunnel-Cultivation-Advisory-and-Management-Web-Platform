import React, { useState } from "react";
import {
  Plus,
  Newspaper,
  ShieldAlert,
  TrendingUp,
  Trash2,
  Edit,
  Settings,
  CheckCircle,
  X,
  Save,
  Layout,
} from "lucide-react";

const OverviewManage = () => {
  const [activeTab, setActiveTab] = useState("prices");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Switch content based on selected tab
  const renderContent = () => {
    switch (activeTab) {
      case "prices":
        return <PriceManagement onOpenModal={() => setIsModalOpen(true)} />;
      case "advisory":
        return <AdvisoryManagement onOpenModal={() => setIsModalOpen(true)} />;
      case "news":
        return <NewsManagement onOpenModal={() => setIsModalOpen(true)} />;
      default:
        return <PriceManagement onOpenModal={() => setIsModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* --- Admin Sidebar --- */}
      <aside className="w-64 h-full bg-slate-900 text-white flex flex-col border-r border-slate-800">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Settings size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight uppercase">
            Overview Manage
          </span>
        </div>

        <div className="flex-1 py-8 px-4 space-y-2">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2 text-center border-b border-slate-800 pb-2">
            Control Panel
          </p>
          <SidebarLink
            id="prices"
            icon={<TrendingUp size={18} />}
            label="Market Prices"
            active={activeTab}
            onClick={setActiveTab}
          />
          <SidebarLink
            id="advisory"
            icon={<ShieldAlert size={18} />}
            label="Expert Advisory"
            active={activeTab}
            onClick={setActiveTab}
          />
          <SidebarLink
            id="news"
            icon={<Newspaper size={18} />}
            label="Government News"
            active={activeTab}
            onClick={setActiveTab}
          />
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 z-10">
          <div className="flex items-center gap-2">
            <Layout size={18} className="text-slate-400" />
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Manage {activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-slate-800 leading-none mb-1">
                Administrator
              </p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                System Access: Full
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white shadow-lg">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
          <div className="max-w-5xl mx-auto">{renderContent()}</div>
        </div>

        {/* --- Popup Form Modal --- */}
        {isModalOpen && (
          <EntryModal
            activeTab={activeTab}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </main>
    </div>
  );
};

// --- Sub-Components ---

const SidebarLink = ({ id, icon, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
      active === id
        ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/30"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

const PriceManagement = ({ onOpenModal }) => (
  <div className="animate-in fade-in duration-500">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Live Market Data
        </h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
          Updates visible on Farmer Dashboard
        </p>
      </div>
      <button
        onClick={onOpenModal}
        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-slate-900/20 uppercase tracking-widest"
      >
        <Plus size={18} /> Update Price
      </button>
    </div>
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100 uppercase tracking-[0.1em]">
          <tr>
            <th className="p-6 text-[10px] font-black text-slate-400">
              Crop Name
            </th>
            <th className="p-6 text-[10px] font-black text-slate-400">
              Price (LKR/Kg)
            </th>
            <th className="p-6 text-[10px] font-black text-slate-400 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 font-bold">
          <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="p-6 text-slate-700">Capsicum</td>
            <td className="p-6 text-slate-900">Rs. 480.00</td>
            <td className="p-6 text-right space-x-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit size={18} />
              </button>
              <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const AdvisoryManagement = ({ onOpenModal }) => (
  <div className="animate-in fade-in duration-500">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">
        Expert Advisory
      </h2>
      <button
        onClick={onOpenModal}
        className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-emerald-600/20 uppercase tracking-widest"
      >
        <Plus size={18} /> Post New Advice
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group">
        <div className="flex justify-between mb-4">
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            Season Guidance
          </span>
          <Trash2
            size={18}
            className="text-slate-200 group-hover:text-rose-500 cursor-pointer transition-colors"
          />
        </div>
        <h4 className="font-black text-slate-800 mb-2">
          Best to start Capsicum now
        </h4>
        <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
          Current climate conditions are perfect for nursery prep.
        </p>
      </div>
    </div>
  </div>
);

const NewsManagement = ({ onOpenModal }) => (
  <div className="animate-in fade-in duration-500">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">
        System News Feed
      </h2>
      <button
        onClick={onOpenModal}
        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-slate-900/20 uppercase tracking-widest"
      >
        <Plus size={18} /> Add News Headline
      </button>
    </div>
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <CheckCircle size={20} />
        </div>
        <p className="font-bold text-slate-800">
          2026 Fertilizer distribution update posted.
        </p>
      </div>
      <button className="text-slate-300 hover:text-rose-600 transition-colors">
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

const EntryModal = ({ activeTab, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
          Update {activeTab}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Entry Heading
          </label>
          <input
            type="text"
            placeholder={`Enter ${activeTab} title...`}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Detail Description
          </label>
          <textarea
            placeholder="Write full details here..."
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 h-32 resize-none transition-all"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 font-black text-slate-400 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all"
          >
            Discard
          </button>
          <button
            type="submit"
            className="flex-1 py-4 font-black bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} /> Publish
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default OverviewManage;
