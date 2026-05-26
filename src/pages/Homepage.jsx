import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- IMPORT SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Import Assets
import logoKemenimipas from '../assets/img/logo_kemenimipas.png';
import logoDitjenpas from '../assets/img/logo_ditjenpas.png';
import { API_BASE_URL, IMG_BASE_URL } from '../utils/api';

const Homepage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Manipulasi URL secara dinamis agar mengarah ke folder slider
  const SLIDER_IMG_URL = IMG_BASE_URL.replace('berita', 'slider');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Berita
        const newsRes = await axios.get(`${API_BASE_URL}/berita`);
        const newsData = newsRes.data.data || newsRes.data;
        const filteredNews = newsData
          .filter(item => item.status === 'Published')
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        setLatestNews(filteredNews);

        // 2. Fetch Slider
        const sliderRes = await axios.get(`${API_BASE_URL}/slider`);
        const sliderData = sliderRes.data.data || sliderRes.data;
        const activeSliders = sliderData
          .filter(s => s.status === 'Published')
          .sort((a, b) => a.urutan - b.urutan);
        setSliders(activeSliders);

      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-midnight text-white overflow-x-hidden relative selection:bg-gold-dignity selection:text-midnight">
      
      {/* --- HERO SLIDER SECTION --- */}
      <header className="relative h-screen w-full bg-midnight">
        {sliders.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={sliders.length > 1}
            className="h-full w-full"
          >
            {sliders.map((slide) => (
              <SwiperSlide key={slide.id} className="relative">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={`${SLIDER_IMG_URL}${slide.gambar}`} 
                    alt={slide.judul} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2070";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-midnight/60 to-midnight"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center justify-center px-6">
                  <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    
                    {/* Logos */}
                    <div className="flex items-center gap-6 md:gap-8 mb-12 animate-fadeIn">
                      <img src={logoKemenimipas} alt="Kemenimipas" className="h-16 md:h-20 object-contain drop-shadow-lg" />
                      <img src={logoDitjenpas} alt="Ditjenpas" className="h-16 md:h-20 object-contain drop-shadow-lg" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-platinum text-sm mb-10 backdrop-blur-md">
                      <span className="flex h-2 w-2 rounded-full bg-gold-dignity animate-ping"></span>
                      SI-PASTAR: {slide.judul}
                    </div>

                    <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
                      <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        {slide.judul}
                      </span>
                      <br />
                      <span className="text-gold-dignity italic drop-shadow-[0_0_20px_rgba(238,191,99,0.4)]">
                        {slide.highlight}
                      </span>
                    </h1>

                    <p className="max-w-2xl text-lg md:text-xl text-gray-400 leading-relaxed mb-12 font-light line-clamp-3">
                      {slide.deskripsi}
                    </p>

                    <button 
                      onClick={() => navigate('/form-layanan')}
                      className="px-10 py-4 bg-gold-dignity hover:bg-white text-midnight rounded-xl font-bold transition-all shadow-xl active:scale-95"
                    >
                      Mulai Layanan Online →
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-dignity"></div>
          </div>
        )}

        {/* CSS Custom untuk Pagination Swiper */}
        <style dangerouslySetInnerHTML={{ __html: `
          .swiper-pagination-bullet { background: white !important; opacity: 0.5; }
          .swiper-pagination-bullet-active { background: #EEBF63 !important; opacity: 1; width: 30px; border-radius: 5px; transition: all 0.3s; }
        `}} />
      </header>

      {/* --- SECTION 1: BERITA TERKINI --- */}
      <section id="berita" className="relative py-24 px-6 bg-gold-dignity">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                    <h2 className="text-midnight font-bold tracking-[0.2em] text-sm mb-3 uppercase opacity-70">Warta Lapas</h2>
                    <p className="text-3xl md:text-5xl font-black text-midnight tracking-tight">Berita & Kegiatan Terbaru</p>
                </div>
                <button 
                    onClick={() => navigate('/berita')}
                    className="px-6 py-3 bg-midnight text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all shadow-lg flex items-center gap-2"
                >
                    Lihat Semua Berita ↗
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {!loading ? (
                    latestNews.map((news) => (
                        <div key={news.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-white/50 flex flex-col">
                            <div className="h-60 bg-slate-200 relative overflow-hidden">
                                <img 
                                  src={`${IMG_BASE_URL}${news.gambar}`} 
                                  alt={news.judul} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                                <div className="absolute top-5 left-5 bg-gold-dignity text-midnight text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                                    {news.kategori || 'Terbaru'}
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>{new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-midnight leading-snug line-clamp-2">{news.judul}</h3>
                                <div onClick={() => navigate(`/berita/${news.id}`)} className="mt-auto flex items-center gap-2 text-midnight font-bold text-sm cursor-pointer group/btn">
                                    Baca Selengkapnya <span className="w-8 h-[2px] bg-midnight transition-all group-hover/btn:w-12"></span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    [1, 2, 3].map((i) => <div key={i} className="h-96 bg-white/20 animate-pulse rounded-[2rem]"></div>)
                )}
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
                { name: 'Tiktok', url: 'https://www.tiktok.com/@pastarberkarya'}
              ].map((soc) => (
                <a key={soc.name} href={soc.url} target="_blank" rel="noopener noreferrer" 
                   className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-gold-dignity hover:text-midnight transition-all font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center min-w-[140px] backdrop-blur-sm">
                  {soc.name}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-10 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] backdrop-blur-xl group hover:border-gold-dignity/50 transition-all duration-500 text-center">
              <p className="text-gold-dignity text-5xl font-black mb-4 group-hover:scale-110 transition-transform">100%</p>
              <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold">Transparansi Data</p>
            </div>
            <div className="p-10 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] backdrop-blur-xl group hover:border-blue-500/50 transition-all duration-500 text-center">
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
                <button onClick={() => toggleFaq(idx)} className="w-full px-8 py-7 flex justify-between items-center text-left">
                  <span className="font-bold text-lg pr-4 group-hover:text-gold-dignity transition-colors">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all ${activeFaq === idx ? 'bg-gold-dignity border-none rotate-180' : ''}`}>
                    <span className={`text-xs ${activeFaq === idx ? 'text-midnight' : 'text-gold-dignity'}`}>▼</span>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-8 pb-8 text-gray-400 leading-relaxed border-t border-white/5 pt-4 mx-8">{faq.a}</div>
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