import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, Settings, UserCircle } from 'lucide-react';

// Import Logo untuk digunakan sebagai hamburger di mobile
import logoKemenimipas from "../../assets/img/logo_kemenimipas.png";

const NavbarAdmin = ({ onOpenSidebar }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/admin/dashboard': 'Dashboard',
      '/admin/berita': 'Kelola Berita',
      '/admin/berita/tambah': 'Tambah Berita',
      '/admin/layanan': 'Layanan Publik',
      '/admin/informasi': 'Data Informasi',
      '/admin/visi-misi': 'Visi & Misi',
      '/admin/struktur': 'Struktur Organisasi',
      '/admin/sejarah': 'Sejarah Lapas'
    };
    return titles[path] || 'Panel Admin';
  };

  return (
    <nav 
      className={`sticky top-4 z-40 flex items-center justify-between px-4 py-3 transition-all duration-300 rounded-2xl mx-2 ${
        isScrolled 
        ? "bg-white/80 backdrop-blur-md shadow-lg border border-white/50" 
        : "bg-white/40 border border-transparent"
      }`}
    >
      {/* KIRI: Logo (Hamburger) & Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* LOGO SEBAGAI TOMBOL MENU (Hanya aktif di Mobile) */}
        <button 
          onClick={onOpenSidebar}
          className="flex items-center justify-center p-1.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 lg:cursor-default lg:hover:bg-white"
        >
          <img 
            src={logoKemenimipas} 
            alt="Menu" 
            className="h-8 w-auto object-contain" 
          />
          {/* Indikator Animasi kecil (Opsional) - Menandakan ini bisa diklik di mobile */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3 lg:hidden">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        </button>

        <div className="flex flex-col">
          <nav aria-label="breadcrumb" className="hidden sm:block">
            <ol className="flex text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <li className="opacity-50">Halaman</li>
              <li className="before:content-['/'] before:mx-2 text-slate-600">{getPageTitle()}</li>
            </ol>
          </nav>
          <h6 className="font-bold text-slate-800 text-base leading-tight">
            {getPageTitle()}
          </h6>
        </div>
      </div>

      {/* KANAN: Search & Icons */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Input - Disembunyikan di layar sangat kecil agar tidak sempit */}
        <div className="hidden sm:flex items-center bg-white/50 border border-gray-200 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari..." 
            className="ml-2 bg-transparent outline-none text-sm text-slate-700 w-20 md:w-32 lg:w-44"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          
          <div className="relative">
            <button className="p-2 text-slate-500 hover:bg-white rounded-lg transition-colors">
              <Bell size={18} />
            </button>
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 border-2 border-white rounded-full"></span>
          </div>

          <button className="ml-2 flex items-center gap-2 p-1 pr-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all shadow-sm">
            <div className="bg-white/20 p-1 rounded-lg">
              <UserCircle size={18} />
            </div>
            <span className="text-xs font-bold hidden md:block">Profil</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;