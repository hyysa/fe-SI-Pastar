import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logoKemenimipas from '../assets/img/logo_kemenimipas.png';
import logoDitjenpas from '../assets/img/logo_ditjenpas.png';

const Homepage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Fungsi untuk tombol Lihat Semua Berita
  const handleAllNews = () => {
    navigate('/berita');
  };

  return (
    <div className="min-h-screen bg-midnight text-white overflow-x-hidden relative selection:bg-gold-dignity selection:text-midnight">
      
      {/* --- BACKGROUND DECOR (Glow Effects) --- */}
      <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full -z-10"></div>

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* --- 1. DOUBLE LOGO --- */}
          <div className="flex items-center gap-6 md:gap-8 mb-12 animate-[fadeIn_1s_ease-out_forwards]">
            <img 
              src={logoKemenimipas} 
              alt="Logo Kemenimipas" 
              className="h-16 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform duration-500"
            />
            <img 
              src={logoDitjenpas} 
              alt="Logo Ditjenpas" 
              className="h-16 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* --- 2. BADGE SYSTEM --- */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-platinum text-sm font-medium mb-10 backdrop-blur-md animate-[fadeInUp_1s_ease-out_0.3s_forwards] opacity-0">
            <span className="flex h-2 w-2 rounded-full bg-gold-dignity animate-ping"></span>
            SI-PASTAR: Sistem Informasi Lapas Kelas IIB Blitar
          </div>

          {/* --- 3. MAIN TITLE --- */}
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight animate-[fadeInUp_1s_ease-out_0.6s_forwards] opacity-0">
            <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Inovasi Digital
            </span>
            <br />
            <span className="text-gold-dignity drop-shadow-[0_0_20px_rgba(238,191,99,0.4)] italic">
              Pemasyarakatan
            </span>
          </h1>

          {/* --- 4. DESCRIPTION --- */}
          <p className="max-w-2xl text-lg md:text-xl text-gray-400 leading-relaxed mb-12 font-light animate-[fadeInUp_1s_ease-out_0.9s_forwards] opacity-0">
            Mewujudkan keterbukaan informasi dan kemudahan layanan bagi masyarakat luas melalui satu platform digital yang terintegrasi.
          </p>

          {/* --- 5. ACTION BUTTONS --- */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-20 animate-[fadeInUp_1s_ease-out_1.2s_forwards] opacity-0">
            <button 
              onClick={() => navigate('/form-layanan')}
              className="group relative px-10 py-4 bg-midnight hover:bg-gold-dignity text-white rounded-xl font-bold transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] active:scale-95 border border-white/10 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Layanan Online 
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* --- SECTION 1: BERITA TERKINI --- */}
      <section id="berita" className="relative py-24 px-6 bg-gold-dignity shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-midnight font-bold tracking-[0.2em] text-sm mb-3 uppercase opacity-70">
                Warta Lapas
              </h2>
              <p className="text-3xl md:text-5xl font-black text-midnight tracking-tight">
                Berita & Kegiatan Terbaru
              </p>
            </div>
            {/* TOMBOL AKTIF DISINI */}
            <button 
              onClick={handleAllNews}
              className="px-6 py-3 bg-midnight text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              Lihat Semua Berita
              <span className="text-xs">↗</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="group bg-white rounded-[2rem] overflow-hidden shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-white/50"
              >
                <div className="h-60 bg-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-5 left-5 bg-gold-dignity text-midnight text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                    Terbaru
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>12 Jan 2026</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-dignity"></span>
                    <span>Humas Lapas</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-midnight leading-snug group-hover:text-blue-600 transition-colors duration-300">
                    Transformasi Digital Pelayanan Terpadu Satu Pintu
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-8">
                    Lapas Kelas IIB Blitar berkomitmen mempercepat proses birokrasi melalui sistem informasi SI-PASTAR yang transparan.
                  </p>
                  <div 
                    onClick={() => navigate('/detail-berita')}
                    className="flex items-center gap-2 text-midnight font-bold text-sm group/btn cursor-pointer"
                  >
                    Baca Selengkapnya 
                    <span className="w-8 h-[2px] bg-midnight transition-all group-hover/btn:w-12"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 2: MEDIA SOSIAL & STATS --- */}
      <section className="py-32 bg-midnight relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter italic">Tetap Terhubung</h2>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-lg">
              Ikuti perkembangan kegiatan dan transparansi informasi kami melalui platform digital resmi kami.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { name: 'Instagram', url: 'https://www.instagram.com/lapasblitar/' },
                { name: 'Facebook', url: 'https://www.facebook.com/BlitarLapas' },
                { name: 'Youtube', url: 'https://www.youtube.com/@lapasblitar4625' },
                { name: 'Twitter', url: 'https://x.com/BlitarLapa38077' },
                { name: 'Thread', url: 'https://www.threads.com/@lapasblitar'},
                { name: 'Tiktok', url: 'https://www.tiktok.com/@pastarberkarya'}
              ].map((soc) => (
                <a 
                  key={soc.name} 
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-gold-dignity hover:text-midnight transition-all font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center min-w-[140px] backdrop-blur-sm"
                >
                  {soc.name}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-10 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] backdrop-blur-xl group hover:border-gold-dignity/50 transition-all duration-500">
              <p className="text-gold-dignity text-5xl font-black mb-4 group-hover:scale-110 transition-transform">100%</p>
              <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold">Transparansi Data</p>
            </div>
            <div className="p-10 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] backdrop-blur-xl group hover:border-blue-500/50 transition-all duration-500">
              <p className="text-5xl font-black mb-4 italic text-white group-hover:text-blue-400 transition-colors">A+</p>
              <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold">Predikat Layanan</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: FAQ --- */}
      <section id="faq" className="py-24 px-6 mb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-gold-dignity font-bold text-xs tracking-[0.4em] uppercase mb-4">Pusat Bantuan</h2>
            <p className="text-4xl md:text-5xl font-bold tracking-tight">Sering Ditanyakan</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "Syarat kunjungan tatap muka?", a: "Wajib membawa KTP asli, kartu vaksin terakhir, dan merupakan keluarga inti penjamin." },
              { q: "Cara akses E-Library?", a: "Klik tombol E-Library di beranda atau akses melalui menu layanan informasi tanpa akun." },
              { q: "Apakah layanan berbayar?", a: "Seluruh layanan di SI-PASTAR bersifat Gratis (Zero Pungli)." }
            ].map((faq, idx) => (
              <div key={idx} className="group bg-white/5 border border-white/10 rounded-3xl transition-all hover:bg-white/[0.07]">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-8 py-7 flex justify-between items-center text-left"
                >
                  <span className="font-bold text-lg pr-4 group-hover:text-gold-dignity transition-colors">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all ${activeFaq === idx ? 'bg-gold-dignity border-none rotate-180' : ''}`}>
                    <span className={`text-xs ${activeFaq === idx ? 'text-midnight' : 'text-gold-dignity'}`}>▼</span>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-8 pb-8 text-gray-400 leading-relaxed border-t border-white/5 pt-4 mx-8">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;