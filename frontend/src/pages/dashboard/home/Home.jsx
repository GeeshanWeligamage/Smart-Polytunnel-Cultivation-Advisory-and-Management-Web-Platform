import React, { useState, useEffect, useContext } from 'react'; // useContext එකතු කළා
import { Link, useLocation } from 'react-router-dom';
import { 
  ArrowRight, Ruler, TrendingUp, Stethoscope, MessageSquare, ChevronRight,
  ShieldCheck, Zap, Leaf, CheckCircle2, Users, Globe, PlayCircle, Phone, Mail, MapPin
} from 'lucide-react';

import { AuthContext } from '../../../context/AuthContext'; 
import agroImage from '../../../assets/images/1e2be13c93da5c38251f4820540750cf.jpg';
import Footer from "../../../components/layout/Footer";

const Home = ({ onStart, user }) => {
  
  const { logout } = useContext(AuthContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash scrolling for #features and #impact
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- Navigation Bar --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 transition-transform group-hover:scale-110">
              <Leaf size={26} />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">WelGrow Plantation</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <Link to="/#features" className="hover:text-emerald-600 transition-colors">Features</Link>
            <Link to="/#impact" className="hover:text-emerald-600 transition-colors">Our Impact</Link>
            <Link to="/about" className="hover:text-emerald-600 transition-colors">About Us</Link>
            <Link to="/#contact" className="hover:text-emerald-600 transition-colors">Contact Us</Link>
          </div>

           <div>
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold border transition-all duration-300 focus:outline-none ${
                  scrolled
                    ? "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-amber-400/50"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                } backdrop-blur-md`}
                style={{ color: scrolled ? '#000' : '#000' }}
              >
                <span className="text-sm text-slate-800">{user.username || "User"}</span>
                <span className="text-xs text-slate-800 transition-transform">{isDropdownOpen ? '▲' : '▼'}</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl py-2 border border-white/10 z-50 overflow-hidden animate-fade-in origin-top-right">
                  <div className="px-5 py-3 border-b border-white/10">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Signed in as</p>
                    <p className="text-sm font-semibold text-amber-400 truncate">{user.username}</p>
                  </div>
                  <Link
                    to={user.role === "admin" ? "/admin-dashboard" : "/farmer-dashboard"}
                    className="px-5 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-amber-400 transition flex items-center gap-3"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span>📊</span> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                        logout(); 
                        setIsDropdownOpen(false); 
                    }}
                    className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition flex items-center gap-3"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 rounded-full font-medium text-sm tracking-wide transition-all shadow-lg border border-white/30 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-500 backdrop-blur-md"
            >
              Login / Register
            </Link>
          )}
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 text-center lg:text-left animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-bold mb-8 border border-emerald-100 uppercase tracking-[0.2em]">
              <Zap size={14} className="fill-emerald-600" />
              Sri Lanka's #1 Smart Polytunnel Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tight">
              Cultivate with <span className="text-emerald-600">Digital Precision</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Scientific structural planning, AI-powered disease diagnosis, and real-time market forecasting. Empowering Sri Lankan farmers for a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <button onClick={onStart} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-[2rem] font-bold text-lg transition-all shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 group">
                Launch Dashboard <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 px-10 py-5 rounded-[2rem] font-bold text-lg border border-slate-200 transition-all flex items-center justify-center gap-3 group">
                <PlayCircle size={22} className="text-emerald-600 transition-transform group-hover:scale-110" /> Watch Demo
              </button>
            </div>
          </div>

          <div className="relative animate-in zoom-in duration-1000">
            <div className="relative z-10 bg-white p-5 rounded-[4rem] shadow-2xl shadow-slate-200 border border-slate-100 transform rotate-3 hover:rotate-0 transition-transform duration-700">
               <div className="rounded-[3.5rem] overflow-hidden bg-slate-900 aspect-[4/3] relative group">
                  <img src={agroImage} alt="Agro AI" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                    <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.4em] mt-6 drop-shadow-lg"></p>
                  </div>
               </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* --- Features Section --- */}
      <section id="features" className="px-6 py-24 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Our Core Ecosystem</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Integrated tools designed by agronomists and engineers to maximize your yield efficiency.</p>
            <div className="h-1.5 w-24 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<Stethoscope size={32} />} title="AI Plant Help" desc="Identify plant diseases instantly with our high-accuracy vision AI model." color="emerald" />
            <FeatureCard icon={<TrendingUp size={32} />} title="Finance Engine" desc="Profit forecasting using real-time price feeds from Dambulla Economic Center." color="blue" />
            <FeatureCard icon={<Ruler size={32} />} title="Smart Designer" desc="Scientific structural layouts based on your land terrain and local climate zones." color="orange" />
             
            
            
          </div>
        </div>
      </section>

      {/* --- Trust & Stats Section --- */}
      <section id="impact" className="px-6 py-24 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Empowering the <br/><span className="text-emerald-400">Green Revolution.</span></h2>
                <p className="text-slate-400 font-medium mb-10 leading-relaxed max-w-md text-lg">
                  WelGrow Plantation isn't just a dashboard; it's a partner in your cultivation journey, reducing risk and increasing predictability.
                </p>
                <div className="space-y-6">
                  <CheckListItem text="92.5% Disease Prediction Accuracy" />
                  <CheckListItem text="90% Income Forcasting Accuracy" /> 
                  <CheckListItem text="Seamless Market Price Integration" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <StatBox label="Active Farmers" value="1.2K+" icon={<Users size={20}/>} />
                <StatBox label="Regions" value="9 Provinces" icon={<Globe size={20}/>} />
                <StatBox label="Disease Prediction Accuracy" value="92.5%" icon={<CheckCircle2 size={20}/>} />
                <StatBox label="Support" value="24/7" icon={<ShieldCheck size={20}/>} />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
          </div>
        </div>
      </section>

      {/* --- Contact Us Section --- */}
      <section id="contact" className="px-6 py-24 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Get in Touch</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Have questions about smart polytunnels or our AI solutions? We're here to help.</p>
            <div className="h-1.5 w-24 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-50 rounded-[3rem] p-10 md:p-14 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
            {/* Background elements for card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-[80px]"></div>
            
            {/* Contact Info */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-12">
                <h3 className="text-3xl font-black text-slate-900 mb-4">Contact Information</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
                  Reach out to us directly, and our agronomists will get back to you as soon as possible.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full">
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-200 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Phone</p>
                    <p className="text-lg font-bold text-slate-800">+94 77 123 4567</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-200 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Email</p>
                    <p className="text-lg font-bold text-slate-800">info@welgrow.lk</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-200 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Location</p>
                    <p className="text-base font-bold text-slate-800 leading-tight">No 45, Agrarian Road,<br/>Nuwara Eliya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

// --- Helper UI Components ---
const FeatureCard = ({ icon, title, desc, color }) => {
  const colorStyles = {
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-600",
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600"
  };

  return (
    <div data-aos="fade-up" className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-3 transition-all duration-500 group">
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 transition-all duration-300 group-hover:text-white ${colorStyles[color]}`}>
        {icon}
      </div>
      <h4 className="text-xl font-black text-slate-800 mb-4 tracking-tight">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed font-medium mb-10">{desc}</p>
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">
        Learn More <ChevronRight size={14} />
      </div>
    </div>
  );
};

const CheckListItem = ({ text }) => (
  <div className="flex items-center gap-4">
    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
      <CheckCircle2 size={16} />
    </div>
    <span className="text-slate-300 font-medium text-sm">{text}</span>
  </div>
);

const StatBox = ({ label, value, icon }) => (
  <div data-aos="zoom-in" className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-colors">
    <div className="text-emerald-400 mb-3">{icon}</div>
    <p className="text-3xl font-black mb-1">{value}</p>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
  </div>
);

export default Home;