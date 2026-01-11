import React from 'react';
import { 
  Search, Eye, CheckCircle, XCircle, 
  Users, Calendar, Phone, Fingerprint, Clock
} from 'lucide-react';

const LayananPublik = () => {
  // Data Dummy lengkap dengan Timestamp, Status WBP, dan Status Verifikasi
  const dataKunjungan = [
    { 
      id: 1, 
      timestamp: "12/01/2026 09:15:22",
      namaPengunjung: "Budi Santoso", 
      nik: "3572012345670001", 
      namaWbp: "Zainal Arifin", 
      statusWbp: "Narapidana", 
      whatsapp: "081234567890", 
      statusVerifikasi: "Pending" // Status awal
    },
    { 
      id: 2, 
      timestamp: "11/01/2026 14:05:10",
      namaPengunjung: "Siti Aminah", 
      nik: "3572054321000002", 
      namaWbp: "Rahmat Hidayat", 
      statusWbp: "Tahanan", 
      whatsapp: "085788990011", 
      statusVerifikasi: "Disetujui" // Status sukses
    },
    { 
      id: 3, 
      timestamp: "11/01/2026 10:00:05",
      namaPengunjung: "Andi Wijaya", 
      nik: "3572098765432100", 
      namaWbp: "Iwan Fals", 
      statusWbp: "Narapidana", 
      whatsapp: "081334455667", 
      statusVerifikasi: "Ditolak" // Status gagal
    },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Antrian Masuk', val: '15', icon: <Users />, color: 'blue' },
          { label: 'Perlu Verifikasi', val: '8', icon: <Fingerprint />, color: 'amber' },
          { label: 'Total Kunjungan Hari Ini', val: '24', icon: <Calendar />, color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-white shadow-sm flex items-center gap-4">
            <div className={`p-2.5 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl`}>
              {React.cloneElement(stat.icon, { size: 18 })}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{stat.label}</p>
              <p className="text-lg font-bold text-slate-800 leading-none">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Tabel Data Kunjungan */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-sm border border-white overflow-hidden">
        <div className="p-6 pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Data Kunjungan Online</h2>
            <p className="text-xs text-slate-400">Kelola dan verifikasi permohonan kunjungan masyarakat</p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Cari data..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu Daftar</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pengunjung & NIK</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tujuan (WBP)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status WBP</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kontak WA</th>
                <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Verifikasi</th>
                <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dataKunjungan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={12} className="text-blue-500" />
                      <span className="text-xs font-medium italic">{item.timestamp}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{item.namaPengunjung}</span>
                      <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{item.nik}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                    {item.namaWbp}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      item.statusWbp === 'Narapidana' 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                      {item.statusWbp}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <a href={`https://wa.me/${item.whatsapp}`} className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-medium">
                      <Phone size={12} />
                      {item.whatsapp}
                    </a>
                  </td>

                  {/* KOLOM STATUS VERIFIKASI BARU */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      item.statusVerifikasi === 'Disetujui' ? 'bg-green-50 text-green-600 border border-green-100' :
                      item.statusVerifikasi === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        item.statusVerifikasi === 'Disetujui' ? 'bg-green-600' :
                        item.statusVerifikasi === 'Pending' ? 'bg-amber-600' : 'bg-red-600'
                      }`} />
                      {item.statusVerifikasi}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Detail Lengkap">
                        <Eye size={14} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Setujui">
                        <CheckCircle size={14} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Tolak">
                        <XCircle size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LayananPublik;