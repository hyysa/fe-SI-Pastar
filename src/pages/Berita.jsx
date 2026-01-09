import { useNavigate } from 'react-router-dom';

const Berita = () => {
  const navigate = useNavigate();

  const daftarBerita = [
    { id: 1, date: "12 JAN 2026", title: "Transformasi Digital Pelayanan Terpadu Satu Pintu", category: "TERBARU" },
    { id: 2, date: "10 JAN 2026", title: "Pemberian Remisi Khusus Hari Raya kepada WBP", category: "TERBARU" },
    { id: 3, date: "08 JAN 2026", title: "Pelatihan Kemandirian: Budidaya Ikan Koi", category: "KEGIATAN" },
    { id: 4, date: "05 JAN 2026", title: "Kunjungan Kerja Kanwil Kemenkumham Jatim", category: "TERBARU" },
    { id: 5, date: "03 JAN 2026", title: "Pemeriksaan Kesehatan Rutin Warga Binaan", category: "KESEHATAN" },
    { id: 6, date: "01 JAN 2026", title: "Apel Siaga Pengamanan Tahun Baru 2026", category: "KEAMANAN" },
  ];

  return (
    <div className="min-h-screen bg-platinum">
      {/* --- HEADER (Midnight Blue) --- */}
      <header className="bg-midnight text-white pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 bg-midnight-light border border-white/10 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white hover:text-midnight transition-all mb-12 shadow-xl"
          >
            <span className="group-hover:-translate-x-1 transition-transform">❮</span> Kembali ke Beranda
          </button>

          <div className="space-y-4">
            <h2 className="text-gold-dignity font-bold tracking-[0.4em] text-sm uppercase opacity-90">
              Warta Lapas
            </h2>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
              Warta Lapas
            </h1>
            <p className="text-gray-400 max-w-3xl text-xl font-light leading-relaxed">
              Informasi terkini mengenai inovasi, kegiatan pembinaan, dan berita resmi dari Lapas Kelas IIB Blitar.
            </p>
          </div>
        </div>
      </header>

      {/* --- CONTENT (Gold Dignity) --- */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        {/* UKURAN DIPERBESAR: Mengubah grid-cols menjadi maksimal 3 saja di layar besar agar kartu lebar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {daftarBerita.map((news) => (
            <div 
              key={news.id} 
              className="group bg-white rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.2)] hover:-translate-y-4 transition-all duration-500 flex flex-col"
            >
              {/* Image Area - Tinggi ditambah agar lebih megah */}
              <div className="h-72 bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                <div className="absolute top-8 left-8 bg-gold-dignity text-midnight text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-lg z-20">
                  {news.category}
                </div>
                {/* Placeholder Image */}
                <div className="w-full h-full bg-slate-300 transition-transform duration-1000 group-hover:scale-110"></div>
              </div>

              {/* Text Area - Padding ditambah agar lebih lega */}
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>{news.date}</span>
                  <span className="w-2 h-2 rounded-full bg-gold-dignity"></span>
                  <span>HUMAS</span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-midnight mb-6 leading-tight group-hover:text-gold-dignity transition-colors min-h-[4rem]">
                  {news.title}
                </h3>
                
                <p className="text-slate-500 text-base leading-relaxed mb-8 line-clamp-3">
                  Upaya berkelanjutan dalam meningkatkan kualitas pelayanan publik dan transparansi informasi melalui digitalisasi sistem informasi pemasyarakatan.
                </p>

                {/* Card Action - Dibuat lebih mencolok */}
                <div onClick={() => navigate(`/detail-berita/${news.id}`)} className="mt-auto flex items-center gap-4 text-midnight font-black text-sm uppercase tracking-wider group/btn cursor-pointer">
                  <span>Baca Selengkapnya</span>
                  <div className="relative flex items-center">
                    <span className="w-10 h-[3px] bg-midnight transition-all duration-300 group-hover/btn:w-16"></span>
                    <span className="absolute right-[-4px] opacity-0 group-hover/btn:opacity-100 transition-all">❯</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Berita;