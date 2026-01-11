import React from 'react';
import { Users, FileText, Bell, TrendingUp } from 'lucide-react';

const DashboardAdmin = () => {
  // Data Statistik Dummy
  const stats = [
    { label: "Total Warga Binaan", value: "452", change: "+5%", icon: <Users size={20}/>, color: "bg-blue-600" },
    { label: "Laporan Layanan", value: "28", change: "+12%", icon: <FileText size={20}/>, color: "bg-emerald-500" },
    { label: "Antrian Hari Ini", value: "15", change: "-2%", icon: <Bell size={20}/>, color: "bg-orange-500" },
    { label: "Kapasitas Hunian", value: "95%", change: "Stabil", icon: <TrendingUp size={20}/>, color: "bg-fuchsia-600" },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Card Statistik Atas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center transition-transform hover:scale-105">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">{item.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-xl font-bold text-gray-800">{item.value}</h3>
                <span className={`text-[10px] font-bold ${item.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                  {item.change}
                </span>
              </div>
            </div>
            <div className={`${item.color} p-3 rounded-xl text-white shadow-lg shadow-blue-100`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Baris Tengah: Info Utama & Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Banner Welcome */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden flex items-center">
          <div className="relative z-10 w-full md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang, Admin SI-PASTAR!</h2>
            <p className="text-gray-500 text-sm mb-4">
              Kelola data layanan, berita, dan informasi profil Lapas Kelas IIB Blitar dengan mudah dalam satu dashboard.
            </p>
            <button className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Lihat Laporan Terbaru <span>→</span>
            </button>
          </div>
          <div className="hidden md:block absolute right-6 top-6 bottom-6 w-1/3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center">
             <span className="text-4xl">🏢</span>
          </div>
        </div>

        {/* Sales/Chart Overview Placeholder */}
        <div className="lg:col-span-3 bg-slate-800 p-6 rounded-3xl shadow-lg text-white">
          <h3 className="font-bold mb-4">Statistik Kunjungan</h3>
          <div className="h-40 flex items-end justify-between gap-2 px-2">
             {/* Simple Bar Chart Placeholder */}
             {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
               <div key={i} className="w-full bg-blue-400/30 rounded-t-lg transition-all hover:bg-blue-400" style={{ height: `${h}%` }}></div>
             ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] text-gray-400 font-bold uppercase">
             <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
          </div>
        </div>
      </div>

      {/* Baris Bawah: Tabel Berita/Aktivitas */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Berita Terakhir Dipublish</h3>
          <button className="px-4 py-2 bg-gray-50 text-blue-600 text-xs font-bold rounded-lg border border-gray-200">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase text-gray-400 font-bold border-b border-gray-50">
                <th className="px-6 py-4">Judul Berita</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { t: "Kegiatan Kerohanian Warga Binaan", c: "Pembinaan", d: "23/12/2025", s: "Published" },
                { t: "Kunjungan Kerja Kakanwil", c: "Kedinasan", d: "20/12/2025", s: "Draft" },
                { t: "Pelatihan Kemandirian Meubel", c: "Kemandirian", d: "18/12/2025", s: "Published" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4 font-bold text-gray-700">{row.t}</td>
                  <td className="px-6 py-4 text-gray-500">{row.c}</td>
                  <td className="px-6 py-4 text-gray-400">{row.d}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.s === 'Published' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                      {row.s}
                    </span>
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

export default DashboardAdmin;