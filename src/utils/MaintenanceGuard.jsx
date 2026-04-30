import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, RefreshCw } from 'lucide-react';

const MaintenanceGuard = ({ children }) => {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    // Interceptor untuk menangkap error dari seluruh aplikasi
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Cek status maintenance dari backend atau error network
        if (
          (error.response && error.response.data.status === 'maintenance') ||
          error.code === 'ERR_NETWORK' || 
          error.message === 'Network Error'
        ) {
          setIsMaintenance(true);
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // LOGIKA BLOCKING:
  // Jika isMaintenance TRUE, kita HANYA merender tampilan maintenance.
  // Variabel 'children' (seluruh isi App.js) tidak akan dipanggil.
  if (isMaintenance) {
    return (
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: '#f8fafc', // slate-50
          zIndex: 999999, // Sangat tinggi agar menutupi segalanya
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 text-center">
          <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-spin-slow">
            <Settings size={48} />
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
            Sistem Maintenance
          </h1>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-10 font-sans">
            Mohon maaf, layanan <strong>SI-PASTAR</strong> sedang tidak dapat diakses karena pemeliharaan rutin. Silakan coba kembali nanti.
          </p>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200"
          >
            <RefreshCw size={18} />
            Segarkan Halaman
          </button>
        </div>

        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }
          /* Memaksa body tidak bisa di-scroll saat maintenance */
          body { overflow: hidden !important; height: 100vh !important; }
        `}</style>
      </div>
    );
  }

  // JIKA TIDAK MAINTENANCE, BARULAH TAMPILKAN ISI APLIKASI
  return <>{children}</>;
};

export default MaintenanceGuard;