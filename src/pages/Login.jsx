import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import logoPastar from "../assets/img/logo_zi_lapas_blitar.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Fungsi Login ke Backend
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Ambil hostname (localhost atau IP Laptop) secara otomatis
      const host = window.location.hostname;
      
      // Langsung tembak ke port 5000 (Backend)
      const response = await axios.post(`http://${host}:5000/api/auth/login`, {
        username: formData.username,
        password: formData.password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("isLoggedIn", "true");
      navigate('/admin/dashboard');
      
    } catch (error) {
      // Jika error, cek apakah karena jaringan atau respon server
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Gagal terhubung ke server (Port 5000 terblokir/mati).";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e3a8a] p-4 md:p-6">
      
      <div className="w-full max-w-[900px] flex flex-col md:flex-row bg-white rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10">
        
        {/* --- SISI KIRI: BRANDING --- */}
        <div className="w-full md:w-5/12 bg-[#050a18] p-10 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px]"></div>
          
          <div className="relative z-10">
            <div className="inline-block p-4 bg-slate-900/50 border border-white/10 rounded-3xl shadow-xl mb-6 backdrop-blur-sm">
                <img 
                  src={logoPastar} 
                  alt="Logo Pastar" 
                  className="w-16 h-16 object-contain" 
                />
            </div>
            
            <h1 className="text-3xl font-black text-white uppercase tracking-[4px] flex items-center justify-center gap-2">
              SI-PASTAR <ChevronRight className="text-blue-500" size={24} />
            </h1>
            <p className="mt-4 text-[9px] font-black text-slate-500 uppercase tracking-[3px] leading-relaxed max-w-[180px] mx-auto opacity-80">
              Sistem Informasi Lapas Blitar
            </p>
          </div>
        </div>

        {/* --- SISI KANAN: FORM --- */}
        <div className="w-full md:w-7/12 bg-white p-10 md:p-14 flex flex-col justify-center">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Login</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Masukkan akses kredensial Anda</p>
          </div>

          {/* Menampilkan Pesan Error jika Login Gagal */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Masukkan Username..."
                className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 focus:border-blue-600/30 focus:bg-white rounded-full outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm shadow-sm"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Masukkan Password..."
                className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 focus:border-blue-600/30 focus:bg-white rounded-full outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm shadow-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-tighter hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 ${isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-[#050a18] hover:bg-blue-900'} text-white rounded-full font-black text-[12px] uppercase tracking-[4px] shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Sedang Memproses...
                </>
              ) : "Login"}
            </button>
          </form>

          <div className="mt-12 text-center md:text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px]">
              &copy; 2026 Lapas Kelas IIB Blitar
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;