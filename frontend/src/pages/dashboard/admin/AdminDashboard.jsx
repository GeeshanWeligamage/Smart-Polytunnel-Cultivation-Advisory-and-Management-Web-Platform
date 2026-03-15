import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Sprout, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  MoreVertical,
  Thermometer,
  Droplets,
  Activity,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- Sidebar Component ---
  const SidebarItem = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm mb-1 ${
        activeTab === id 
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* --- 1. LEFT SIDEBAR (Fixed) --- */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col border-r border-slate-800">
        {/* Logo Area */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sprout size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">SmartAgro<span className="text-emerald-500">.Admin</span></span>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Main Menu</p>
          <SidebarItem id="dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          <SidebarItem id="farmers" icon={<Users size={20} />} label="Farmers Management" />
          <SidebarItem id="sensors" icon={<Activity size={20} />} label="Sensor Status" />
          <SidebarItem id="alerts" icon={<AlertTriangle size={20} />} label="System Alerts" />
          
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-8 mb-4 px-2">Settings</p>
          <SidebarItem id="settings" icon={<Settings size={20} />} label="Platform Settings" />
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={logout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-bold"
           >
             <LogOut size={20} /> Logout System
           </button>
        </div>
      </aside>


      {/* --- 2. MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search farmers, regions..." 
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800">{user?.username || "Admin User"}</p>
                <p className="text-xs text-slate-500 font-medium">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=10b981&color=fff" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Overview</h1>
              <p className="text-slate-500 mt-1">Real-time monitoring of all polytunnels across Sri Lanka.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Farmers" 
                value="1,240" 
                trend="+12%" 
                icon={<Users size={24} />} 
                color="blue" 
              />
              <StatCard 
                title="Active Sensors" 
                value="8,542" 
                trend="+98.5%" 
                icon={<Activity size={24} />} 
                color="emerald" 
              />
              <StatCard 
                title="Avg Temp" 
                value="28°C" 
                trend="Normal" 
                icon={<Thermometer size={24} />} 
                color="orange" 
              />
              <StatCard 
                title="Critical Alerts" 
                value="03" 
                trend="Low Risk" 
                icon={<AlertTriangle size={24} />} 
                color="red" 
              />
            </div>

            {/* Main Charts / Tables Area */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column: Recent Farmers Table */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-slate-800">Recent Registrations</h3>
                  <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="pb-3 pl-2">Farmer Name</th>
                        <th className="pb-3">Region</th>
                        <th className="pb-3">Crop Type</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3"></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <TableRow name="Kamal Perera" region="Nuwara Eliya" crop="Strawberry" status="Active" />
                      <TableRow name="Sunil Shantha" region="Bandarawela" crop="Bell Pepper" status="Pending" />
                      <TableRow name="Nimali Silva" region="Matale" crop="Tomato" status="Active" />
                      <TableRow name="Ajith Kumara" region="Kandy" crop="Lettuce" status="Active" />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: System Health / Quick Actions */}
              <div className="space-y-6">
                
                {/* System Health Card */}
                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Droplets size={20} className="text-emerald-400" />
                      </div>
                      <h3 className="font-bold">System Health</h3>
                    </div>
                    <div className="space-y-4">
                      <ProgressBar label="Server Uptime" percentage={99} />
                      <ProgressBar label="Database Load" percentage={45} />
                      <ProgressBar label="AI Model Accuracy" percentage={92} />
                    </div>
                  </div>
                  {/* Decor */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Quick Action Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg">
                   <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                   <div className="grid grid-cols-2 gap-3">
                      <QuickActionButton label="Add Farmer" color="emerald" />
                      <QuickActionButton label="Broadcast Alert" color="orange" />
                      <QuickActionButton label="Export Reports" color="blue" />
                      <QuickActionButton label="Manage API" color="slate" />
                   </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ title, value, trend, icon, color }) => {
  const colorStyles = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorStyles[color]}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${color === 'red' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {trend}
        </span>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-slate-800 mt-1">{value}</h3>
    </div>
  );
};

const TableRow = ({ name, region, crop, status }) => (
  <tr className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
    <td className="py-4 pl-2 font-bold text-slate-700 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
        {name.charAt(0)}
      </div>
      {name}
    </td>
    <td className="py-4 text-slate-500">{region}</td>
    <td className="py-4 text-slate-500">{crop}</td>
    <td className="py-4">
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
        status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {status}
      </span>
    </td>
    <td className="py-4 text-right pr-2">
      <button className="p-2 text-slate-300 hover:text-emerald-600 transition-colors">
        <MoreVertical size={16} />
      </button>
    </td>
  </tr>
);

const ProgressBar = ({ label, percentage }) => (
  <div>
    <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>
    <div className="w-full bg-slate-800 rounded-full h-2">
      <div 
        className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

const QuickActionButton = ({ label, color }) => {
    const bgColors = {
        emerald: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        orange: "bg-orange-50 text-orange-700 hover:bg-orange-100",
        blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
        slate: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    }
    return (
        <button className={`${bgColors[color]} py-3 px-2 rounded-xl text-xs font-bold transition-colors`}>
            {label}
        </button>
    )
}

export default AdminDashboard;