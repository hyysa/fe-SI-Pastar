import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, IMG_BASE_URL } from '../../utils/api';
import { FiEdit, FiTrash2, FiPlus, FiX, FiImage } from 'react-icons/fi';
import Swal from 'sweetalert2';

const AdminSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Manipulasi URL secara dinamis tanpa mengubah file api.js
  const SLIDER_IMG_URL = IMG_BASE_URL.replace('berita', 'slider');

  const [formData, setFormData] = useState({
    judul: '',
    highlight: '',
    deskripsi: '',
    urutan: 1,
    status: 'Published',
    gambar: null
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/slider`);
      const result = res.data.data || res.data;
      setSliders(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Gagal ambil data slider", err);
      Swal.fire('Error', 'Gagal memuat data slider', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return Swal.fire('Error', 'File harus berupa gambar!', 'error');
      }
      setFormData({ ...formData, gambar: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId && !formData.gambar) {
      return Swal.fire('Peringatan', 'Silakan unggah gambar slider!', 'warning');
    }

    const data = new FormData();
    data.append('judul', formData.judul);
    data.append('highlight', formData.highlight);
    data.append('deskripsi', formData.deskripsi);
    data.append('urutan', formData.urutan);
    data.append('status', formData.status);
    if (formData.gambar) data.append('gambar', formData.gambar);

    try {
      Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      if (editId) {
        await axios.put(`${API_BASE_URL}/slider/${editId}`, data);
      } else {
        await axios.post(`${API_BASE_URL}/slider`, data);
      }
      Swal.fire('Berhasil!', 'Data slider telah disimpan.', 'success');
      closeModal();
      fetchSliders();
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Slider?',
      text: "Gambar yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/slider/${id}`);
        fetchSliders();
        Swal.fire('Terhapus!', 'Slider berhasil dihapus.', 'success');
      } catch (err) {
        Swal.fire('Gagal!', 'Gagal menghapus data.', 'error');
      }
    }
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setFormData({
      judul: item.judul || '',
      highlight: item.highlight || '',
      deskripsi: item.deskripsi || '',
      urutan: item.urutan || 1,
      status: item.status || 'Published',
      gambar: null 
    });
    // Menggunakan URL manipulasi untuk preview dari server
    setPreviewUrl(`${SLIDER_IMG_URL}${item.gambar}`); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setPreviewUrl(null);
    setFormData({ judul: '', highlight: '', deskripsi: '', urutan: 1, status: 'Published', gambar: null });
  };

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23cccccc%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2224%22%20fill%3D%22%23333333%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EGambar%20Tidak%20Ditemukan%3C%2Ftext%3E%3C%2Fsvg%3E`;
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Hero Slider</h1>
            <p className="text-sm text-slate-500">Kelola gambar utama di halaman depan website.</p>
          </div>
          <button 
            onClick={() => { closeModal(); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <FiPlus /> Tambah Slide
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-bold uppercase text-slate-500">Gambar</th>
                    <th className="p-4 text-xs font-bold uppercase text-slate-500">Informasi Konten</th>
                    <th className="p-4 text-xs font-bold uppercase text-slate-500 text-center">Urutan</th>
                    <th className="p-4 text-xs font-bold uppercase text-slate-500 text-center">Status</th>
                    <th className="p-4 text-xs font-bold uppercase text-slate-500 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sliders.length > 0 ? sliders.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <img 
                          src={`${SLIDER_IMG_URL}${s.gambar}`} 
                          alt="preview" 
                          className="w-24 h-14 object-cover rounded-lg border shadow-sm" 
                          onError={handleImageError}
                        />
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800 leading-tight">{s.judul}</p>
                        <p className="text-xs text-amber-600 font-medium italic mt-1">{s.highlight}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{s.deskripsi}</p>
                      </td>
                      <td className="p-4 text-center font-semibold text-slate-600">{s.urutan}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${s.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => openEditModal(s)} title="Edit" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><FiEdit size={18} /></button>
                          <button onClick={() => handleDelete(s.id)} title="Hapus" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-400 italic">Belum ada data slider.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-slate-800">{editId ? 'Perbarui Slider' : 'Tambah Slider Baru'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-white rounded-full shadow-sm transition-all"><FiX size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="relative group mx-auto w-full h-40 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" onError={handleImageError} />
                ) : (
                  <div className="text-center">
                    <FiImage className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-xs text-gray-400">Pratinjau Gambar</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-lg text-xs font-bold shadow-lg">
                     {editId ? 'Ganti Gambar' : 'Pilih Gambar'}
                     <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                   </label>
                </div>
              </div>

              {/* ... Grid Inputs tetap sama ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Judul Utama</label>
                  <input 
                    type="text" required value={formData.judul}
                    onChange={(e) => setFormData({...formData, judul: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Highlight</label>
                  <input 
                    type="text" required value={formData.highlight}
                    onChange={(e) => setFormData({...formData, highlight: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Urutan</label>
                  <input 
                    type="number" min="1" value={formData.urutan}
                    onChange={(e) => setFormData({...formData, urutan: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Status</label>
                  <div className="flex gap-4">
                    {['Published', 'Draft'].map((st) => (
                      <label key={st} className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${formData.status === st ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200' : 'bg-white border-gray-100 text-slate-400'}`}>
                        <input type="radio" className="hidden" name="status" value={st} checked={formData.status === st} onChange={(e) => setFormData({...formData, status: e.target.value})} />
                        <span className="text-xs font-bold">{st}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Deskripsi</label>
                  <textarea value={formData.deskripsi} rows="2" onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-600 transition-all">
                  {editId ? 'Simpan Perubahan' : 'Posting Slide Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSlider;