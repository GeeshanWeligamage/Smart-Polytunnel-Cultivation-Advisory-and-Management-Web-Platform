import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Menu,
  Leaf,
  LayoutGrid,
  Layers, // Structure සඳහා අලුත් Icon එක
} from "lucide-react";

// Imports
import ManageCrops from "./ManageCrops";
import UpdatePrices from "./UpdatePrices";
import ManageStructure from "./ManageStructure"; // අලුත් පේජ් එක Import කළා

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("manage-crops");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavItem = ({ id, icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm mb-2 ${
        activeTab === id
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-20 w-64 h-full bg-slate-900 text-white flex flex-col transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Settings size={18} />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <div className="flex-1 py-6 px-4">
          <NavItem
            id="manage-crops"
            icon={<Leaf size={20} />}
            label="Manage Crops"
          />
          <NavItem
            id="update-prices"
            icon={<TrendingUp size={20} />}
            label="Update Prices"
          />

          {/* --- අලුත් "Manage Structures" Tab එක --- */}
          <NavItem
            id="manage-structure"
            icon={<Layers size={20} />}
            label="Manage Structures"
          />

          <NavItem id="users" icon={<Users size={20} />} label="Manage Users" />
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-sm"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-slate-500"
          >
            <Menu />
          </button>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            {activeTab === "manage-crops"
              ? "Crop Inventory Management"
              : activeTab === "update-prices"
                ? "Daily Market Price Update"
                : activeTab === "manage-structure"
                  ? "Structure Configuration"
                  : "User Management"}
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* තෝරාගන්නා Tab එකට අනුව අදාළ Component එක Render කිරීම */}
          {activeTab === "manage-crops" && <ManageCrops />}
          {activeTab === "update-prices" && <UpdatePrices />}
          {activeTab === "manage-structure" && <ManageStructure />}
          {activeTab === "users" && (
            <div className="text-center py-20 text-slate-400 font-bold">
              User Management coming soon...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
