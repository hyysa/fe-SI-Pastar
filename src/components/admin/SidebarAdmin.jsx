import React from 'react';
import { 
  LayoutDashboard, Newspaper, FileText, ShoppingCart, ShoppingBag, Images, ShieldAlert, Users, Scale, MessageSquare, History, 
  Target, Map, LogOut, UserCheck, X 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Import Logo
import logoKemenimipas from "../../assets/img/logo_kemenimipas.png";

const SidebarAdmin = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  // 1. Ambil data user dengan proteksi agar tidak error jika localStorage kosong
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  
  // Pastikan role diambil dalam format huruf kecil agar cocok dengan definisi menu
  const userRole = user?.role ? user.role.toLowerCase() : '';
  console.log(userRole);
  // 2. Definisi Menu Utama
  const menus = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={18}/>, 
      path: '/admin/dashboard',
      roles: ['humas', 'adkamtib', 'kplp', 'binadik', 'pengawas'] 
    },
    { 
      name: 'Kelola Berita', 
      icon: <Newspaper size={18}/>, 
      path: '/admin/berita',
      roles: ['humas', 'pengawas'] 
    },
    { 
      name: 'Layanan Publik', 
      icon: <UserCheck size={18}/>, 
      path: '/admin/layanan',
      roles: ['adkamtib','binadik','pengawas'] 
    },
    { 
      name: 'Layanan Integrasi', 
      icon: <FileText size={18}/>, 
      path: '/admin/persyaratan-integrasi',
      roles: ['binadik','pengawas'] 
    },
    { 
      name: 'Informasi Publik', 
      icon: <Newspaper size={18}/>, 
      path: '/admin/informasi',
      roles: ['humas', 'pengawas'] 
    },
    { 
      name: 'Kelola Tata Tertib', 
      icon: <Scale size={18}/>, 
      path: '/admin/tata-tertib',
      roles: ['humas', 'pengawas', 'adkamtib'] 
    },
    { 
      name: 'Karya WBP', 
      icon: <ShoppingCart size={18}/>, 
      path: '/admin/karya-wbp',
      roles: ['binadik', 'humas', 'pengawas'] 
    },
    { 
      name: 'Pesanan', 
      icon: <ShoppingBag size={18}/>, 
      path: '/admin/pesanan',
      roles: ['binadik', 'humas', 'pengawas'] 
    },
    { 
      name: 'Alur Kunjungan', 
      icon: <Users size={18}/>, 
      path: '/admin/alur-kunjungan',
      roles: ['adkamtib','binadik', 'pengawas'] 
    },
    {
      name: 'List Pengaduan',
      icon: <MessageSquare size={18}/>,
      path: '/admin/list-pengaduan',
      roles: ['pengawas'] 
    },
  ];

  const profileMenus = [
    { 
      name: 'Setting Slider', 
      icon: <Images size={18}/>, 
      path: '/admin/set-slider',
      roles: ['humas', 'pengawas'] 
    },
    { 
      name: 'Video Profil', 
      icon: <Target size={18}/>, 
      path: '/admin/video',
      roles: ['humas', 'pengawas'] 
    },
    { 
      name: 'Struktur Organisasi', 
      icon: <Map size={18}/>, 
      path: '/admin/struktur',
      roles: ['humas', 'pengawas'] 
    },
    { 
      name: 'Galeri Kegiatan', 
      icon: <History size={18}/>, 
      path: '/admin/galeri-kegiatan',
      roles: ['humas', 'pengawas', 'binadik', 'kplp', 'adkamtib'] 
    },
    { 
      name: 'Hak Akses Admin', 
      icon: <ShieldAlert size={18}/>, 
      path: '/admin/hak-akses',
      roles: ['pengawas'] 
    },
  ];

  // 3. Logika Filter yang lebih aman
  const filteredMenus = menus.filter(item => item.roles.includes(userRole));
  const filteredProfileMenus = profileMenus.filter(item => item.roles.includes(userRole));

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // Fungsi Logout Bersih
  const handleLogout = () => {
    localStorage.clear(); // Hapus semua session termasuk role
    window.location.href = "/";
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`fixed left-4 top-4 bottom-4 w-64 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl z-[70] transition-all duration-500 ease-in-out border border-white/50 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-[115%] lg:translate-x-0"}`}>
        
        <div className="relative flex items-center gap-3 px-6 py-8 border-b border-gray-100 flex-shrink-0">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 lg:hidden transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center justify-center p-1 bg-slate-100 rounded-xl shadow-sm">
            <img src={logoKemenimipas} alt="Logo" className="h-9 w-auto object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 leading-tight text-lg tracking-tighter">SI-PASTAR</span>
            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Panel Admin</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          {/* Menu Utama */}
          {filteredMenus.length > 0 ? (
            <>
              <p className="px-4 text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Manajemen Utama</p>
              <div className="space-y-1 mb-8">
                {filteredMenus.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path} 
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      location.pathname === item.path ? 'bg-white shadow-md text-gray-800' : 'text-gray-500 hover:bg-gray-50 hover:pl-5'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shadow-sm transition-colors ${
                      location.pathname === item.path ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-gray-50'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold">{item.name}</span>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="px-4 text-[10px] text-red-400 italic">Akses menu tidak ditemukan</p>
          )}

          {/* Profil Instansi */}
          {filteredProfileMenus.length > 0 && (
            <>
              <p className="px-4 text-[11px] font-bold text-gray-400 uppercase mt-2 mb-2 tracking-wider">Profil Instansi</p>
              <div className="space-y-1">
                {filteredProfileMenus.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      location.pathname === item.path ? 'bg-white shadow-md text-gray-800' : 'text-gray-500 hover:bg-gray-50 hover:pl-5'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shadow-sm transition-colors ${
                      location.pathname === item.path ? 'bg-blue-600 text-white' : 'bg-white text-amber-500 border border-gray-50'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold">{item.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-gray-50 flex-shrink-0">
          <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs opacity-70 font-medium">Selesai bertugas?</p>
              <p className="font-bold text-sm mb-3">Keluar Sistem</p>
              <button 
                onClick={handleLogout}
                className="w-full bg-white text-slate-900 py-2 rounded-xl text-xs font-bold uppercase shadow-lg flex items-center justify-center gap-2 hover:bg-red-50 transition-all active:scale-95"
              >
                <LogOut size={14}/> Keluar
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarAdmin;