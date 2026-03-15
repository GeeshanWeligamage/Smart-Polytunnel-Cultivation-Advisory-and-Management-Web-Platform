import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, Tractor, ShieldCheck, Loader2
} from 'lucide-react';
// Context එක import කරා
import { AuthContext } from '../../context/AuthContext'; 

const Login = () => {
  const navigate = useNavigate();
  // Context එකෙන් login function එක ගත්තා
  const { login } = useContext(AuthContext); 

  const [role, setRole] = useState('farmer'); 
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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

    // Mock Login Process
    setTimeout(() => {
      // Password එක අකුරු 4ට වැඩි නම් Login වෙනවා
      if (formData.password.length > 4) {
        
        const mockUser = {
          username: role === 'admin' ? "Admin User" : "Nimal Perera",
          role: role,
          email: formData.email
        };

        // වැදගත්ම කොටස: Context එක update කරනවා
        login(mockUser);

        // ඊට පස්සේ Dashboard එකට යවනවා
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/farmer-dashboard');
        }

      } else {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    }, 2000); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      
      {/* Backgrounds */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=2664&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(30%) brightness(40%)' }}></div>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md mx-4 animate-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden">
          
          <div className="px-8 pt-10 pb-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2 group cursor-pointer mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Leaf size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SmartAgro</span>
            </Link>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back!</h2>
            <p className="text-slate-300 text-sm">Access your precision agriculture dashboard.</p>
          </div>

          <div className="flex px-8 gap-4 mb-6">
            <button onClick={() => setRole('farmer')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border ${role === 'farmer' ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>
              <Tractor size={16} /> Farmer
            </button>
            <button onClick={() => setRole('admin')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border ${role === 'admin' ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/25' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>
              <ShieldCheck size={16} /> Admin
            </button>
          </div>

          <div className="px-8 pb-10 bg-white rounded-t-[2.5rem] pt-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"><Mail size={20} /></div>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" placeholder="name@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"><Lock size={20} /></div>
                  <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-red-500 font-semibold min-h-[20px]">{error && <span className="flex items-center gap-1 animate-pulse">⚠️ {error}</span>}</div>
                <Link to="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot Password?</Link>
              </div>

              <button type="submit" disabled={isLoading} className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 ${role === 'admin' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'} ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}>
                {isLoading ? <><Loader2 size={24} className="animate-spin" /> Verifying...</> : <>Login to Dashboard <ArrowRight size={20} /></>}
              </button>

              <p className="text-center text-sm font-medium text-slate-500 mt-6">Don't have an account? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Create Account</Link></p>
            </form>
          </div>
        </div>
        <p className="text-center text-white/40 text-xs mt-8 font-medium tracking-widest uppercase">Secured by SmartPolytunnel Systems</p>
      </div>
    </div>
  );
};

export default Login;