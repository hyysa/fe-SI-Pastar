import React from 'react';

const FooterAdmin = () => {
  return (
    <footer className="mt-auto w-full px-4 md:px-8 py-6 md:py-8 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40 backdrop-blur-sm p-4 md:p-6 rounded-[24px] border border-white/50 shadow-sm">
        
        {/* KIRI: Copyright & Branding */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-[11px] md:text-xs font-medium text-slate-400 uppercase tracking-[1.5px] text-center md:text-left">
            © 2026 • Made with <span className="text-red-500 animate-pulse">❤️</span> by 
            <span className="text-slate-700 font-black ml-1">SI-PASTAR Team</span>
          </p>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center md:text-left">
            Lapas Kelas IIB Blitar
          </p>
        </div>

        {/* KANAN: Links/Info Tambahan (Opsional) */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center md:items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Versi Sistem</span>
            <span className="text-[11px] font-bold text-blue-500">v2.4.0-Stable</span>
          </div>
          
          {/* Garis Pembatas Vertikal di Desktop */}
          <div className="hidden md:block h-8 w-[1px] bg-slate-200"></div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Support</span>
            <span className="text-[11px] font-bold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors">IT Humas</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterAdmin;