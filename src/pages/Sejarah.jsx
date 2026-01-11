import React from 'react';
import LogoKemenimipas from '../assets/img/logo_kemenimipas.png';


const Sejarah = () => {
  const historyData = [
    {
      tahun: "Masa Kolonial",
      judul: "Peninggalan Belanda",
      deskripsi: "Gedung Lapas Kelas IIB Blitar merupakan bangunan peninggalan zaman penjajahan Belanda yang didirikan sekitar tahun 1914. Arsitektur aslinya masih dipertahankan sebagai bagian dari nilai sejarah.",
      icon: "🏛️"
    },
    {
      tahun: "Era Kemerdekaan",
      judul: "Transisi Administrasi",
      deskripsi: "Pasca kemerdekaan RI, pengelolaan penjara beralih ke Pemerintah Indonesia di bawah Departemen Kehakiman. Fokus mulai bergeser dari sekadar penjarakan menjadi pembinaan.",
      icon: "🇮🇩"
    },
    {
      tahun: "1983",
      judul: "Sistem Pemasyarakatan",
      deskripsi: "Perubahan istilah dari 'Penjara' menjadi 'Lembaga Pemasyarakatan' (LAPAS). Hal ini menandai dimulainya pendekatan humanis untuk membina warga binaan agar siap kembali ke masyarakat.",
      icon: "🤝"
    },
    {
      tahun: "Era Modern",
      judul: "Peningkatan Status & Fasilitas",
      deskripsi: "Lapas Blitar ditetapkan sebagai Kelas IIB. Pengembangan terus dilakukan mulai dari penguatan sistem keamanan berbasis IT hingga program kemandirian seperti bengkel kerja dan pesantren.",
      icon: "🛡️"
    },
    {
      tahun: "Sekarang",
      judul: "WBK & Pelayanan Prima",
      deskripsi: "Berfokus pada pembangunan Zona Integritas menuju Wilayah Bebas dari Korupsi (WBK). Lapas Blitar kini menjadi institusi yang transparan dengan pelayanan berbasis HAM.",
      icon: "✨"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-slate-50 to-white py-25 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center mb-20">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-full shadow-md">
            <img 
              src={LogoKemenimipas} 
              alt="Logo Kemenimipas" 
              className="h-20 w-auto"
            />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gold-dignity via-slate-50 to-white uppercase tracking-tight">
          Sejarah & Jejak Langkah
        </h1>
        <h2 className="text-xl md:text-2xl font-medium mt-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Lembaga Pemasyarakatan Kelas IIB Blitar
        </h2>
        <div className="mt-6 h-1.5 w-32 bg-amber-500 mx-auto rounded-full"></div>
      </div>

      {/* Container Timeline */}
      <div className="max-w-6xl mx-auto relative">
        {/* Garis Vertikal Tengah */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-slate-300"></div>

        <div className="space-y-16">
          {historyData.map((item, index) => (
            <div key={index} className={`relative flex items-center justify-between md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Box Konten */}
              <div className="flex-1 md:w-[45%] p-2">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">{item.tahun}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 group-hover:text-gold-dignity transition-colors">
                    {item.judul}
                  </h3>
                  <p className="text-slate-600 mt-4 leading-relaxed text-justify">
                    {item.deskripsi}
                  </p>
                </div>
              </div>

              {/* Spacer */}
              <div className="hidden md:block md:w-[45%]"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Quote Section */}
      <div className="max-w-4xl mx-auto mt-24 text-center border-t border-slate-200 pt-12">
        <p className="text-2xl font-light text-slate-500 italic">
          "Membangun Manusia Mandiri, Menuju Pemasyarakatan yang Bermartabat."
        </p>
        <p className="mt-4 font-bold text-slate-700">— Lembaga Pemasyarakatan Kelas IIB Blitar</p>
      </div>
    </div>
  );
};

export default Sejarah;