import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoKemenimipas from '../assets/img/logo_kemenimipas.png';
import logoPastar from "../assets/img/logo_zi_lapas_blitar.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setActiveDropdown(null);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path) => {
    setIsOpen(false);
    setActiveDropdown(null);
    navigate(path);
  };

  const menuItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Berita', path: '/berita' },
    { 
      name: 'Informasi', 
      submenu: [
        { name: 'Tata Tertib & Ketentuan', path: '/informasi/tata-tertib' },
        { name: 'Alur Kunjungan', path: '/informasi/alur-kunjungan' },
        { name: 'Karya WBP', path: '/informasi/karya-wbp' },
        { name: 'Hak Warga Binaan', path: '/informasi/hak-wbp' }
      ] 
    },
    { 
      name: 'Profil', 
      submenu: [
        { name: 'Visi & Misi', path: '/profil/visi-misi' },
        { name: 'Struktur Organisasi', path: '/profil/struktur' },
        { name: 'Sejarah', path: '/profil/sejarah' }
      ] 
    },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled || isOpen ? "bg-white shadow-xl py-3" : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          {/* <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/')}>
            <img src={logoKemenimipas} alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
            <span className={`font-black tracking-tighter text-xl hidden sm:block ${
              isScrolled || isOpen ? "text-midnight" : "text-white"
            }`}>SI-PASTAR</span>
          </div> */}
         
          {/* LOGO SECTION */}
<div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavigation('/')}>
  <div className={`transition-all duration-500 p-2 rounded-xl ${
    isScrolled || isOpen 
      ? "bg-midnight shadow-lg scale-90" // Saat scroll, logo dibungkus kotak gelap
      : "bg-transparent"
  }`}>
    <img 
      src={logoPastar} 
      alt="Logo" 
      className="h-10 md:h-11 w-auto object-contain" 
    />
  </div>
  
  <span className={`font-black tracking-tighter text-xl hidden sm:block transition-colors duration-500 ${
    isScrolled || isOpen ? "text-midnight" : "text-white"
  }`}>
    SI-PASTAR
  </span>
</div>

          {/* --- MENU DESKTOP --- */}
          <div className="hidden md:flex items-center gap-8 h-full">
            {menuItems.map((item) => (
              <div 
                key={item.name} 
                className="relative h-full flex items-center"
                onMouseEnter={() => item.submenu && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  onClick={() => !item.submenu && handleNavigation(item.path)}
                  className={`flex items-center gap-1 text-sm font-bold tracking-wide transition-all duration-300 hover:text-gold-dignity ${
                    isScrolled ? "text-midnight" : "text-white"
                  }`}
                >
                  {item.name}
                  {item.submenu && (
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {/* DROPDOWN MENU - DIBENAHI DISINI */}
                {item.submenu && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 pt-4 w-56 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                      <div className="py-2">
                        {item.submenu.map((sub) => (
                          <button
                            key={sub.name}
                            onClick={() => handleNavigation(sub.path)}
                            className="w-full text-left px-6 py-3 text-sm font-semibold text-midnight hover:bg-gold-dignity hover:text-midnight transition-colors"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* BUTTON LAYANAN */}
          <button 
            onClick={() => handleNavigation('/form-layanan')}
            className={`hidden md:block px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg active:scale-95 ${
              isScrolled ? "bg-midnight text-white shadow-midnight/20" : "bg-gold-dignity text-midnight"
            }`}
          >
            Layanan
          </button>

          {/* HAMBURGER (Mobile) */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 z-50">
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 transition-all ${isScrolled || isOpen ? 'bg-midnight' : 'bg-white'} ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`w-full h-0.5 transition-all ${isScrolled || isOpen ? 'bg-midnight' : 'bg-white'} ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 transition-all ${isScrolled || isOpen ? 'bg-midnight' : 'bg-white'} ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div className={`md:hidden absolute top-0 left-0 right-0 bg-white transition-all duration-500 shadow-2xl overflow-y-auto ${
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="flex flex-col pt-24 pb-10 px-8">
          {menuItems.map((item) => (
            <div key={item.name} className="border-b border-gray-50">
              <button 
                onClick={() => item.submenu ? setActiveDropdown(activeDropdown === item.name ? null : item.name) : handleNavigation(item.path)}
                className="flex justify-between items-center w-full text-midnight font-bold text-xl py-5"
              >
                {item.name}
                {item.submenu && (
                  <span className={`transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`}>▼</span>
                )}
              </button>
              
              {item.submenu && activeDropdown === item.name && (
                <div className="bg-slate-50 rounded-xl mb-4 overflow-hidden">
                  {item.submenu.map((sub) => (
                    <button 
                      key={sub.name} 
                      onClick={() => handleNavigation(sub.path)}
                      className="w-full text-left px-6 py-4 text-midnight/70 font-semibold text-base border-b border-white last:border-0"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button 
            onClick={() => handleNavigation('/form-layanan')}
            className="w-full mt-8 py-4 bg-gold-dignity text-midnight font-black rounded-2xl"
          >
            LAYANAN ONLINE
          </button>
        </div>
      </div>
    </nav>
  );
} 