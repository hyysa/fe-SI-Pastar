import { useParams, useNavigate } from 'react-router-dom';

const DetailBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data Dummy
  const dataBerita = {
    title: "Transformasi Digital Pelayanan Terpadu Satu Pintu",
    date: "12 JANUARI 2026",
    author: "Humas Lapas Blitar",
    category: "Inovasi",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop", 
    content: `Lapas Kelas IIB Blitar terus berinovasi dalam memberikan pelayanan terbaik bagi masyarakat. Melalui peluncuran sistem SI-PASTAR, proses birokrasi yang sebelumnya memakan waktu kini dapat dipangkas menjadi lebih efisien dan transparan.
    
    Kepala Lapas Kelas IIB Blitar menyatakan bahwa transformasi digital ini adalah bentuk komitmen nyata dalam mewujudkan Zona Integritas menuju WBK/WBBM. "Kami ingin memastikan bahwa keluarga warga binaan mendapatkan kepastian layanan tanpa harus melalui prosedur yang rumit," ujarnya.
    
    Dalam sistem baru ini, masyarakat dapat mengakses jadwal kunjungan, pendaftaran layanan penitipan barang, hingga informasi pembebasan bersyarat secara online.`
  };

  const beritaLainnya = [
    { id: 2, title: "Donor Darah Rutin WBP", date: "10 Jan", category: "Sosial" },
    { id: 3, title: "Pembinaan Kemandirian Koi", date: "08 Jan", category: "Produksi" },
    { id: 4, title: "Kunjungan Kerja Kanwil", date: "05 Jan", category: "Kedinasan" },
  ];

  return (
    // Background Utama: Gradasi dari Midnight ke Putih
    <div className="min-h-screen bg-gradient-to-b from-midnight via-slate-50 to-white text-midnight pb-20">
      
      {/* --- TOP NAVIGATION --- */}
      <nav className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden md:block">
          </div>
        </div>
      </nav>

      {/* --- MAIN LAYOUT --- */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* KOLOM KIRI: ARTIKEL UTAMA */}
          <div className="lg:w-2/3">
            <article className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100">
              
              {/* Image Container */}
              <div className="w-full h-[500px] overflow-hidden group">
                <img 
                  src={dataBerita.image} 
                  alt={dataBerita.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>

              <div className="p-10 md:p-16">
                <div className="flex items-center gap-4 mb-8">
                  <span className="bg-gold-dignity text-midnight text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm">
                    {dataBerita.category}
                  </span>
                  <div className="h-[1px] w-12 bg-slate-200"></div>
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    {dataBerita.date}
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-midnight leading-[1.1] mb-12 tracking-tighter">
                  {dataBerita.title}
                </h1>

                {/* Author Info */}
                <div className="flex items-center gap-5 mb-12 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-midnight flex items-center justify-center text-gold-dignity font-bold text-xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                    H
                  </div>
                  <div>
                    <p className="text-sm font-black text-midnight uppercase tracking-tighter">{dataBerita.author}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tim Humas Lapas Blitar</p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="prose prose-xl max-w-none text-slate-600 leading-[1.8] space-y-8 font-light">
                  {dataBerita.content.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* KOLOM KANAN: SIDEBAR */}
          <div className="lg:w-1/3 space-y-8">
            <aside className="sticky top-10">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 mb-8">
                <h3 className="text-2xl font-black text-midnight mb-10 flex items-center gap-4">
                  <span className="w-3 h-3 bg-gold-dignity rounded-full animate-pulse"></span>
                  Terkait
                </h3>
                
                <div className="space-y-10">
                  {beritaLainnya.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => navigate(`/detail-berita/${item.id}`)}
                      className="group cursor-pointer"
                    >
                      <span className="text-[10px] font-black text-gold-dignity uppercase tracking-[0.2em] block mb-3 group-hover:translate-x-2 transition-transform">
                        {item.category} • {item.date}
                      </span>
                      <h4 className="font-bold text-lg text-midnight leading-snug group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => navigate('/berita')}
                  className="w-full mt-12 py-5 bg-midnight text-white text-[11px] font-black rounded-[1.5rem] hover:bg-gold-dignity hover:text-midnight transition-all uppercase tracking-[0.3em] shadow-lg shadow-midnight/10"
                >
                  Lihat Semua
                </button>
              </div>

              {/* Citizen Journalism Card */}
              <div className="bg-gradient-to-br from-gold-dignity to-yellow-500 p-10 rounded-[3rem] shadow-2xl text-midnight">
                <p className="font-black uppercase text-[10px] tracking-[0.3em] mb-4 opacity-70">Layanan Informasi</p>
                <h4 className="text-2xl font-black leading-tight mb-6 italic">Punya pengaduan terkait layanan kami?</h4>
                <div className="bg-midnight/10 h-[1px] w-full mb-6"></div>
                <div className="flex items-center gap-4">
                   <div className="bg-midnight text-white px-4 py-2 rounded-xl font-black text-sm">HUBUNGI</div>
                </div>
              </div>
            </aside>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DetailBerita;