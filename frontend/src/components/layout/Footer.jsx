import React from "react";
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Globe } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white border-t border-slate-100 overflow-hidden pt-20 pb-10 w-full select-none font-sans">
      {/* Decorative blurred background blobs for premium glassmorphism feel */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Logo & Brand Summary */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sprout size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-slate-900 leading-tight">WelGrow</span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Plantation</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Empowering Sri Lankan agriculture through intelligent IoT integration, precision analytics, and proactive plant health optimization.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all shadow-sm">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all shadow-sm">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all shadow-sm">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all shadow-sm">
                <Globe size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Intelligent Modules */}
          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Modular Engines
            </h4>
            <ul className="space-y-3 text-sm font-bold text-slate-500">
              <li>
                <span className="hover:text-emerald-600 transition-colors cursor-pointer">Smart Structure Planner</span>
              </li>
              <li>
                <span className="hover:text-emerald-600 transition-colors cursor-pointer">Crop Income Forecaster</span>
              </li>
              <li>
                <span className="hover:text-emerald-600 transition-colors cursor-pointer">Agro-Doctor AI Diagnostic</span>
              </li>
              <li>
                <span className="hover:text-emerald-600 transition-colors cursor-pointer">Real-Time Market Trends</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Nav */}
          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Internal Maps
            </h4>
            <ul className="space-y-3 text-sm font-bold text-slate-500">
              <li>
                <span className="hover:text-emerald-600 transition-colors cursor-pointer">Dashboard Portal</span>
              </li>
              <li>
                <span className="hover:text-emerald-600 transition-colors cursor-pointer">Executive Profile</span>
              </li>
              <li>
                <span className="hover:text-emerald-600 transition-colors cursor-pointer">About Enterprise</span>
              </li>
              <li>
                <span className="hover:text-emerald-600 transition-colors cursor-pointer">Direct Support Channels</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Comms */}
          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Global Contacts
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-slate-100">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Hotline</p>
                  <p className="text-sm font-bold text-slate-800 leading-none">+94 77 123 4567</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-slate-100">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Support Mail</p>
                  <p className="text-sm font-bold text-slate-800 leading-none">info@welgrow.lk</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-slate-100">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Central Ops</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">No 45, Agrarian Road, Nuwara Eliya</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Fine Print Footer */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left">
            © {currentYear} WelGrow Plantation PVT LTD. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <span className="hover:text-slate-600 cursor-pointer">Terms</span>
            <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-600 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
