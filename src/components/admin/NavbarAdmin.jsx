import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, UserCircle, Menu } from 'lucide-react';

// Import Logo
import logoKemenimipas from "../../assets/img/logo_kemenimipas.png";

const NavbarAdmin = ({ onOpenSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    
    // 1. Cek kecocokan statis terlebih dahulu
    const titles = {
      '/admin/dashboard': 'Dashboard',
      '/admin/galeri-kegiatan': 'Galeri Kegiatan',
      '/admin/list-pengaduan': 'Daftar Pengaduan',
      '/admin/hak-akses': 'Manajemen Hak Akses',
      '/admin/persyaratan-integrasi': 'Persyaratan Integrasi',
      '/admin/layanan': 'Layanan Publik',
      '/admin/alur-kunjungan': 'Alur Kunjungan',
      '/admin/tata-tertib': 'Regulasi & Tata Tertib',
      '/admin/berita': 'Kelola Berita',
      '/admin/berita/tambah': 'Tambah Berita',
      '/admin/informasi': 'Informasi Publik',
      '/admin/struktur': 'Struktur Organisasi',
      '/admin/video': 'Kelola Video',
      '/admin/set-slider': 'Pengaturan Slider',
      '/admin/karya-wbp': 'Karya WBP',
      '/admin/pesanan': 'Daftar Pesanan',
      '/admin/keamanan': 'Modul Keamanan'
    };

    if (titles[path]) return titles[path];

    // 2. Cek kecocokan dinamis (untuk Edit atau Detail)
    if (path.startsWith('/admin/berita/edit/')) return 'Edit Berita';
    if (path.startsWith('/admin/berita/detail/')) return 'Detail Berita';
    if (path.startsWith('/admin/layanan/edit/')) return 'Edit Layanan';

    return 'Panel Admin';
  };

  return (
    // Penyesuaian margin (mx) agar tidak mepet layar di HP
    <nav 
      className={`sticky top-2 z-40 flex items-center justify-between px-3 py-2.5 md:px-4 md:py-3 transition-all duration-300 rounded-2xl mx-2 md:mx-4 ${
        isScrolled 
        ? "bg-white/80 backdrop-blur-md shadow-lg border border-white/50" 
        : "bg-white/40 border border-transparent"
      }`}
    >
      {/* KIRI: Kontrol Sidebar & Judul */}
      <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
        <button 
          onClick={onOpenSidebar}
          className="flex-shrink-0 flex items-center justify-center p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 lg:cursor-default"
        >
          {/* Logo tampil di desktop, Icon menu tampil di HP */}
          <img 
            src={logoKemenimipas} 
            alt="Logo" 
            className="h-7 w-auto md:h-8 hidden sm:block" 
          />
          <Menu size={20} className="sm:hidden text-slate-600" />
          
          {/* Indikator Notif */}
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5 lg:hidden">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
        </button>

        <div className="flex flex-col overflow-hidden">
          {/* Breadcrumb hanya muncul di layar besar */}
          <nav aria-label="breadcrumb" className="hidden md:block">
            <ol className="flex text-[10px] font-black text-slate-400 uppercase tracking-[1px]">
              <li className="opacity-50">Admin</li>
              <li className="before:content-['/'] before:mx-2 text-blue-500">{getPageTitle()}</li>
            </ol>
          </nav>
          <h6 className="font-black text-slate-800 text-sm md:text-base leading-tight truncate">
            {getPageTitle()}
          </h6>
        </div>
      </div>

      {/* KANAN: User Profile & Action */}
      <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
        
        {/* User Info Card */}
        <div className="flex items-center gap-2 pl-2 pr-1 md:px-3 py-1 bg-white/60 rounded-xl md:rounded-2xl border border-white/50 shadow-sm">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-[11px] font-black text-slate-800 leading-none truncate max-w-[100px]">
              {userData?.nama || 'Admin'}
            </span>
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">
              {userData?.username || 'Petugas'}
            </span>
          </div>
          <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg md:rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
            <UserCircle size={18} />
          </div>
        </div>

        {/* Tombol Logout - Ukuran disesuaikan untuk HP */}
        <button 
          onClick={handleLogout}
          className="p-2 md:p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
          title="Keluar"
        >
          <LogOut size={16} md:size={18} />
        </button>

      </div>
    </nav>
  );
};

export default NavbarAdmin;