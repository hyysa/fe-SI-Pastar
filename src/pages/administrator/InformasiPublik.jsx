import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
      alert("Berhasil disimpan!");
      fetchData();
      closeModal();
    } catch (err) {
      alert("Gagal menyimpan data ke database");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus data ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/informasi/${id}`, getAuthHeader());
        fetchData();
      } catch (err) { alert("Gagal hapus"); }
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
                    <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 rounded-full text-xs font-bold ${activeTab === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {cat}
                    </button>
                ))}
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Cari..." className="pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-sm" onChange={(e) => setSearchTerm(e.target.value)} />
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
                <tr key={doc.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-500 rounded-xl"><FileText size={20} /></div>
                    <div>
                      <p className="font-bold text-slate-700">{doc.nama_dokumen}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(doc.created_at).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(doc.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {documents.length === 0 && <div className="p-10 text-center text-slate-400 font-bold italic">Data tidak ditemukan di database.</div>}
        </div>
      </div>

      {/* Modal Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form onSubmit={handleUpload} className="bg-white w-full max-w-3xl rounded-[2.5rem] flex overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="flex-1 p-8 space-y-4">
              <h2 className="text-xl font-black mb-4">Input Dokumen Baru</h2>
              <input type="text" placeholder="Judul Dokumen" className="w-full p-3 bg-slate-50 border rounded-xl font-bold text-sm" onChange={e => setFormData({...formData, name: e.target.value})} required />
              <select className="w-full p-3 bg-slate-50 border rounded-xl font-bold text-sm" onChange={e => setFormData({...formData, category: e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="border-2 border-dashed p-4 text-center rounded-xl bg-slate-50">
                <input type="file" accept=".pdf" onChange={e => handleFileChange(e, 'pdf')} required />
                <p className="text-[10px] font-bold text-slate-400 mt-2">Pilih File PDF Dokumen</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={closeModal} className="flex-1 p-3 font-bold text-slate-400">Batal</button>
                <button type="submit" className="flex-[2] bg-slate-900 text-white p-3 rounded-xl font-black text-xs uppercase tracking-widest">Simpan ke Database</button>
              </div>
            </div>
            <div className="w-64 bg-slate-100 p-8 flex flex-col items-center justify-center border-l">
              <div className="w-full aspect-[3/4] bg-white rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative group">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon className="text-slate-300" size={40} />}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e, 'cover')} required />
              </div>
              <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-tighter text-center">Klik Kotak Diatas Untuk Upload Cover</p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InformasiPublik;