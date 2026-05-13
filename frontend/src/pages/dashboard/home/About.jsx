import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  Target, 
  Award, 
  Users, 
  ArrowRight, 
  Sprout, 
  Cpu, 
  Linkedin, 
  Github, 
  Twitter,
  Zap, // Add missing icons
  PlayCircle
} from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext'; // Context එක import කරා
import Footer from "../../../components/layout/Footer";

const About = () => {
  const { user, logout } = useContext(AuthContext); // User විස්තර ගත්තා
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll කරනකොට Navbar එක වෙනස් වෙන Effect එක
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
  // Scroll to top when loading the about page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- Updated Navigation Bar (From Home Page) --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 transition-transform group-hover:scale-110">
              <Leaf size={26} />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">WelGrow Plantation</span>
          </Link>
          
          {/* Middle Links (Redirects to Home Sections) */}
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <Link to="/#features" className="hover:text-emerald-600 transition-colors">Features</Link>
            <Link to="/#impact" className="hover:text-emerald-600 transition-colors">Our Impact</Link>
            <Link to="/about" className="text-emerald-600 transition-colors">About Us</Link>
            <Link to="/#contact" className="hover:text-emerald-600 transition-colors">Contact Us</Link>
          </div>

          {/* Login / Profile Button Logic */}
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
                  style={{ color: '#000' }} // Force text color to black for About page visibility
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
      <header className="relative pt-40 pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-bold mb-8 border border-emerald-100 uppercase tracking-[0.2em]">
            <Sprout size={14} /> Since 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8 tracking-tight">
            Cultivating the Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Sri Lankan Agriculture.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto">
            We bridge the gap between traditional farming wisdom and modern IoT precision. Our mission is to empower every farmer with data-driven insights.
          </p>
        </div>
        
        {/* Abstract Backgrounds */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px]"></div>
      </header>

      {/* --- Image Section --- */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-6xl mx-auto h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl relative group">
          <img 
            src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2670&auto=format&fit=crop" 
            alt="Smart Farming" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
            <p className="text-white/90 text-lg font-medium"></p>
          </div>
        </div>
      </section>

      {/* --- Vision & Mission Grid --- */}
      <section className="px-6 py-10 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          
          <InfoCard 
            icon={<Target size={32} />}
            title="Our Mission"
            desc="To bridge the gap between traditional farming and modern technology by providing real-time market insights, smart planning tools, and accurate income forecasting to maximize farmer success." 
            color="emerald"
          />
          
          <InfoCard 
            icon={<Award size={32} />}
            title="Our Vision"
            desc="To empower the farming community through data-driven innovation, ensuring a prosperous and sustainable future for local agriculture."
            color="blue"
          />

          

        </div>
      </section>

      {/* --- Team Section --- */}
      <section className="px-6 py-24 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Meet the Management</h2>
            <p className="text-slate-500 font-medium">The minds behind the WelGrow Plantations PVT LTD.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {/* Team Member 1 */}
            <TeamMember 
              name="Givantha Weligamage" 
              role="Managing Director" 
              image="https://ui-avatars.com/api/?name=Givantha+Weligamage&background=0d9488&color=fff&size=200"
            />
            {/* Team Member 2 */}
            <TeamMember 
              name="Ruwan Weligamage" 
              role="Lead HR and Operational Manager" 
              image="https://ui-avatars.com/api/?name=Ruwan+Weligamage&background=0f172a&color=fff&size=200"
            />
          </div>
        </div>
      </section>

      {/* --- CTA Footer --- */}
      <section className="px-6 py-24 bg-slate-900 mt-12">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-black mb-6">Ready to Modernize Your Farm?</h2>
          <p className="text-slate-400 mb-10 text-lg">Join thousands of farmers using WelGrow Plantation today.</p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2">
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Helper Components ---

const InfoCard = ({ icon, title, desc, color }) => {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${styles[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
  );
};

const TeamMember = ({ name, role, image }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center gap-5 hover:-translate-y-2 transition-transform duration-300">
    <img src={image} alt={name} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
    <div>
      <h4 className="text-lg font-bold text-slate-800">{name}</h4>
      <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3">{role}</p>
      <div className="flex gap-3 text-slate-400">
        <Linkedin size={16} className="hover:text-blue-600 cursor-pointer transition-colors" />
        <Github size={16} className="hover:text-slate-900 cursor-pointer transition-colors" />
        <Twitter size={16} className="hover:text-sky-500 cursor-pointer transition-colors" />
      </div>
    </div>
  </div>
);

export default About;