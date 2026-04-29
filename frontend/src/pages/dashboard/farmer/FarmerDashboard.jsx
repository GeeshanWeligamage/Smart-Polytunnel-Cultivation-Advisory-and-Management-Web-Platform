import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  LayoutDashboard,
  Sprout,
  Stethoscope,
  LogOut,
  Menu,
  CalendarDays,
  TrendingUp,
  BarChart3,
} from "lucide-react";

// --- Components Import ---
import Overview from "./Overview";
import SmartPlanner from "./TunnelDesign";
import AgroDoctor from "./AgroDoctor";
import DailyPrices from "./DailyPrices";
import IncomeForecaster from "./IncomeForecaster";

const FarmerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sidebar Button Component
  const NavItem = ({ id, icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm mb-2 ${
        activeTab === id
          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed md:relative z-20 w-64 h-full bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sprout size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">SmartAgro</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
            Farmer Portal
          </p>
          <NavItem
            id="overview"
            icon={<LayoutDashboard size={20} />}
            label="Overview"
          />
          <NavItem
            id="planner"
            icon={<CalendarDays size={20} />}
            label="Smart Planner"
          />
          <NavItem
            id="forecaster"
            icon={<BarChart3 size={20} />}
            label="Income Forecaster"
          />
          <NavItem
            id="agro-doctor"
            icon={<Stethoscope size={20} />}
            label="Agro-Doctor AI"
          />
          <NavItem
            id="daily-prices"
            icon={<TrendingUp size={20} />}
            label="Daily Prices"
          />
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black text-slate-800 hidden sm:block">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "planner" && "Crop Planner"}
              {activeTab === "forecaster" && "Income & Revenue Forecasting"}
              {activeTab === "agro-doctor" && "AI Disease Diagnosis"}
              {activeTab === "daily-prices" && "Real-time Market Prices"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Market Status: ONLINE
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              <img
                src={`https://ui-avatars.com/api/?name=${
                  user?.username || "Farmer"
                }&background=10b981&color=fff`}
                alt="Profile"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "overview" && <Overview onNavigate={setActiveTab} />}
            {activeTab === "planner" && <SmartPlanner />}
            {activeTab === "forecaster" && <IncomeForecaster />}
            {activeTab === "agro-doctor" && <AgroDoctor />}
            {activeTab === "daily-prices" && <DailyPrices />}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default FarmerDashboard;
