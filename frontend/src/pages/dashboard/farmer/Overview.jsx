import React from "react";
import {
  TrendingUp,
  ShieldAlert,
  BookOpen,
  Newspaper,
  ChevronRight,
  Timer,
  Sprout,
  Users,
  Globe,
  Phone,
  Mail,
  MapPin,
  LineChart,
  CalendarCheck,
  Eye,
  Target,
  RefreshCcw,
} from "lucide-react";

// Path එක ඔයාගේ folder structure එකට අනුව සකසා ඇත
import welcomeBg from "../../../assets/images/a4955356c52ab996e1804114bcd8cc0d.jpg";
import visionImg from "../../../assets/images/WhatsApp Image 2026-04-27 at 12.07.28.jpeg";
import missionImg from "../../../assets/images/WhatsApp Image 2026-04-27 at 12.07.28 (1).jpeg";

const Overview = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700 px-4 md:px-0">
      {/* --- WELCOME SECTION (Tree widgets removed) --- */}
      <section className="relative p-12 rounded-[3.5rem] text-white overflow-hidden shadow-xl shadow-emerald-600/20 min-h-[320px] flex items-center bg-emerald-700">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src={welcomeBg}
            alt="Welcome Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          {/* Overlay එකක් දැම්මා අකුරු ටික පිරිසිදුව පේන්න */}
          <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 w-full">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black mb-4 tracking-tight drop-shadow-lg">
              Welcome to SmartAgro
            </h2>
            <p className="text-emerald-50 font-bold text-lg leading-relaxed drop-shadow-md">
              At Smart Agro, we believe your hard work deserves the smartest
              insights. The market is waiting for your next harvest, with high
              potential predicted for high-value crops. Let’s lead the way to a
              more prosperous season together!
            </p>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section>
        <div className="flex flex-col mb-8">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Our Smart Services{" "}
            <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Advanced tools for your agricultural success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            icon={<TrendingUp size={24} />}
            title="Daily Prices"
            desc="Stay updated with the latest market rates for Capsicum, Tomato, and other crops."
            color="emerald"
          />
          <ServiceCard
            icon={<LineChart size={24} />}
            title="Income Forecaster"
            desc="Input your cultivation details and predict your future harvest income easily."
            color="blue"
          />
          <ServiceCard
            icon={<CalendarCheck size={24} />}
            title="Smart Planner"
            desc="Plan your planting schedule effectively by understanding seasonal demand."
            color="amber"
          />
        </div>
      </section>

      {/* --- VISION & MISSION SECTION --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-80 rounded-[2.5rem] overflow-hidden group shadow-lg">
          <img
            src={visionImg}
            alt="Vision"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] p-10 flex flex-col justify-start">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-md text-white border border-white/20">
                <Eye size={28} />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight">
                Vision
              </h3>
            </div>
            <p className="text-emerald-50 text-lg font-bold leading-relaxed max-w-sm tracking-tight text-justify">
              To empower the farming community through data-driven innovation,
              ensuring a prosperous and sustainable future for local
              agriculture.
            </p>
            <div className="mt-auto opacity-20">
              <Sprout size={60} className="text-emerald-300" />
            </div>
          </div>
        </div>

        <div className="relative h-80 rounded-[2.5rem] overflow-hidden group shadow-lg">
          <img
            src={missionImg}
            alt="Mission"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] p-10 flex flex-col justify-start">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-full backdrop-blur-md text-emerald-400 border border-emerald-500/20">
                <Target size={28} />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight">
                Mission
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <p className="text-slate-100 text-lg font-bold leading-relaxed max-w-md tracking-tight text-justify">
                  To bridge the gap between traditional farming and modern
                  technology by providing real-time market insights, smart
                  planning tools, and accurate income forecasting to maximize
                  farmer success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT US SECTION --- */}
      <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4">
              Empowering the Future of Farming
            </h3>
            <p className="text-slate-500 font-bold text-sm leading-relaxed mb-6 text-justify">
              Our platform is dedicated to bridging the gap between traditional
              agriculture and modern technology. We provide farmers with
              data-driven insights to maximize yields.
            </p>
          </div>
          <div className="hidden lg:flex justify-center opacity-30">
            <Sprout size={180} className="text-emerald-100" />
          </div>
        </div>
      </section>

      {/* --- CONTACT US SECTION --- */}
      <section className="bg-slate-900 p-12 rounded-[3rem] text-white shadow-xl shadow-slate-900/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h4 className="text-xl font-black mb-2 tracking-tight">
              Get in Touch
            </h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Have questions? We are here to help you.
            </p>
          </div>
          <div className="space-y-6">
            <ContactLink
              icon={<Phone size={18} />}
              title="Call Us"
              detail="+94 11 234 5678"
            />
            <ContactLink
              icon={<Mail size={18} />}
              title="Email"
              detail="support@smartagro.lk"
            />
          </div>
          <div className="space-y-6">
            <ContactLink
              icon={<MapPin size={18} />}
              title="Visit Us"
              detail="No. 45, Agro Park, Colombo 07"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Helper Components ---
const ServiceCard = ({ icon, title, desc, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
    <div
      className={`w-14 h-14 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <h4 className="text-lg font-black text-slate-800 mb-2 tracking-tight">
      {title}
    </h4>
    <p className="text-xs font-bold text-slate-400 leading-relaxed text-justify">
      {desc}
    </p>
  </div>
);

const ContactLink = ({ icon, title, detail }) => (
  <div className="flex items-center gap-4 hover:-translate-y-0.5 transition-transform cursor-pointer">
    <div className="p-3 bg-slate-800 rounded-2xl text-emerald-500">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
        {title}
      </p>
      <p className="text-sm font-black text-white">{detail}</p>
    </div>
  </div>
);

export default Overview;
