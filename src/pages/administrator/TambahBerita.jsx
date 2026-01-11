import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, Save, X, 
  Type, Tag, Calendar, FileText, AlertCircle, 
  CheckCircle2, FileEdit, Image as ImageIcon
} from 'lucide-react';

const TambahBerita = () => {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    tanggal: '',
    isi: '',
    status: 'Draft'
  });

  const kategoriList = [
    "Inovasi", "Pembinaan", "Kemandirian", "Kolaborasi", 
    "Keamanan", "Pelayanan", "Ketahanan Pangan", 
    "Kegiatan Pimpinan", "Informasi Publik"
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all mb-2"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[2px]">Kembali ke List</span>
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Buat Artikel Baru</h1>
        </div>

        {/* Status Switcher - Visual Minimalis & Elegan */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center w-full md:w-fit border border-slate-200 shadow-inner">
          <button
            onClick={() => setFormData({...formData, status: 'Draft'})}
            className={`flex-1 md:w-32 py-2.5 rounded-xl text-[10px] font-black tracking-wider transition-all flex items-center justify-center gap-2 ${
              formData.status === 'Draft' 
              ? 'bg-white text-amber-500 shadow-sm border border-slate-100' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileEdit size={14} /> DRAFT
          </button>
          <button
            onClick={() => setFormData({...formData, status: 'Published'})}
            className={`flex-1 md:w-32 py-2.5 rounded-xl text-[10px] font-black tracking-wider transition-all flex items-center justify-center gap-2 ${
              formData.status === 'Published' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CheckCircle2 size={14} /> PUBLISH
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM KIRI: Form Input Utama (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Judul Artikel</label>
              <input 
                type="text" 
                placeholder="Masukkan judul berita yang menarik..." 
                className="w-full px-0 py-3 text-xl font-bold border-b-2 border-slate-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Konten Lengkap</label>
              <textarea 
                rows="15" 
                placeholder="Mulai menulis cerita Anda di sini..." 
                className="w-full p-6 bg-slate-50 border border-slate-100 focus:border-blue-200 focus:bg-white rounded-[24px] outline-none transition-all font-medium text-slate-700 leading-relaxed whitespace-pre-wrap shadow-inner"
              ></textarea>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Pengaturan & Upload (1/3) */}
        <div className="space-y-6">
          {/* Card Upload Gambar */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 block">Foto Utama</label>
            
            {previewUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-100 shadow-md">
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => setPreviewUrl(null)} className="p-2 bg-red-500 text-white rounded-xl shadow-lg">
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-100 rounded-[24px] cursor-pointer hover:bg-slate-50 hover:border-blue-200 transition-all">
                <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl mb-2">
                  <ImageIcon size={24} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pilih File Foto</span>
                <input type="file" className="hidden" onChange={(e) => setPreviewUrl(URL.createObjectURL(e.target.files[0]))} />
              </label>
            )}
            
            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
              <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-amber-700 leading-tight">
                Maksimal ukuran file <span className="font-bold">2MB</span>. Gunakan format JPG/PNG/WEBP.
              </p>
            </div>
          </div>

          {/* Card Pengaturan (Kategori & Tanggal) */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Kategori</label>
              <select className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-600 appearance-none shadow-sm">
                <option value="">Pilih Kategori...</option>
                {kategoriList.map((kat, i) => <option key={i} value={kat}>{kat}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Tanggal Publikasi</label>
              <input type="date" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-600 shadow-sm" />
            </div>

            <hr className="border-slate-50" />

            <button className="w-full py-4 bg-slate-800 hover:bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-[3px] shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3">
              <Save size={18} /> Simpan Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahBerita;