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
  LineChart,
} from "lucide-react";

// --- Components Import ---
import Overview from "./Overview";
import SmartPlanner from "./TunnelDesign";
import AgroDoctor from "./AgroDoctor";
import DailyPrices from "./DailyPrices";
import IncomeForecaster from "./IncomeForecaster";
import MarketTrends from "./MarketTrends";
import AboutUs from "./AboutUs";

const FarmerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to navigate to the Overview tab and scroll to a specific section
  const scrollToSection = (sectionId) => {
    if (activeTab !== "overview") {
      // Switch to overview tab first if not already there
      setActiveTab("overview");
      // Delay scrolling slightly to allow the component to mount
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      // Scroll directly if already on the overview tab
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Top Navigation item component
  const NavItem = ({ id, icon, label, mobile = false }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false); // Close mobile menu if open
      }}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold text-sm ${mobile ? "w-full justify-start mb-2" : ""
        } ${activeTab === id
          ? "bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        }`}
    >
      {icon}
      <span className={mobile ? "block" : "hidden xl:block"}>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="w-full px-6 md:px-8 h-20 flex items-center justify-between gap-4">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3 min-w-max">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout size={22} className="text-white" />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-800 leading-none">SmartAgro</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Farmer Portal</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            <NavItem id="overview" icon={<LayoutDashboard size={18} />} label="Overview" />
            <NavItem id="planner" icon={<CalendarDays size={18} />} label="Smart Planner" />
            <NavItem id="forecaster" icon={<BarChart3 size={18} />} label="Income Forecaster" />
            <NavItem id="agro-doctor" icon={<Stethoscope size={18} />} label="Agro-Doctor AI" />
            <NavItem id="daily-prices" icon={<TrendingUp size={18} />} label="Daily Prices" />
          </nav>

          {/* Right Side Actions (Profile, Logout, Mobile Menu Toggle) */}
          <div className="flex items-center gap-4 min-w-max">
            <div className="hidden md:flex items-center gap-2 mr-4 border-r border-slate-200 pr-6">
              <button
                onClick={() => setActiveTab("about")}
                className="px-3 py-2 rounded-xl text-sm font-bold text-slate-500 bg-transparent hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection("contact-us")}
                className="px-3 py-2 rounded-xl text-sm font-bold text-slate-500 bg-transparent hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                Contact Us
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.username || "Farmer"}&background=10b981&color=fff`}
                  alt="Profile"
                />
              </div>
              <button
                onClick={logout}
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg ml-2"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE DROPDOWN MENU --- */}
      <div
        className={`absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl z-30 transition-all duration-300 ease-in-out lg:hidden origin-top ${isSidebarOpen ? "scale-y-100 opacity-100 visible" : "scale-y-0 opacity-0 invisible"
          }`}
      >
        <div className="p-6 flex flex-col gap-1">
          <NavItem mobile id="overview" icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem mobile id="planner" icon={<CalendarDays size={20} />} label="Smart Planner" />
          <NavItem mobile id="forecaster" icon={<BarChart3 size={20} />} label="Income Forecaster" />
          <NavItem mobile id="agro-doctor" icon={<Stethoscope size={20} />} label="Agro-Doctor AI" />
          <NavItem mobile id="daily-prices" icon={<TrendingUp size={20} />} label="Daily Prices" />

          <div className="h-px bg-slate-100 my-4"></div>

          <button
            onClick={() => { setActiveTab("about"); setIsSidebarOpen(false); }}
            className="w-full text-left px-4 py-2.5 font-bold text-sm text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl"
          >
            About Us
          </button>
          <button
            onClick={() => { scrollToSection("contact-us"); setIsSidebarOpen(false); }}
            className="w-full text-left px-4 py-2.5 font-bold text-sm text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl"
          >
            Contact Us
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 transition-colors text-sm font-bold"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* --- OVERLAY FOR MOBILE MENU --- */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 lg:hidden top-20"
        ></div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto relative w-full">
        {/* Dynamic Header Title for Context - optional, since nav now shows active state, but nice for UX */}
        <div className="max-w-[1400px] mx-auto px-6 pt-8 pb-2">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "planner" && "Crop Planner"}
            {activeTab === "forecaster" && "Income & Revenue Forecasting"}
            {activeTab === "agro-doctor" && "AI Disease Diagnosis"}
            {activeTab === "daily-prices" && "Real-time Market Prices"}
            {activeTab === "about" && "About SmartAgro"}
          </h1>
        </div>

        <div className="max-w-[1400px] mx-auto p-6 md:p-8 pt-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "overview" && <Overview onNavigate={setActiveTab} />}
            {activeTab === "planner" && <SmartPlanner />}
            {activeTab === "forecaster" && <IncomeForecaster />}
            {activeTab === "agro-doctor" && <AgroDoctor />}
            {activeTab === "daily-prices" && <DailyPrices />}
            {activeTab === "about" && <AboutUs />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
