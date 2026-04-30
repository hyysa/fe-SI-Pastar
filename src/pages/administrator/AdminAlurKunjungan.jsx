import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // 1. Import SweetAlert2
import { Save, Clock, Star, Eye, EyeOff, Loader2 } from 'lucide-react';
import { API_BASE_URL, getAuthHeader } from '../../utils/api';

const AdminAlurKunjungan = () => {
  const [loading, setLoading] = useState(false);
  const [jadwal, setJadwal] = useState({
    tahanan_hari: 'Senin & Rabu',
    tahanan_jam: '08:30 - 11:30',
    napi_hari: 'Selasa & Kamis',
    napi_jam: '08:30 - 11:30',
    ramadhan_ket: 'Jumat - Minggu (Titipan Barang)',
    ramadhan_jam: '14:30 - 16:30',
    is_ramadhan_active: false,
    catatan: ''
  });

  const fetchData = async () => {
    try {
      const resJadwal = await axios.get(`${API_BASE_URL}/jadwal`);
      if (resJadwal.data && resJadwal.data.length > 0) {
        const dbJadwal = resJadwal.data[0];
        setJadwal({
          ...dbJadwal,
          is_ramadhan_active: dbJadwal.is_ramadhan_active === 1 || dbJadwal.is_ramadhan_active === true
        });
      }
    } catch (error) {
      console.error("Gagal mengambil data jadwal:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateJadwal = async () => {
    // 2. Konfirmasi sebelum simpan (Opsional tapi direkomendasikan)
    const result = await Swal.fire({
      title: 'Simpan Perubahan?',
      text: "Jadwal layanan akan langsung diperbarui di sistem.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f172a', // Slate 900
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Simpan!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.patch(`${API_BASE_URL}/jadwal/${jadwal.id || 1}`, jadwal, getAuthHeader());
        
        // 3. Notifikasi Berhasil
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Jadwal operasional telah diperbarui.',
          showConfirmButton: false,
          timer: 1500
        });

        fetchData();
      } catch (error) {
        // 4. Notifikasi Gagal
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat memperbarui data.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header Sederhana */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-2xl">
            <Clock size={24}/>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Pengaturan Jadwal Besuk</h1>
            <p className="text-slate-400 text-xs font-medium italic">Kelola hari dan jam layanan operasional</p>
          </div>
        </div>

        {/* Form Utama */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sesi Tahanan */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Sesi Tahanan</label>
              <input 
                className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:border-blue-500 transition-all" 
                placeholder="Contoh: Senin & Rabu"
                value={jadwal.tahanan_hari} 
                onChange={(e) => setJadwal({...jadwal, tahanan_hari: e.target.value})} 
              />
              <input 
                className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 font-mono text-xs outline-none focus:border-blue-500 transition-all" 
                placeholder="08:30 - 11:30"
                value={jadwal.tahanan_jam} 
                onChange={(e) => setJadwal({...jadwal, tahanan_jam: e.target.value})} 
              />
            </div>

            {/* Sesi Narapidana */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Sesi Narapidana</label>
              <input 
                className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:border-emerald-500 transition-all" 
                placeholder="Contoh: Selasa & Kamis"
                value={jadwal.napi_hari} 
                onChange={(e) => setJadwal({...jadwal, napi_hari: e.target.value})} 
              />
              <input 
                className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 font-mono text-xs outline-none focus:border-emerald-500 transition-all" 
                placeholder="08:30 - 11:30"
                value={jadwal.napi_jam} 
                onChange={(e) => setJadwal({...jadwal, napi_jam: e.target.value})} 
              />
            </div>
          </div>

          {/* Sesi Ramadhan / Khusus (Toggle) */}
          <div className={`p-6 rounded-[24px] border transition-all duration-300 ${jadwal.is_ramadhan_active ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star size={18} className={jadwal.is_ramadhan_active ? 'text-amber-600 fill-amber-600' : 'text-slate-400'} />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">Mode Jadwal Khusus</span>
              </div>
              <button 
                onClick={() => setJadwal({...jadwal, is_ramadhan_active: !jadwal.is_ramadhan_active})}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black transition-all ${jadwal.is_ramadhan_active ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-slate-200 text-slate-500'}`}
              >
                {jadwal.is_ramadhan_active ? <><Eye size={12}/> AKTIF</> : <><EyeOff size={12}/> NON-AKTIF</>}
              </button>
            </div>
            
            {jadwal.is_ramadhan_active && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                <input 
                  className="w-full bg-white px-4 py-3 rounded-xl border border-amber-100 font-bold text-sm outline-none focus:border-amber-400" 
                  placeholder="Hari (Contoh: Jumat - Minggu)" 
                  value={jadwal.ramadhan_ket} 
                  onChange={(e) => setJadwal({...jadwal, ramadhan_ket: e.target.value})} 
                />
                <input 
                  className="w-full bg-white px-4 py-3 rounded-xl border border-amber-100 font-mono text-xs outline-none focus:border-amber-400" 
                  placeholder="Jam (Contoh: 14:00 - 16:00)" 
                  value={jadwal.ramadhan_jam} 
                  onChange={(e) => setJadwal({...jadwal, ramadhan_jam: e.target.value})} 
                />
              </div>
            )}
          </div>

          {/* Catatan Tambahan */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catatan Tambahan Layanan</label>
            <textarea 
              className="w-full p-5 rounded-2xl border border-slate-200 text-sm h-24 resize-none outline-none focus:border-slate-900 transition-all bg-slate-50/30" 
              placeholder="Contoh: Hari Libur Nasional layanan ditiadakan..."
              value={jadwal.catatan} 
              onChange={(e) => setJadwal({...jadwal, catatan: e.target.value})} 
            />
          </div>

          {/* Tombol Simpan */}
          <button 
            disabled={loading}
            onClick={handleUpdateJadwal} 
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all text-xs tracking-[0.2em] uppercase shadow-xl shadow-slate-200 disabled:bg-slate-400 active:scale-[0.98]"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
            {loading ? "Memproses..." : "Simpan Perubahan Jadwal"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminAlurKunjungan;