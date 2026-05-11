import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, ChevronDown, Search, ArrowUpRight, 
  BarChart3, LogOut, Leaf, Target, Award, Cpu
} from 'lucide-react';

import { AuthContext } from '../../../context/AuthContext'; 

// Home page එකේ පාවිච්චි කරපු Background පින්තූරයම මෙතනටත් ගන්නවා
import bgImage from '../../../assets/images/agriculture.jpeg';

const About = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden selection:bg-[#d4f82e] selection:text-black">
      
      {/* Background Image & Overlay (Fixed for scrolling) */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/40"></div>
      </div>

      {/* --- Navigation Bar (Exact match from Home Page) --- */}
      <nav className="relative z-50 w-full px-6 md:px-12 py-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="text-[#d4f82e]">
            <Sprout size={32} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-semibold text-white tracking-wide">
            WelGrow Plantion<span className="text-[#d4f82e]">.</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-10 text-white/90 text-[15px] font-medium">
          <Link to="/" className="hover:text-[#d4f82e] transition-colors">Home</Link>
          <div className="flex items-center gap-1 text-[#d4f82e] transition-colors cursor-pointer group">
            About Us <ChevronDown size={16} className="opacity-70 group-hover:rotate-180 transition-transform" />
          </div>
          <div className="flex items-center gap-1 hover:text-[#d4f82e] transition-colors cursor-pointer group">
            Platform <ChevronDown size={16} className="opacity-70 group-hover:rotate-180 transition-transform" />
          </div>
          <div className="flex items-center gap-1 hover:text-[#d4f82e] transition-colors cursor-pointer group">
            Services <ChevronDown size={16} className="opacity-70 group-hover:rotate-180 transition-transform" />
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
      <header className="relative pt-24 pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-[#d4f82e] px-4 py-2 text-sm font-bold mb-6 tracking-wide">
            <Leaf size={16} fill="currentColor" /> ESTABLISHED 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
            Cultivating the Future of <br/>
            <span className="text-[#d4f82e]">Sri Lankan Agriculture.</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
            We bridge the gap between traditional farming wisdom and modern IoT precision. Our mission is to empower every farmer with data-driven insights.
          </p>
        </div>
      </header>

      {/* --- Vision & Mission Grid (Glassmorphism) --- */}
      <section className="px-6 py-10 lg:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <InfoCard 
            icon={<Target size={28} />}
            title="Our Mission"
            desc="To reduce crop wastage by 40% using real-time environmental monitoring and AI-driven disease prediction models."
          />
          <InfoCard 
            icon={<Award size={28} />}
            title="Our Vision"
            desc="A self-sufficient Sri Lanka where technology eliminates the uncertainty of farming, ensuring profitability for every cultivator."
          />
          <InfoCard 
            icon={<Cpu size={28} />}
            title="The Technology"
            desc="Powered by React, Node.js, and IoT sensors. We use cutting-edge algorithms to process soil and climate data instantly."
          />
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="px-6 py-20 mt-12 mb-12">
        <div className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 md:p-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Modernize Your Farm?</h2>
          <p className="text-white/70 mb-10 text-lg">Join thousands of farmers using SmartAgro today and secure your yield.</p>
          <div className="flex justify-center">
            <Link to="/register" className="bg-[#d4f82e] hover:bg-[#c4e62b] text-black px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(212,248,46,0.3)] hover:scale-105">
              Get Started Now <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- Footer Section (Exact match from Home Page) --- */}
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
                Whatsapp
              </a>
              <a href="https://www.facebook.com/your-page" className="hover:text-[#d4f82e] transition-colors" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href="https://www.linkedin.com/in/your-profile" className="hover:text-[#d4f82e] transition-colors" target="_blank" rel="noopener noreferrer">
                Linkedin
              </a>
              <a href="https://www.instagram.com/your-page" className="hover:text-[#d4f82e] transition-colors" target="_blank" rel="noopener noreferrer">
                Instagram
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

// --- Helper Components (Updated for Dark Glassmorphism Theme) ---

const InfoCard = ({ icon, title, desc }) => {
  return (
    <div className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#d4f82e]/20 text-[#d4f82e]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/60 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
  );
};

export default About;