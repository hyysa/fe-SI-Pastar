import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Save, X, CheckCircle2, 
  FileEdit, Image as ImageIcon, Loader2 
} from 'lucide-react';

const TambahBerita = () => {
  const navigate = useNavigate();
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    tanggal: new Date().toISOString().split('T')[0],
    isi: '',
    status: 'Draft'
  });

  const kategoriList = [
    "Inovasi", "Pembinaan", "Kemandirian", "Kolaborasi", 
    "Keamanan", "Pelayanan", "Ketahanan Pangan", 
    "Kegiatan Pimpinan", "Informasi Publik"
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Sesi berakhir, silakan login kembali.");
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File terlalu besar! Maksimal 2MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return alert("Sesi login tidak ditemukan!");
    if (!selectedFile) return alert("Silakan unggah foto utama!");
    if (!formData.kategori) return alert("Silakan pilih kategori!");

    setLoading(true);

    try {
      // Pastikan VITE_API_URL di .env adalah http://msi.local:5000/api (tanpa / di akhir)
      const apiUrl = `${import.meta.env.VITE_API_URL}/berita`;

      const data = new FormData();
      // Menambahkan data teks
      data.append('judul', formData.judul);
      data.append('kategori', formData.kategori);
      data.append('tanggal', formData.tanggal);
      data.append('isi', formData.isi);
      data.append('status', formData.status);
      data.append('penulis', 'Humas Lapas Blitar'); 
      
      // Menambahkan data file (PENTING: Nama field 'gambar' harus sesuai dengan backend)
      data.append('gambar', selectedFile);

      // PENGIRIMAN DATA
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Authorization': `Bearer ${token}`
          // CATATAN: Content-Type TIDAK BOLEH ditulis manual di sini
        }
      });

      if (response.status === 201 || response.status === 200) {
        alert("Berita Berhasil Disimpan!");
        navigate('/admin/berita');
      }
    } catch (error) {
      console.error("Detail Kesalahan:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        alert("Sesi tidak sah. Silakan login kembali.");
        navigate('/login');
      } else {
        // Menampilkan pesan error spesifik dari backend jika ada
        const pesanServer = error.response?.data?.message || "Terjadi kesalahan pada server (Error 400/500)";
        alert(`Gagal: ${pesanServer}`);
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <form onSubmit={handleSubmit} className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <button 
              type="button"
              onClick={() => navigate(-1)} 
              className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all mb-4"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-[2px]">Kembali</span>
            </button>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">ENTRI <span className="text-blue-600">BERITA</span></h1>
          </div>

          <div className="bg-white p-1.5 rounded-[20px] flex items-center border border-slate-200 shadow-sm w-fit">
            <button
              type="button"
              onClick={() => setFormData({...formData, status: 'Draft'})}
              className={`px-8 py-3 rounded-[15px] text-[11px] font-black tracking-wider transition-all flex items-center gap-2 ${
                formData.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <FileEdit size={16} /> DRAFT
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, status: 'Published'})}
              className={`px-8 py-3 rounded-[15px] text-[11px] font-black tracking-wider transition-all flex items-center gap-2 ${
                formData.status === 'Published' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 size={16} /> PUBLISH
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm space-y-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Judul Utama</label>
                <input 
                  name="judul"
                  type="text" 
                  required
                  value={formData.judul}
                  onChange={handleInputChange}
                  placeholder="Ketik judul berita..." 
                  className="w-full px-0 py-4 text-3xl font-bold border-b-2 border-slate-50 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Isi Artikel</label>
                <textarea 
                  name="isi"
                  required
                  rows="12" 
                  value={formData.isi}
                  onChange={handleInputChange}
                  placeholder="Tulis konten lengkap..." 
                  className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[32px] outline-none font-medium text-slate-700 leading-relaxed focus:bg-white transition-all"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[3px] mb-6 block ml-1">Thumbnail</label>
              {previewUrl ? (
                <div className="relative group rounded-[30px] overflow-hidden border border-slate-200 shadow-md">
                  <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => { setPreviewUrl(null); setSelectedFile(null); }} 
                      className="p-4 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-[35px] cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group">
                  <div className="p-5 bg-blue-50 text-blue-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <ImageIcon size={32} />
                  </div>
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Klik Upload Foto</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Kategori</label>
                <select 
                  name="kategori" required value={formData.kategori} onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriList.map((kat, i) => <option key={i} value={kat}>{kat}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Tanggal</label>
                <input 
                  name="tanggal" type="date" required value={formData.tanggal} onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none focus:bg-white transition-all" 
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-6 text-white rounded-[25px] font-black text-[12px] uppercase tracking-[4px] transition-all flex items-center justify-center gap-4 shadow-xl ${
                  loading 
                    ? 'bg-slate-300 cursor-wait' 
                    : 'bg-slate-900 hover:bg-blue-600 active:scale-95'
                }`}
              >
                {loading ? <Loader2 size={22} className="animate-spin" /> : <Save size={22} />}
                {loading ? 'Sabar ya...' : 'Simpan Berita'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TambahBerita;