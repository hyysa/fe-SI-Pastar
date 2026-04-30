import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Calendar, User, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const Berita = () => {
  const navigate = useNavigate();
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Menampilkan 6 berita per halaman

  // Ambil URL API dari .env
  // const apiUrl = import.meta.env.VITE_API_URL;
  // const imgBaseUrl = `http://MSI.local:5000/uploads/berita/`;
  const currentHostname = window.location.hostname;
  const apiUrl = `http://${currentHostname}:5000/api`;
  const imgBaseUrl = `http://${currentHostname}:5000/uploads/berita/`;

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        setLoading(true);
        // Mengambil semua berita (Status Published biasanya difilter di backend)
        const response = await axios.get(`${apiUrl}/berita`);
        const data = response.data.data || response.data;
        
        // Filter hanya yang statusnya Published untuk halaman publik
        const publishedNews = data.filter(item => item.status === 'Published');
        setBerita(publishedNews);
      } catch (err) {
        console.error("Gagal memuat berita:", err);
        setError("Gagal mengambil data berita terbaru.");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [apiUrl]);

  // Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = berita.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(berita.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-platinum">
        <Loader2 className="animate-spin text-midnight mb-4" size={48} />
        <p className="text-midnight font-black text-xs uppercase tracking-widest">Menyiapkan Informasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-platinum">
      {/* --- HEADER --- */}
      <header className="bg-midnight text-white pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-dignity/5 skew-x-12 translate-x-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gold-dignity hover:text-midnight transition-all mb-12"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
          </button>

          <div className="space-y-4">
            <h2 className="text-gold-dignity font-bold tracking-[0.4em] text-sm uppercase">Warta Lapas</h2>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">Berita <span className="text-gold-dignity">Terkini</span></h1>
            <p className="text-gray-400 max-w-2xl text-lg font-light leading-relaxed">
              Eksplorasi kegiatan pembinaan, inovasi layanan, dan informasi resmi dari Lapas Kelas IIB Blitar secara transparan.
            </p>
          </div>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {berita.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl">
            <Search className="mx-auto text-slate-200 mb-4" size={64} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Belum ada berita yang diterbitkan.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentItems.map((news) => (
                <div 
                  key={news.id} 
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col border border-slate-100"
                >
                  {/* Image Area */}
                  <div className="h-64 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={`${imgBaseUrl}${news.gambar}`} 
                      alt={news.judul}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Lapas+Blitar"; }}
                    />
                    <div className="absolute top-6 left-6 bg-midnight text-gold-dignity text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest shadow-lg z-20">
                      {news.kategori}
                    </div>
                  </div>

                  {/* Text Area */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar size={12} className="text-gold-dignity" />
                      <span>{new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-midnight mb-4 leading-snug group-hover:text-gold-dignity transition-colors line-clamp-2">
                      {news.judul}
                    </h3>
                    
                    <div 
                      className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: news.isi.substring(0, 150) + "..." }}
                    />

                    {/* Action */}
                    <button 
                      onClick={() => navigate(`/berita/${news.id}`)}
                      className="mt-auto flex items-center gap-3 text-midnight font-black text-[11px] uppercase tracking-widest group/btn border-t border-slate-50 pt-6"
                    >
                      <span>Lihat Detail</span>
                      <div className="w-8 h-[2px] bg-gold-dignity transition-all group-hover/btn:w-12"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-20 gap-2">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-2xl bg-white border border-slate-200 text-midnight disabled:opacity-30 hover:bg-midnight hover:text-white transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`w-12 h-12 rounded-2xl font-black text-xs transition-all shadow-sm ${
                      currentPage === index + 1 
                        ? 'bg-midnight text-gold-dignity scale-110 shadow-midnight/20' 
                        : 'bg-white text-slate-400 border border-slate-200 hover:border-midnight'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-2xl bg-white border border-slate-200 text-midnight disabled:opacity-30 hover:bg-midnight hover:text-white transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Berita;