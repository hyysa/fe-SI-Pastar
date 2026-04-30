import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Scale, 
  Info, 
  Maximize2, 
  X, 
  FileCheck,
  Download
} from 'lucide-react';
import { useEsc } from '../hooks/useEsc';

const TataTertib = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  // Data gambar tata tertib (Sesuaikan path gambarnya)
  const rulesImages = [
    {
      id: 1,
      title: "Tata Tertib Pengunjung",
      desc: "Ketentuan umum bagi keluarga/tamu yang datang berkunjung.",
      url: "/images/tatatertib_pengunjung.jpg" // Ganti dengan path aslimu
    },
    {
      id: 2,
      title: "Ketentuan Penitipan Barang",
      desc: "Daftar barang yang dilarang dan prosedur pemeriksaan.",
      url: "/images/ketentuan_barang.jpg" // Ganti dengan path aslimu
    }
  ];

  const closeModal = () => setSelectedImg(null);
  useEsc(closeModal);

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-3 text-gold-dignity mb-4">
            <Scale size={32} />
            <div className="h-px w-12 bg-gold-dignity/30"></div>
            <span className="uppercase tracking-[0.4em] text-[10px] font-black">Legal & Compliance</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter">
            Tata <span className="text-gold-dignity">Tertib</span> & Ketentuan
          </h1>
          <p className="text-slate-400 font-medium max-w-3xl leading-relaxed italic border-l-4 border-gold-dignity pl-6">
            "Kepatuhan adalah bentuk penghormatan terhadap integritas. Harap membaca dan memahami seluruh ketentuan demi kelancaran pelayanan di Lapas Kelas IIB Blitar."
          </p>
        </div>

        {/* Grid Gambar Tata Tertib */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {rulesImages.map((rule) => (
            <div key={rule.id} className="group relative flex flex-col">
              {/* Card Gambar */}
              <div 
                onClick={() => setSelectedImg(rule.url)}
                className="relative aspect-[1.414/1] (kertas A4) overflow-hidden rounded-[2rem] bg-slate-900 border border-white/10 cursor-zoom-in transition-all duration-500 hover:border-gold-dignity/50 shadow-2xl"
              >
                <img 
                  src={rule.url} 
                  alt={rule.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-gold-dignity text-black p-4 rounded-full scale-50 group-hover:scale-100 transition-all duration-500">
                    <Maximize2 size={24} strokeWidth={3} />
                  </div>
                </div>

                {/* Badge Ketentuan */}
                <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                  Official Document
                </div>
              </div>

              {/* Info Tulisan */}
              <div className="mt-6 px-2">
                <h3 className="text-2xl font-bold text-white uppercase italic mb-2 group-hover:text-gold-dignity transition-colors">
                  {rule.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">
                  {rule.desc}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedImg(rule.url)}
                    className="flex items-center gap-2 text-gold-dignity text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                  >
                    <Maximize2 size={14} /> Perbesar Gambar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-20 p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col md:flex-row items-center gap-8 animate-pulse">
          <div className="p-4 bg-gold-dignity/10 rounded-2xl text-gold-dignity">
            <ShieldAlert size={40} />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-tight">Pelanggaran Ketentuan</h4>
            <p className="text-slate-500 text-sm max-w-2xl">
              Setiap pelanggaran terhadap tata tertib di atas akan dikenakan sanksi berupa pencabutan hak kunjungan hingga tindakan hukum sesuai undang-undang yang berlaku.
            </p>
          </div>
        </div>

        {/* MODAL FULLSCREEN IMAGE */}
        {selectedImg && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <div 
              className="absolute inset-0 bg-black/98 backdrop-blur-xl" 
              onClick={closeModal}
            ></div>
            
            <div className="relative w-full max-w-4xl max-h-full flex flex-col items-center animate-in zoom-in-95 duration-300">
              {/* Close Button Floating */}
              <button 
                onClick={closeModal}
                className="absolute -top-12 right-0 md:-right-12 p-3 text-white hover:text-red-500 transition-colors"
              >
                <X size={32} />
              </button>

              <div className="w-full overflow-auto rounded-2xl shadow-2xl border border-white/10 scrollbar-hide">
                <img 
                  src={selectedImg} 
                  alt="Full Rule" 
                  className="w-full h-auto"
                />
              </div>

              <p className="mt-6 text-slate-500 text-[10px] uppercase tracking-[0.5em] font-bold">
                Tekan <span className="text-gold-dignity">ESC</span> untuk Menutup
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TataTertib;