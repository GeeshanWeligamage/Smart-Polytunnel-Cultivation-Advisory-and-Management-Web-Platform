import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, ChevronDown, Search, ArrowUpRight, 
  BarChart3, LogOut, ShieldCheck, Leaf, BrainCircuit, TrendingUp
} from 'lucide-react';

import { AuthContext } from '../../../context/AuthContext'; 

// ඔයාගේ පින්තූරය import කරන තැන (වෙනස් කරන්න එපා)
import bgImage from '../../../assets/images/agriculture.jpeg';

const Home = ({ onStart, user }) => {
  const { logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden selection:bg-[#d4f82e] selection:text-black">
      
      {/* Background Image & Overlay (Fixed to support scrolling for footer) */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20"></div>
      </div>

      {/* --- Navigation Bar --- */}
      <nav className="relative z-50 w-full px-6 md:px-12 py-6 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-[#d4f82e]">
            <Sprout size={32} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-semibold text-white tracking-wide">
            WelGrow Plantation<span className="text-[#d4f82e]">.</span>
          </span>
        </div>

        {/* Center Links (Hidden on small screens) */}
        <div className="hidden lg:flex items-center gap-10 text-white/90 text-[15px] font-medium">
          <Link to="/" className="hover:text-[#d4f82e] transition-colors">Home</Link>
          <div className="flex items-center gap-1 hover:text-[#d4f82e] transition-colors cursor-pointer group">
            <Link to="/About" className="hover:text-[#d4f82e] transition-colors">About Us</Link>
            <ChevronDown size={16} className="opacity-70 group-hover:rotate-180 transition-transform" />
          </div>
          <div className="flex items-center gap-1 hover:text-[#d4f82e] transition-colors cursor-pointer group">
            <Link to="/platform" className="hover:text-[#d4f82e] transition-colors">Platform</Link>
            <ChevronDown size={16} className="opacity-70 group-hover:rotate-180 transition-transform" />
          </div>
          <div className="flex items-center gap-1 hover:text-[#d4f82e] transition-colors cursor-pointer group">
            <Link to="/services" className="hover:text-[#d4f82e] transition-colors">Services</Link>
            <ChevronDown size={16} className="opacity-70 group-hover:rotate-180 transition-transform" />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          <button className="text-white hover:text-[#d4f82e] transition-colors hidden sm:block">
            <Search size={20} />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold bg-[#d4f82e] text-black hover:bg-[#c4e62b] transition-all duration-300 shadow-[0_0_20px_rgba(212,248,46,0.3)]"
              >
                <span>{user.username || "User"}</span>
                <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50">
                  <div className="px-4 py-3 border-b border-white/10 mb-1">
                    <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate mt-0.5">{user.username}</p>
                  </div>
                  <Link
                    to={user.role === "admin" ? "/admin-dashboard" : "/farmer-dashboard"}
                    className="px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-[#d4f82e] transition-colors flex items-center gap-3 mx-1 rounded-lg"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <BarChart3 size={16} /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                        logout(); 
                        setIsDropdownOpen(false); 
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-3 mx-1 rounded-lg mt-1"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-[#d4f82e] text-black hover:bg-[#c4e62b] transition-all shadow-[0_0_20px_rgba(212,248,46,0.2)] hover:shadow-[0_0_25px_rgba(212,248,46,0.4)]"
            >
              Get In Touch <ArrowUpRight size={18} />
            </Link>
          )}
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="relative z-10 w-full px-6 md:px-12 flex flex-col justify-center min-h-[calc(100vh-100px)] max-w-7xl mx-auto pb-20">
        
        {/* Top small label */}
        <div className="flex items-center gap-2 text-[#d4f82e] font-semibold text-sm mb-6 animate-fade-in-up">
          <Leaf size={16} fill="currentColor" />
          <span className="uppercase tracking-wider text-xs font-bold">Next-Generation Farming</span>
        </div>

        {/* Main Title - Updated for Smart Polytunnels */}
        <h1 className="text-5xl md:text-7xl lg:text-[4.5rem] font-bold text-white leading-[1.1] mb-6 max-w-4xl tracking-tight">
          Smart Polytunnels for <br className="hidden md:block"/> Precision Yields
        </h1>

        {/* Description - Updated */}
        <p className="text-white/80 text-lg md:text-xl font-normal max-w-2xl mb-12 leading-relaxed">
          Optimize your harvest with AI-driven disease diagnosis, real-time climate insights, and intelligent market forecasting tailored for Sri Lankan farmers.
        </p>

        {/* Bottom Feature Cards (Glassmorphism) - Updated */}
        <div className="flex flex-col sm:flex-row gap-6 mt-4">
          
          {/* Card 1 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 pr-10 flex items-center gap-5 hover:bg-white/20 transition-colors cursor-default">
            <div className="w-14 h-14 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#8cc63f] rounded-lg rotate-45 transform"></div>
              <div className="absolute inset-0 bg-[#8cc63f] rounded-lg"></div>
              <BrainCircuit size={24} className="text-white relative z-10" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">AI Diagnostics</h3>
              <p className="text-white/60 text-sm">Instantly identify plant diseases<br/>and get treatment plans.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 pr-10 flex items-center gap-5 hover:bg-white/20 transition-colors cursor-default">
            <div className="w-14 h-14 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#8cc63f] rounded-lg rotate-45 transform"></div>
              <div className="absolute inset-0 bg-[#8cc63f] rounded-lg"></div>
              <TrendingUp size={24} className="text-white relative z-10" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Smart Yields</h3>
              <p className="text-white/60 text-sm">Forecast market prices and<br/>maximize your profitability.</p>
            </div>
          </div>

        </div>

        {/* Floating Explore Button on the right (Desktop only) */}
        <div className="absolute right-12 bottom-32 hidden lg:block">
          <button 
            onClick={onStart} 
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[15px] bg-[#d4f82e] text-black hover:bg-[#c4e62b] transition-all hover:scale-105 shadow-[0_0_30px_rgba(212,248,46,0.3)]"
          >
            Explore Platform <ArrowUpRight size={20} />
          </button>
        </div>
      </main>

      {/* --- Footer Section --- */}
      <footer className="relative z-10 w-full bg-black/40 backdrop-blur-md border-t border-white/10 pt-12 pb-8 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            
            {/* Footer Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <Sprout size={28} className="text-[#d4f82e]" strokeWidth={2.5} />
              <span className="text-xl font-semibold text-white tracking-wide">
                WelGrow Plantation<span className="text-[#d4f82e]">.</span>
              </span>
            </div>
            
            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-white/70 text-sm font-medium">
              <a href="https://wa.me/your-number" className="hover:text-[#d4f82e] transition-colors" target="_blank" rel="noopener noreferrer">
                whatsapp
              </a>
              <a href="https://www.facebook.com/your-page" className="hover:text-[#d4f82e] transition-colors" target="_blank" rel="noopener noreferrer">
                facebook
              </a>
              <a href="https://www.linkedin.com/in/your-profile" className="hover:text-[#d4f82e] transition-colors" target="_blank" rel="noopener noreferrer">
                linkedin
              </a>
              <a href="https://www.instagram.com/your-page" className="hover:text-[#d4f82e] transition-colors" target="_blank" rel="noopener noreferrer">
                instagram
              </a>
              
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs md:text-sm">
              © 2026 Smart Polytunnel Platform. All rights reserved.
            </p>
            <p className="text-white/40 text-xs md:text-sm">
              Designed for modern agriculture in Sri Lanka.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;