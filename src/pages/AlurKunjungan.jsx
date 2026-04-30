import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserCheck, 
  Search, 
  ClipboardList, 
  Users, 
  ShieldCheck, 
  Clock, 
  Info,
  PackageSearch,
  Fingerprint
} from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const AlurKunjungan = () => {
  // 1. DATA ALUR
  const [alurData] = useState([
    {
      id: 1,
      judul: "Pengambilan Nomor Antrian",
      deskripsi: "Pengunjung mengambil nomor antrian di mesin antrian yang telah disediakan sesuai dengan jenis layanan.",
      iconName: "ClipboardList", 
    },
    {
      id: 2,
      judul: "Ruang Tunggu Pengunjung",
      deskripsi: "Menunggu panggilan petugas di ruang tunggu dengan tertib sesuai dengan urutan nomor antrian.",
      iconName: "Clock",
    },
    {
      id: 3,
      judul: "Pendaftaran Pengunjung",
      deskripsi: "Verifikasi identitas asli (KTP/SIM) di loket pendaftaran dan sinkronisasi data kunjungan.",
      iconName: "UserCheck",
    },
    {
      id: 4,
      judul: "Penggeledahan Barang",
      deskripsi: "Pemeriksaan barang bawaan menggunakan X-Ray atau pemeriksaan manual oleh petugas keamanan.",
      iconName: "PackageSearch",
    },
    {
      id: 5,
      judul: "Penggeledahan Badan & Stempel",
      deskripsi: "Pemeriksaan fisik pengunjung dan pemberian stempel khusus sebagai tanda izin akses masuk.",
      iconName: "Search",
    },
    {
      id: 6,
      judul: "Pengambilan Barang Besukan",
      deskripsi: "Barang besukan yang telah diperiksa diberikan nomor label untuk diserahkan kepada warga binaan.",
      iconName: "ClipboardList",
    },
    {
      id: 7,
      judul: "Penukaran Alas Kaki",
      deskripsi: "Pengunjung wajib menukarkan alas kaki pribadi dengan alas kaki khusus yang telah disediakan Lapas.",
      iconName: "ShieldCheck",
    },
    {
      id: 8,
      judul: "Kunjungan Keluarga",
      deskripsi: "Pelaksanaan tatap muka dengan warga binaan di area yang telah ditentukan dengan durasi terbatas.",
      iconName: "Users",
    }
  ]);

  // 2. STATE JADWAL
  const [jadwal, setJadwal] = useState(null);

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/jadwal`);
        if (res.data && res.data.length > 0) {
          setJadwal(res.data[0]);
        }
      } catch (error) {
        console.error("Gagal mengambil jadwal:", error);
      }
    };
    fetchJadwal();
  }, []);

  // Fungsi Helper Icon
  const renderIcon = (name) => {
    switch (name) {
      case "UserCheck": return <UserCheck size={32} />;
      case "Search": return <Search size={32} />;
      case "Fingerprint": return <Fingerprint size={32} />;
      case "Users": return <Users size={32} />;
      case "PackageSearch": return <PackageSearch size={32} />;
      case "ClipboardList": return <ClipboardList size={32} />;
      case "Clock": return <Clock size={32} />;
      case "ShieldCheck": return <ShieldCheck size={32} />;
      default: return <Info size={32} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] bg-gradient-to-b from-[#020617] via-[#070f2b] to-[#020617] pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-dignity/10 border border-gold-dignity/20 text-gold-dignity text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <ShieldCheck size={14} /> Informasi Layanan Publik
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">
            Alur <span className="text-gold-dignity">Kunjungan</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed italic">
            "Prosedur kunjungan dapat berubah sewaktu-waktu sesuai dengan instruksi pusat dan kondisi keamanan Lapas."
          </p>
        </div>

        {/* Timeline Section (Alur Tetap Dipakai) */}
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-dignity/50 via-white/10 to-transparent hidden md:block"></div>

          <div className="space-y-12 md:space-y-24">
            {alurData.map((item, index) => (
              <div key={item.id} className={`relative flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Bulatan Nomor */}
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-[#020617] border-2 border-gold-dignity rounded-full z-10 hidden md:flex items-center justify-center text-gold-dignity font-black text-sm italic shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  0{index + 1}
                </div>

                {/* Konten Card */}
                <div className="w-full md:w-5/12 group">
                  <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-gold-dignity/30 transition-all duration-500 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 bg-slate-900 rounded-2xl text-gold-dignity group-hover:scale-110 transition-transform">
                        {renderIcon(item.iconName)}
                      </div>
                      <span className="text-5xl font-black text-white/5 italic">0{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase italic mb-3 tracking-tight">
                      {item.judul}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal Box (Dinamis dari Admin) */}
        {jadwal && (
          <div className="mt-32 p-10 rounded-[3rem] bg-white/5 border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h4 className="text-white font-black text-3xl uppercase italic mb-6 flex items-center gap-3">
                  <Clock className="text-gold-dignity" /> Jadwal Operasional
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gold-dignity text-[10px] font-black uppercase tracking-widest mb-1">
                      Tahanan ({jadwal.tahanan_hari})
                    </p>
                    <p className="text-white font-bold text-xl italic">{jadwal.tahanan_jam} WIB</p>
                  </div>
                  <div>
                    <p className="text-gold-dignity text-[10px] font-black uppercase tracking-widest mb-1">
                      Narapidana ({jadwal.napi_hari})
                    </p>
                    <p className="text-white font-bold text-xl italic">{jadwal.napi_jam} WIB</p>
                  </div>
                </div>

                {/* Tampilkan Jadwal Khusus Jika Aktif di Admin */}
                {jadwal.is_ramadhan_active && (
                  <div className="mt-8 p-6 bg-gold-dignity/10 border border-gold-dignity/20 rounded-2xl border-dashed">
                    <p className="text-gold-dignity text-[10px] font-black uppercase tracking-widest mb-1">
                      {jadwal.ramadhan_ket}
                    </p>
                    <p className="text-white font-bold text-xl italic">{jadwal.ramadhan_jam} WIB</p>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-px h-px md:h-24 bg-white/10"></div>

              <div className="flex items-start gap-4 flex-1 bg-black/40 p-6 rounded-2xl border border-white/5">
                <Info className="text-gold-dignity shrink-0" size={20} />
                <p className="text-slate-400 text-xs leading-relaxed">
                  <span className="text-white font-bold block mb-1 uppercase tracking-tighter">Catatan Penting:</span>
                  {jadwal.catatan}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AlurKunjungan;