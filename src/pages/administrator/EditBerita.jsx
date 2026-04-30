import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Save, CheckCircle2, 
  FileEdit, Image as ImageIcon, Loader2, AlertCircle
} from 'lucide-react';

// --- IMPORT DARI UTILS API ---
import { API_BASE_URL, IMG_BASE_URL } from '../../utils/api';

const EditBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    tanggal: '',
    isi: '',
    status: 'Draft'
  });

  const token = localStorage.getItem('token');

  const kategoriList = [
    "Inovasi", "Pembinaan", "Kemandirian", "Kolaborasi", 
    "Keamanan", "Pelayanan", "Ketahanan Pangan", 
    "Kegiatan Pimpinan", "Informasi Publik"
  ];

  // 1. Ambil Data Lama Saat Halaman Dimuat
  useEffect(() => {
    const getDetailBerita = async () => {
      try {
        setFetching(true);
        const response = await axios.get(`${API_BASE_URL}/berita/${id}`);
        const data = response.data.data || response.data;
        
        setFormData({
          judul: data.judul || '',
          kategori: data.kategori || kategoriList[0],
          tanggal: data.tanggal ? data.tanggal.split('T')[0] : '',
          isi: data.isi || '',
          status: data.status || 'Draft'
        });

        // Set preview gambar lama menggunakan IMG_BASE_URL
        if (data.gambar) {
          setPreviewUrl(`${IMG_BASE_URL}${data.gambar}`);
        }
      } catch (err) {
        console.error("Gagal mengambil data berita:", err);
        setError("Gagal memuat data berita dari server.");
      } finally {
        setFetching(false);
      }
    };
    if (id) getDetailBerita();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Maksimal ukuran file 2MB!");
      setSelectedFile(file);
      // Buat preview URL untuk file baru yang dipilih
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 2. Fungsi Kirim Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('kategori', formData.kategori);
      data.append('tanggal', formData.tanggal || new Date().toISOString().split('T')[0]);
      data.append('isi', formData.isi);
      data.append('status', formData.status);
      
      // Hanya tambahkan gambar ke FormData jika user memilih file baru
      if (selectedFile) {
        data.append('gambar', selectedFile);
      }

      await axios.put(`${API_BASE_URL}/berita/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert("Berita Berhasil Diperbarui!");
      navigate('/admin/berita');
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Gagal memperbarui berita.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-slate-800 mb-4" size={48} />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Sinkronisasi Data...</p>
    </div>
  );

  if (error) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 p-6">
       <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 text-center max-w-sm">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-slate-600 font-bold mb-6">{error}</p>
          <button onClick={() => navigate('/admin/berita')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Kembali</button>
       </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <form onSubmit={handleSubmit} className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <button type="button" onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-4">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[12px] font-black uppercase tracking-[3px]">Batal & Kembali</span>
            </button>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Edit Artikel</h1>
          </div>

          {/* Status Switcher */}
          <div className="bg-white p-1.5 rounded-[20px] flex items-center border border-slate-200 shadow-sm w-fit">
            <button
              type="button"
              onClick={() => setFormData({...formData, status: 'Draft'})}
              className={`px-8 py-3 rounded-[15px] text-[11px] font-black transition-all flex items-center ${formData.status === 'Draft' ? 'bg-amber-50 text-amber-600' : 'text-slate-400'}`}
            >
              <FileEdit size={16} className="mr-2" /> DRAFT
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, status: 'Published'})}
              className={`px-8 py-3 rounded-[15px] text-[11px] font-black transition-all flex items-center ${formData.status === 'Published' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              <CheckCircle2 size={16} className="mr-2" /> PUBLISH
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Kiri (Konten) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-sm space-y-10">
              <div className="space-y-3">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-[3px]">Judul Berita</label>
                <input 
                  name="judul" type="text" required value={formData.judul} onChange={handleInputChange}
                  placeholder="Masukkan judul berita..."
                  className="w-full px-0 py-4 text-3xl font-bold border-b-2 border-slate-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-200"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-[3px]">Konten Artikel</label>
                <textarea 
                  name="isi" required rows="15" value={formData.isi} onChange={handleInputChange}
                  placeholder="Tulis isi berita di sini..."
                  className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[32px] outline-none font-medium leading-relaxed focus:bg-white focus:border-blue-200 transition-all"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Sidebar Kanan (Metadata & Media) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Upload Gambar */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm">
              <label className="text-[12px] font-black text-slate-400 uppercase tracking-[3px] mb-6 block">Gambar Utama</label>
              <div className="relative group rounded-[30px] overflow-hidden border border-slate-100 bg-slate-50 aspect-video flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={48} className="text-slate-200" />
                )}
                <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white font-bold">
                  <ImageIcon className="mb-2" /> 
                  <span className="text-[10px] uppercase tracking-widest">Ganti Gambar</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center italic">Format: JPG, PNG, WEBP (Maks. 2MB)</p>
            </div>

            {/* Kategori & Simpan */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm space-y-8">
              <div className="space-y-3">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-[3px]">Kategori Berita</label>
                <select 
                  name="kategori" required value={formData.kategori} onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  {kategoriList.map((kat, i) => <option key={i} value={kat}>{kat}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-[3px]">Tanggal Publikasi</label>
                <input 
                  type="date" name="tanggal" value={formData.tanggal} onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none"
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className={`w-full py-6 text-white rounded-[25px] font-black text-[12px] uppercase tracking-[4px] transition-all flex items-center justify-center gap-4 shadow-lg ${loading ? 'bg-slate-300' : 'bg-slate-900 hover:bg-blue-600 hover:-translate-y-1 active:scale-95'}`}
              >
                {loading ? <Loader2 size={22} className="animate-spin" /> : <Save size={22} />}
                {loading ? 'Menyimpan...' : 'Update Berita'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBerita;