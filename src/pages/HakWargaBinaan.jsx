import React from 'react';
import { 
  HeartPulse, 
  BookOpen, 
  Scale, 
  Utensils, 
  Church, 
  MessageCircle, 
  FileCheck,
  ShieldCheck,
  Users2
} from 'lucide-react';

const HakWargaBinaan = () => {
  const hakData = [
    {
      title: "Ibadah & Spiritual",
      desc: "Melakukan ibadah sesuai dengan agama atau kepercayaan yang dianut secara bebas dan aman.",
      icon: <Church size={28} />,
    },
    {
      title: "Kesehatan & Nutrisi",
      desc: "Mendapatkan perawatan kesehatan, makanan yang layak, dan sanitasi yang memenuhi standar kesehatan.",
      icon: <HeartPulse size={28} />,
    },
    {
      title: "Pendidikan & Literasi",
      desc: "Mendapatkan pendidikan, pengajaran, serta akses terhadap bahan bacaan dan informasi lainnya.",
      icon: <BookOpen size={28} />,
    },
    {
      title: "Bantuan Hukum",
      desc: "Mendapatkan penyuluhan hukum dan bantuan hukum untuk menjamin keadilan selama proses pidana.",
      icon: <Scale size={28} />,
    },
    {
      title: "Komunikasi",
      desc: "Menerima kunjungan dari keluarga, pengacara, atau orang tertentu sesuai dengan ketentuan.",
      icon: <MessageCircle size={28} />,
    },
    {
      title: "Integrasi & Remisi",
      desc: "Mendapatkan pengurangan masa pidana (Remisi), Pembebasan Bersyarat (PB), dan hak integrasi lainnya.",
      icon: <FileCheck size={28} />,
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-gold-dignity mb-4 uppercase tracking-[0.3em] text-[10px] font-black">
              <ShieldCheck size={16} /> Undang-Undang No. 22 Tahun 2022
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter">
              Hak Warga <span className="text-gold-dignity">Binaan</span>
            </h1>
            <p className="text-slate-400 font-medium leading-relaxed italic border-l-2 border-gold-dignity pl-6">
              Setiap Warga Binaan Pemasyarakatan berhak mendapatkan perlakuan secara manusiawi dan perlindungan hukum tanpa diskriminasi sesuai standar Pemasyarakatan.
            </p>
          </div>
          <div className="bg-gold-dignity/10 border border-gold-dignity/20 p-6 rounded-3xl hidden lg:block">
             <p className="text-gold-dignity text-[10px] font-black uppercase tracking-widest mb-1">Total Hak Dasar</p>
             <p className="text-white text-3xl font-black italic tracking-tighter">13+ POIN</p>
          </div>
        </div>

        {/* Grid Hak */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hakData.map((hak, index) => (
            <div 
              key={index} 
              className="group bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] hover:border-gold-dignity/30 transition-all duration-500 shadow-xl"
            >
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-gold-dignity mb-6 group-hover:scale-110 group-hover:bg-gold-dignity group-hover:text-black transition-all duration-500 shadow-lg">
                {hak.icon}
              </div>
              <h3 className="text-xl font-bold text-white uppercase italic mb-3 tracking-tight group-hover:text-gold-dignity transition-colors">
                {hak.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {hak.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Info Tambahan (Gratis) */}
        <div className="mt-16 p-10 rounded-[3rem] bg-gradient-to-r from-slate-900 to-transparent border border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="flex -space-x-4">
             <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-[#020617] text-white">
                <Users2 />
             </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-white font-black text-2xl uppercase italic mb-2 tracking-tight">Seluruh Layanan <span className="text-emerald-500">GRATIS</span></h4>
            <p className="text-slate-500 text-sm max-w-xl">
              Segala bentuk pemenuhan hak warga binaan (Remisi, Pembebasan Bersyarat, Makanan, Kesehatan) **TIDAK DIPUNGUT BIAYA**. Laporkan jika ada indikasi pungli.
            </p>
          </div>
          <button className="px-8 py-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10">
            Lapor Pungli
          </button>
        </div>

      </div>
    </div>
  );
};

export default HakWargaBinaan;