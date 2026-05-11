import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
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
  PlayCircle,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext"; // Context එක import කරා

const About = () => {
  const { user, logout } = useContext(AuthContext); // User විස්තර ගත්තා
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll කරනකොට Navbar එක වෙනස් වෙන Effect එක
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* --- Hero Section --- */}
      <header className="relative pt-40 pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-bold mb-8 border border-emerald-100 uppercase tracking-[0.2em]">
            <Sprout size={14} /> Since 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8 tracking-tight">
            Cultivating the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Sri Lankan Agriculture.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto">
            We bridge the gap between traditional farming wisdom and modern IoT
            precision. Our mission is to empower every farmer with data-driven
            insights.
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
            <p className="text-white/90 text-lg font-medium">
              Smart Polytunnels in Nuwara Eliya
            </p>
          </div>
        </div>
      </section>

      {/* --- Vision & Mission Grid --- */}
      <section className="px-6 py-10 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <InfoCard
            icon={<Target size={32} />}
            title="Our Mission"
            desc="To reduce crop wastage by 40% using real-time environmental monitoring and AI-driven disease prediction models."
            color="emerald"
          />

          <InfoCard
            icon={<Award size={32} />}
            title="Our Vision"
            desc="A self-sufficient Sri Lanka where technology eliminates the uncertainty of farming, ensuring profitability for every cultivator."
            color="blue"
          />

          <InfoCard
            icon={<Cpu size={32} />}
            title="The Technology"
            desc="Powered by React, Node.js, and IoT sensors. We use cutting-edge algorithms to process soil and climate data instantly."
            color="orange"
          />
        </div>
      </section>

      {/* --- Team Section --- */}
      <section className="px-6 py-24 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Meet the Management
            </h2>
            <p className="text-slate-500 font-medium">
              The minds behind the WelGrow Plantations PVT LTD. 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg gap-10">
            {/* Team Member 1 */}
            <TeamMember
              name="Givantha Weligamage"
              role="Founder & CEO"
              image="https://ui-avatars.com/api/?name=User+Name&background=0d9488&color=fff&size=200"
            />
            {/* Team Member 2 */}
            <TeamMember
              name="Ruwan Weligamage"
              role="Lead HR and Operational Manager"
              image="https://ui-avatars.com/api/?name=Member+Two&background=0f172a&color=fff&size=200"
            />
            
          </div>
        </div>
      </section>

    

      {/* Simple Footer */}
      <footer className="bg-slate-950 text-slate-600 py-8 text-center text-xs font-bold uppercase tracking-widest border-t border-slate-800">
        &copy; 2026 SmartPolytunnelAgro System. All rights reserved.
      </footer>
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
    <div data-aos="fade-up" className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${styles[color]}`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">
        {desc}
      </p>
    </div>
  );
};

const TeamMember = ({ name, role, image }) => (
  <div data-aos="fade-up" className="bg-white p-6 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center gap-5 hover:-translate-y-2 transition-transform duration-300">
    <img
      src={image}
      alt={name}
      className="w-20 h-20 rounded-2xl object-cover shadow-md"
    />
    <div>
      <h4 className="text-lg font-bold text-slate-800">{name}</h4>
      <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3">
        {role}
      </p>
      <div className="flex gap-3 text-slate-400">
        <Linkedin
          size={16}
          className="hover:text-blue-600 cursor-pointer transition-colors"
        />
        <Github
          size={16}
          className="hover:text-slate-900 cursor-pointer transition-colors"
        />
        <Twitter
          size={16}
          className="hover:text-sky-500 cursor-pointer transition-colors"
        />
      </div>
    </div>
  </div>
);

export default About;
