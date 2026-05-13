import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import Footer from "../../../components/layout/Footer";

const Contact = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- Navigation Bar --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 transition-transform group-hover:scale-110">
              <Leaf size={26} />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">WelGrow Plantation</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <Link to="/#features" className="hover:text-emerald-600 transition-colors">Features</Link>
            <Link to="/#impact" className="hover:text-emerald-600 transition-colors">Our Impact</Link>
            <Link to="/about" className="hover:text-emerald-600 transition-colors">About Us</Link>
            <Link to="/contact" className="text-emerald-600 transition-colors">Contact Us</Link>
          </div>

          <div>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold border transition-all duration-300 bg-white/10 text-slate-800 border-slate-200 hover:bg-slate-50 backdrop-blur-md focus:outline-none"
                >
                  <span className="text-sm">{user.username || "User"}</span>
                  <span className="text-xs transition-transform">{isDropdownOpen ? "▲" : "▼"}</span>
                </button>

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

      {/* --- Hero / Main Content Section --- */}
      <main className="pt-40 pb-24 px-6 lg:px-12 relative overflow-hidden">
        {/* Background glow elements */}
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-bold mb-6 border border-emerald-100 uppercase tracking-[0.2em]">
              <MessageSquare size={14} /> Get In Touch
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
              How Can We Help You?
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Have analytical questions about smart polytunnels or troubleshooting AI diagnostics? 
              Our global agronomist and technical support divisions are ready to guide you.
            </p>
          </div>

          {/* Contact Card & Map Block */}
          <div className="grid lg:grid-cols-12 gap-10 items-stretch animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* Contact Information Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <ContactBox 
                icon={Phone}
                label="Operations Support"
                value="+94 77 123 4567"
                subLabel="Mon - Fri, 8 AM to 5 PM IST"
              />
              <ContactBox 
                icon={Mail}
                label="Institutional Inquiries"
                value="info@welgrow.lk"
                subLabel="Average response time 4 hours"
              />
              <ContactBox 
                icon={MapPin}
                label="Corporate Registry"
                value="No 45, Agrarian Road, Nuwara Eliya"
                subLabel="Sri Lanka Agricultural Zone 03"
              />
            </div>

            {/* Contact Form Layout */}
            <div className="lg:col-span-7 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-900 mb-2">Message Center</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-8">Direct Transmission Unit</p>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input type="text" placeholder="e.g. John Perera" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Email</label>
                      <input type="email" placeholder="name@company.com" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topic Focus</label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Structure Planning Support</option>
                      <option>AI Diagnosis Troubleshooting</option>
                      <option>Investor Relations</option>
                      <option>General Feedbacks</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Transmission</label>
                    <textarea rows={4} placeholder="Compose transmission data here..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"></textarea>
                  </div>
                  
                  <button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all">
                    Dispatch Message <Send size={18} />
                  </button>
                </form>
              </div>
              
              {/* Subtle glass decor on form bg */}
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ContactBox = ({ icon: Icon, label, value, subLabel }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-100/50 flex items-start gap-5 hover:-translate-y-1 transition-transform duration-300 group">
    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h4 className="text-xl font-black text-slate-900 leading-snug mb-1 tracking-tight">{value}</h4>
      <p className="text-xs font-bold text-slate-400">{subLabel}</p>
    </div>
  </div>
);

export default Contact;