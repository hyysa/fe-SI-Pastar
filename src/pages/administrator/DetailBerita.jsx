import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Calendar, Tag, User, 
  ChevronRight, Globe, FileText, Loader2, AlertCircle 
} from 'lucide-react';

// --- IMPORT DARI UTILS API ---
import { API_BASE_URL, IMG_BASE_URL } from '../../utils/api';

const DetailBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetailBerita = async () => {
      try {
        setLoading(true);
        setError(null);

        // Menggunakan API_BASE_URL dari utils
        const response = await axios.get(`${API_BASE_URL}/berita/${id}`);
        
        const dataFound = response.data.data || response.data;
        
        if (dataFound) {
          setBerita(dataFound);
        } else {
          setError("Data berita tidak ditemukan di database.");
        }
      } catch (err) {
        console.error("Gagal mengambil detail berita:", err);
        if (err.response?.status === 404) {
          setError(`Error 404: Berita dengan ID ${id} tidak ditemukan.`);
        } else {
          setError(err.message || "Terjadi kesalahan saat menghubungi server.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetailBerita();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-slate-800 mb-4" size={40} />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Memuat Konten...</p>
      </div>
    );
  }

  if (error || !berita) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 max-w-md w-full">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-black text-slate-800 mb-2">Oops! Ada Masalah</h2>
          <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed italic">{error}</p>
          <button 
            onClick={() => navigate('/admin/berita')}
            className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ArrowLeft size={14} /> Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button 
            onClick={() => navigate('/admin/berita')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
          
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
            <span>Admin</span>
            <ChevronRight size={10} />
            <span>Berita</span>
            <ChevronRight size={10} />
            <span className="text-slate-900">Detail Konten</span>
          </div>
        </div>

        {/* Card Utama */}
        <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Gambar Header menggunakan IMG_BASE_URL */}
          <div className="relative h-[280px] md:h-[500px] w-full bg-slate-50">
            <img 
              src={`${IMG_BASE_URL}${berita.gambar}`} 
              alt={berita.judul}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/1200x600?text=Gambar+Tidak+Tersedia';
              }}
            />
            <div className="absolute top-6 left-6">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[2px] shadow-xl ${
                berita.status === 'Published' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {berita.status}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-16 space-y-10">
            {/* Meta Informasi */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tight">
                  <Tag size={12} className="text-slate-400" /> {berita.kategori}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                  <Calendar size={12} /> {new Date(berita.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-[1.1] tracking-tighter">
                {berita.judul}
              </h1>

              <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-100">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-[2px] mb-1">Diterbitkan Oleh</p>
                  <p className="text-sm font-bold text-slate-800 tracking-tight">{berita.penulis || 'Humas Lapas'}</p>
                </div>
              </div>
            </div>

            {/* Isi Konten */}
            <div className="prose prose-slate max-w-none">
              <div 
                className="text-slate-600 leading-[1.8] text-base md:text-lg whitespace-pre-line font-medium"
                dangerouslySetInnerHTML={{ __html: berita.isi }} 
              />
            </div>

            {/* Tombol Aksi Bawah */}
            <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate(`/admin/berita/edit/${id}`)}
                className="flex-1 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <FileText size={18} /> Edit Konten Berita
              </button>
              <button 
                onClick={() => window.open(`/berita/${id}`, '_blank')}
                className="flex-1 bg-white text-slate-500 border border-slate-200 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
              >
                <Globe size={18} /> Lihat di Website
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default DetailBerita;