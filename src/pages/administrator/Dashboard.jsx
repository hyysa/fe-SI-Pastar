import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
import { Users, FileText, Bell, ShoppingBag, Loader2 } from 'lucide-react';

const DashboardAdmin = () => {
  const [news, setNews] = useState([]);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [statsData, setStatsData] = useState({
    totalInformasi: 0,
    karyaWBP: 0,
    layanan: 0,
    antrian: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Ambil data informasi (DIPA, LAKIP, Karya WBP)
        const resInfo = await axios.get(`${API_BASE_URL}/informasi`);
        
        // 2. Ambil data pendaftaran (Untuk card "Pendaftar Layanan")
        const resPendaftaran = await axios.get(`${API_BASE_URL}/pendaftaran`);
        
        // 3. Ambil statistik mingguan khusus grafik pendaftar dari backend
        const resGrafik = await axios.get(`${API_BASE_URL}/pendaftaran/statistik/mingguan`);

        const allInfo = Array.isArray(resInfo.data) ? resInfo.data : [];
        const allPendaftaran = Array.isArray(resPendaftaran.data) ? resPendaftaran.data : [];

        // UPDATE STATISTIK CARDS
        setStatsData({
          totalInformasi: allInfo.length,
          karyaWBP: allInfo.filter(item => item.kategori?.toUpperCase() === 'KARYA WBP').length,
          layanan: allPendaftaran.length, 
          antrian: 0 
        });

        // UPDATE GRAFIK (Mengambil array [0,0,0,0,0,0,0] dari API)
        if (resGrafik.data && resGrafik.data.data) {
          setWeeklyData(resGrafik.data.data);
        }

        // Tampilkan 3 dokumen terbaru di tabel bawah
        setNews(allInfo.slice(0, 3));

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Total Dokumen", value: statsData.totalInformasi, icon: <FileText size={20}/>, color: "bg-blue-600" },
    { label: "Karya WBP", value: statsData.karyaWBP, icon: <ShoppingBag size={20}/>, color: "bg-amber-500" },
    { label: "Pendaftar Layanan", value: statsData.layanan, icon: <Users size={20}/>, color: "bg-emerald-500" },
    { label: "Status Sistem", value: "Active", icon: <Bell size={20}/>, color: "bg-fuchsia-600" },
  ];

  const maxVal = Math.max(...weeklyData, 1);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Sinkronisasi Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-2 md:p-0">
      
      {/* 4 Card Statistik Atas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
              <h3 className="text-2xl font-black text-gray-800 mt-1">{item.value}</h3>
            </div>
            <div className={`${item.color} p-3.5 rounded-2xl text-white shadow-lg shadow-gray-200`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Baris Tengah: Welcome Message & Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* Welcome Card */}
        <div className="lg:col-span-4 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-3 italic uppercase leading-none">Pusat Kendali</h2>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed font-medium italic">
              Memantau <span className="text-blue-600 font-bold">{statsData.layanan} pendaftaran layanan</span> masuk. 
              Grafik di sebelah kanan adalah akumulasi pendaftar dalam 7 hari terakhir.
            </p>
          </div>
          <div className="hidden md:flex absolute -right-6 top-0 bottom-0 w-1/3 bg-slate-50 items-center justify-center border-l border-gray-100">
              <span className="text-7xl grayscale opacity-10">🛡️</span>
          </div>
        </div>

        {/* GRAFIK DINAMIS (Data dari pendaftaranModel) */}
        <div className="lg:col-span-3 bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Trafik Pendaftaran</h3>
               <span className="text-[9px] font-black bg-white/10 px-3 py-1 rounded-full uppercase italic">Live Data</span>
            </div>
            <p className="text-[9px] text-gray-400 font-medium mb-8 uppercase tracking-tighter">Statistik Layanan Online (7 Hari Terakhir)</p>
          </div>
          
          <div className="h-32 flex items-end justify-between gap-3">
            {weeklyData.map((count, i) => (
              <div key={i} className="w-full bg-white/5 rounded-t-xl relative group h-full">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl z-20">
                  {count}
                </div>
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-amber-500 rounded-t-xl transition-all duration-1000 group-hover:bg-amber-400" 
                  style={{ 
                    height: `${(count / (maxVal * 1.2)) * 100}%`,
                    minHeight: count > 0 ? '8px' : '0px' 
                  }}
                ></div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between text-[9px] text-gray-500 font-black uppercase tracking-widest">
            <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
          </div>
        </div>
      </div>

      {/* Tabel Informasi Terkini */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest leading-none">Log Dokumen Terbaru</h3>
          <span className="text-[9px] bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black uppercase tracking-widest tracking-tighter">Database Terhubung</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase text-gray-400 font-black border-b border-gray-50 bg-gray-50/50">
                <th className="px-8 py-5">Nama Dokumen</th>
                <th className="px-8 py-5">Kategori</th>
                <th className="px-8 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {news.length > 0 ? (
                news.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-gray-50 last:border-0">
                    <td className="px-8 py-5 text-gray-800 font-black uppercase italic text-xs tracking-tight">{item.nama_dokumen}</td>
                    <td className="px-8 py-5">
                      <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-widest">Detail</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center">
                    <p className="text-xs font-black uppercase text-gray-300 tracking-widest">Belum ada data dokumen</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;