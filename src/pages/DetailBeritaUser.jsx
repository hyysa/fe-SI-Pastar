import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Calendar, ChevronLeft, ArrowRight, Info, User, Clock } from 'lucide-react';

const DetailBeritaUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  const imgBaseUrl = `${apiUrl.replace('/api', '')}/uploads/berita/`;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/berita/${id}`);
        setNews(response.data.data);
        
        const allNews = await axios.get(`${apiUrl}/berita`);
        const otherNews = (allNews.data.data || allNews.data)
          .filter(item => item.id !== parseInt(id) && item.status === 'Published')
          .slice(0, 3);
        setRelatedNews(otherNews);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("Error:", err);
        navigate('/berita');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, apiUrl, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-midnight">
      <Loader2 className="animate-spin text-gold-dignity" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-slate-50 to-white text-midnight pb-20">
      <div className="h-32"></div>

      <main className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* KOLOM KIRI: ARTIKEL UTAMA */}
          <div className="lg:w-2/3">
            <article className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100">
              
              <div className="w-full h-[300px] md:h-[500px] overflow-hidden group relative">
                <img 
                  src={`${imgBaseUrl}${news.gambar}`} 
                  alt={news.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="p-8 md:p-16">
                <div className="flex items-center gap-4 mb-8">
                  <span className="bg-gold-dignity text-midnight text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm">
                    {news.kategori}
                  </span>
                  <div className="h-[1px] w-12 bg-slate-200"></div>
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={12} className="text-gold-dignity" />
                    {/* Tanggal Kegiatan (dari input admin) */}
                    Waktu Kegiatan: {new Date(news.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-midnight leading-[1.1] mb-12 tracking-tighter">
                  {news.judul}
                </h1>

                {/* Author & Release Info Card */}
                <div className="flex items-center gap-5 mb-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 group">
                  <div className="w-14 h-14 rounded-2xl bg-midnight flex items-center justify-center text-gold-dignity shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <User size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-midnight uppercase tracking-tighter">
                      {news.penulis && news.penulis !== 'Admin' ? news.penulis : 'Humas Lapas Blitar'}
                    </p>
                    {/* created_at diletakkan di sini sebagai waktu rilis */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest italic mt-1">
                      <Clock size={10} className="text-slate-300" />
                      Diterbitkan: {new Date(news.created_at).toLocaleString('id-ID', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} WIB
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="prose prose-xl max-w-none text-slate-600 leading-[1.8] font-light">
                  {news.isi ? news.isi.split('\n').map((paragraph, index) => (
                    paragraph.trim() !== "" && (
                      <p key={index} className="mb-8 whitespace-pre-line">
                        {paragraph}
                      </p>
                    )
                  )) : (
                    <p className="italic text-slate-400">Konten berita tidak tersedia.</p>
                  )}
                </div>

                <button 
                  onClick={() => navigate('/berita')}
                  className="mt-16 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-gold-dignity transition-all"
                >
                  <ChevronLeft size={18} /> Kembali ke Daftar Warta
                </button>
              </div>
            </article>
          </div>

          {/* KOLOM KANAN: SIDEBAR */}
          <div className="lg:w-1/3 space-y-8">
            <aside className="sticky top-28">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 mb-8">
                <h3 className="text-2xl font-black text-midnight mb-10 flex items-center gap-4">
                  <span className="w-3 h-3 bg-gold-dignity rounded-full animate-pulse"></span>
                  Warta Lainnya
                </h3>
                
                <div className="space-y-10">
                  {relatedNews.length > 0 ? relatedNews.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => navigate(`/berita/${item.id}`)}
                      className="group cursor-pointer border-b border-slate-50 pb-6 last:border-0"
                    >
                      <span className="text-[9px] font-black text-gold-dignity uppercase tracking-[0.2em] block mb-3 group-hover:translate-x-2 transition-transform duration-300">
                        {item.kategori} • {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                      <h4 className="font-bold text-lg text-midnight leading-snug group-hover:text-gold-dignity transition-colors line-clamp-2">
                        {item.judul}
                      </h4>
                    </div>
                  )) : (
                    <p className="text-slate-400 text-sm italic tracking-widest font-bold">Belum ada berita lain.</p>
                  )}
                </div>

                <button 
                  onClick={() => navigate('/berita')}
                  className="w-full mt-12 py-5 bg-midnight text-white text-[11px] font-black rounded-[1.5rem] hover:bg-gold-dignity hover:text-midnight transition-all uppercase tracking-[0.3em] shadow-lg shadow-midnight/10 flex items-center justify-center gap-3"
                >
                  Lihat Semua <ArrowRight size={14} />
                </button>
              </div>

              {/* Citizen Journalism Card */}
              <div className="bg-gradient-to-br from-gold-dignity to-amber-500 p-10 rounded-[3rem] shadow-2xl text-midnight group">
                <div className="bg-midnight/10 p-3 rounded-2xl w-fit mb-6">
                  <Info size={24} />
                </div>
                <p className="font-black uppercase text-[10px] tracking-[0.3em] mb-4 opacity-70 leading-none">Layanan Informasi</p>
                <h4 className="text-2xl font-black leading-tight mb-8">Punya pengaduan terkait layanan kami?</h4>
                <div className="bg-midnight/10 h-[2px] w-full mb-8"></div>
                <a 
                  href="https://wa.me/628123456789" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block bg-midnight text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform"
                >
                  HUBUNGI HUMAS
                </a>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailBeritaUser;