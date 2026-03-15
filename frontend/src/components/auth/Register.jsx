import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Mail, 
  Lock, 
  User, 
  Phone,
  ArrowRight, 
  Tractor, 
  ShieldCheck,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState('farmer'); // 'farmer' or 'admin'
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // --- 1. Basic Validation ---
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters.");
      setIsLoading(false);
      return;
    }

    
    setTimeout(() => {
      
      console.log("Registered User:", { ...formData, role });
      
      
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900 py-10">
      
      {/* --- Background Image & Overlay --- */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-58f214014a2b?q=80&w=2671&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(40%) brightness(30%)'
        }}
      ></div>

      {/* --- Abstract Shapes --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>

      {/* --- Register Card --- */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden">
          
          {/* Header Section */}
          <div className="px-8 pt-10 pb-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2 group cursor-pointer mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Leaf size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SmartAgro</span>
            </Link>
            
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Join the Revolution</h2>
            <p className="text-slate-300 text-sm">Create your account to start smart farming.</p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex px-8 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                role === 'farmer' 
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <Tractor size={16} /> Farmer
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                role === 'admin' 
                  ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/25' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-10 bg-white rounded-t-[2.5rem] pt-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="e.g. Nimal Perera"
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="mail@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Phone</label>
                  <div className="relative group">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="07X XXXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                <div className="relative group">
                  <CheckCircle2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full bg-slate-50 border rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 transition-all ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'
                    }`}
                    placeholder="Repeat password"
                  />
                </div>
              </div>

              {/* Error Message */}
              <div className="text-sm text-red-500 font-semibold min-h-[20px]">
                {error && <span className="flex items-center gap-1 animate-pulse">⚠️ {error}</span>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 mt-2 ${
                  role === 'admin' 
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                } ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" /> Creating Account...
                  </>
                ) : (
                  <>
                    Register Now <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm font-medium text-slate-500 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                  Login here
                </Link>
              </p>

            </form>
          </div>
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-white/40 text-xs mt-8 mb-4 font-medium tracking-widest uppercase">
          Join 1.2K+ Farmers on SmartAgro
        </p>
      </div>
    </div>
  );
};

export default Register;