import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { API_BASE_URL, getAuthHeader } from '../../utils/api';
import { FilePlus, Trash2, Search, Upload, FileText, Image as ImageIcon } from 'lucide-react';

const InformasiPublik = () => {
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('LAKIP');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'LAKIP',
    pdfFile: null,
    coverImage: null
  });

  const categories = ['LAKIP', 'DIPA', 'Rencana Strategis', 'Perjanjian Kerja'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/informasi`, getAuthHeader());
      setDocuments(res.data);
    } catch (err) {
      console.error("Gagal load data", err);
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Gagal',
        text: 'Tidak dapat mengambil data dari server.',
      });
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === 'cover') {
      setFormData({ ...formData, coverImage: file });
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, pdfFile: file });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Tampilkan loading saat proses upload
    Swal.fire({
      title: 'Mohon Tunggu',
      text: 'Sedang mengunggah dokumen...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('pdfFile', formData.pdfFile);
    data.append('coverImage', formData.coverImage);

    try {
      await axios.post(`${API_BASE_URL}/informasi`, data, {
        headers: {
          ...getAuthHeader().headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Dokumen publik berhasil disimpan ke database.',
        timer: 2000,
        showConfirmButton: false
      });

      fetchData();
      closeModal();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Simpan',
        text: 'Terjadi kesalahan saat mengunggah data.',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Dokumen yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a', // Slate 900
      cancelButtonColor: '#94a3b8', // Slate 400
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/informasi/${id}`, getAuthHeader());
        
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Data telah berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false
        });

        fetchData();
      } catch (err) { 
        Swal.fire('Gagal!', 'Tidak dapat menghapus data.', 'error');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', category: 'LAKIP', pdfFile: null, coverImage: null });
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black">Kelola Dokumen Publik</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex gap-2 font-bold uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all">
            <FilePlus size={18} /> Unggah Baru
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Cari dokumen..." className="pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-slate-200 outline-none transition-all" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Dokumen</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {documents.filter(d => d.kategori === activeTab && d.nama_dokumen.toLowerCase().includes(searchTerm.toLowerCase())).map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="p-3 bg-rose-50 text-rose-500 rounded-xl"><FileText size={20} /></div>
                    <div>
                      <p className="font-bold text-slate-700">{doc.nama_dokumen}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(doc.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Hapus Dokumen"><Trash2 size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {documents.filter(d => d.kategori === activeTab).length === 0 && (
            <div className="p-12 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <FileText size={32} />
              </div>
              <p className="text-slate-400 font-bold italic">Belum ada dokumen di kategori ini.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form onSubmit={handleUpload} className="bg-white w-full max-w-3xl rounded-[2.5rem] flex overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex-1 p-8 space-y-4">
              <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                <Upload size={24} className="text-blue-500" /> Input Dokumen Baru
              </h2>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Judul Dokumen</label>
                <input type="text" placeholder="Contoh: LAKIP Tahun 2023" className="w-full p-3 bg-slate-50 border rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-100 outline-none" onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Kategori Dokumen</label>
                <select className="w-full p-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none" onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">File PDF</label>
                <div className="border-2 border-dashed p-4 text-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer">
                    <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e, 'pdf')} required />
                    <FileText className="mx-auto text-slate-300 mb-2" size={24} />
                    <p className="text-[10px] font-bold text-slate-500">
                        {formData.pdfFile ? formData.pdfFile.name : "Klik atau seret file PDF disini"}
                    </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 p-3 font-bold text-slate-400 hover:text-slate-600 transition-colors">Batal</button>
                <button type="submit" className="flex-[2] bg-slate-900 text-white p-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-all">
                    Simpan ke Database
                </button>
              </div>
            </div>
            
            {/* SISI KANAN: COVER IMAGE UPLOAD (FIXED CLICK INDEX) */}
            <div className="w-64 bg-slate-50 p-8 flex flex-col items-center justify-center border-l border-slate-100">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Cover Dokumen</label>
              
              <div className="w-full aspect-[3/4] bg-white rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group hover:border-blue-400 transition-colors shadow-sm">
                
                {/* Input ditaruh paling depan menggunakan z-10 agar selalu peka terhadap klik */}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={e => handleFileChange(e, 'cover')} 
                  required 
                />
                
                {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                    <div className="text-center p-4">
                        <ImageIcon className="text-slate-200 mx-auto mb-2" size={40} />
                        <p className="text-[8px] font-bold text-slate-300 uppercase">Upload Image</p>
                    </div>
                )}
                
                {/* Efek Lapisan Overlay Gelap saat Kursor Mengambang */}
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-tighter text-center leading-relaxed">Klik kotak di atas untuk memilih cover dokumen (JPG/PNG)</p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InformasiPublik;