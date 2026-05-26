import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { API_BASE_URL, IMG_BASE_URL } from '../../utils/api';
import { 
  Save, Plus, Trash2, MoveUp, MoveDown, 
  Image as ImageIcon, AlertCircle, Bold, List, ListOrdered, Type 
} from 'lucide-react';

const AdminIntegrasi = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({ deskripsi_singkat: '', konten_teks: '', syarat_khusus: '' });
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const editorRef = useRef(null);
  const INTEGRASI_IMG_URL = IMG_BASE_URL;

  useEffect(() => { 
    fetchData(); 
  }, []);

  useEffect(() => {
    if (editorRef.current && content.konten_teks && editorRef.current.innerHTML !== content.konten_teks) {
      editorRef.current.innerHTML = content.konten_teks;
    }
  }, [content.konten_teks]);

  const fetchData = async () => {
    try {
      const resC = await axios.get(`${API_BASE_URL}/integrasi`);
      const resP = await axios.get(`${API_BASE_URL}/integrasi/galeri`);
      
      if(resC.data) setContent(resC.data.data || resC.data);
      if(resP.data) setPhotos((resP.data.data || resP.data).sort((a,b) => a.urutan - b.urutan));
    } catch (err) {
      console.error("Gagal memuat data");
    }
  };

  const execCommand = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
    setContent(prev => ({ ...prev, konten_teks: editorRef.current.innerHTML }));
  };

  // 1. DETAIL GAMBAR MENGGUNAKAN POPUP SWEETALERT2
  const handleViewDetailImage = (imageUrl, title = 'Pratinjau Gambar') => {
    Swal.fire({
      title: title,
      imageUrl: imageUrl,
      imageAlt: 'Infografis Integrasi',
      showCloseButton: true,
      showConfirmButton: false,
      background: '#fff',
      customClass: {
        popup: 'rounded-3xl shadow-2xl',
        image: 'max-h-[70vh] object-contain rounded-xl shadow-inner'
      }
    });
  };

  // 2. SIMPAN DATA TEKS DENGAN SWEETALERT2
  const handleSaveText = async () => {
    setLoading(true);
    try {
      const finalData = { ...content, konten_teks: editorRef.current.innerHTML };
      await axios.put(`${API_BASE_URL}/integrasi`, finalData);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data teks persyaratan berhasil diperbarui.',
        confirmButtonColor: '#0f172a',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menyimpan perubahan teks.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. UPLOAD GAMBAR DENGAN SWEETALERT2 LOADER
  const handleUpload = async () => {
    if(!selectedFile) return;
    const formData = new FormData();
    formData.append('gambar', selectedFile);
    formData.append('urutan', photos.length + 1);

    // Menampilkan loading state SweetAlert
    Swal.fire({
      title: 'Mengunggah gambar...',
      didOpen: () => { Swal.showLoading(); },
      allowOutsideClick: false
    });

    try {
      await axios.post(`${API_BASE_URL}/integrasi/galeri`, formData);
      setSelectedFile(null); 
      setPreview(null);
      fetchData();

      Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Gambar infografis berhasil ditambahkan.',
        confirmButtonColor: '#059669',
        timer: 2000
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Unggah',
        text: 'Pastikan file berupa format gambar valid.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleMove = async (index, dir) => {
    let newPhotos = [...photos];
    let to = dir === 'up' ? index - 1 : index + 1;
    if(to < 0 || to >= newPhotos.length) return;
    [newPhotos[index], newPhotos[to]] = [newPhotos[to], newPhotos[index]];
    
    setPhotos(newPhotos);
    try {
      await axios.put(`${API_BASE_URL}/integrasi/galeri/reorder`, { photos: newPhotos });
    } catch (err) {
      console.error("Gagal ubah urutan");
      fetchData();
    }
  };

  // 4. HAPUS GAMBAR DENGAN KONFIRMASI SWEETALERT2
  const handleDeleteImage = async (id, fileName) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Gambar yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/integrasi/galeri/${id}`);
          fetchData();
          
          Swal.fire({
            title: 'Terhapus!',
            text: 'Gambar berhasil dihapus.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            title: 'Gagal!',
            text: 'Gagal menghapus gambar dari server.',
            icon: 'error',
            confirmButtonColor: '#ef4444'
          });
        }
      }
    });
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Manajemen Integrasi</h1>
          <p className="text-slate-500">Kelola informasi persyaratan tanpa ribet koding.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM EDITOR TEKS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Type size={20} className="text-blue-600"/> Teks Persyaratan
              </h2> 

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Deskripsi Singkat</label>
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    rows="2"
                    value={content.deskripsi_singkat || ''}
                    onChange={e => setContent({...content, deskripsi_singkat: e.target.value})}
                  />
                </div>

                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <label className="text-amber-900 font-bold text-sm flex items-center gap-2 mb-3">
                    <AlertCircle size={18}/> Syarat Khusus (Opsional)
                  </label>
                  <textarea 
                    placeholder="Contoh: Khusus warga Surabaya wajib melampirkan..."
                    className="w-full p-4 border border-amber-200 rounded-xl text-sm outline-none focus:bg-white"
                    rows="2"
                    value={content.syarat_khusus || ''}
                    onChange={e => setContent({...content, syarat_khusus: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Rincian Detail</label>
                  <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-inner">
                    <div className="flex gap-1 p-2 bg-slate-100 border-b border-slate-200">
                      <button onClick={() => execCommand('bold')} className="p-2 hover:bg-white rounded-lg transition-all" title="Tebalkan"><Bold size={18}/></button>
                      <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white rounded-lg transition-all" title="List Poin"><List size={18}/></button>
                      <button onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-white rounded-lg transition-all" title="List Angka"><ListOrdered size={18}/></button>
                    </div>
                    <div
                      ref={editorRef}
                      contentEditable={true}
                      onInput={(e) => setContent({ ...content, konten_teks: e.target.innerHTML })}
                      className="p-5 min-h-[300px] bg-white outline-none prose prose-slate max-w-none"
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 italic">Blok teks lalu tekan tombol toolbar untuk memformat.</p>
                </div>

                <button 
                  onClick={handleSaveText}
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:bg-slate-400"
                >
                  <Save size={18}/> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>

            {/* URUTAN GAMBAR */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="font-bold mb-6 flex items-center gap-2"><ImageIcon className="text-orange-500" size={20}/> Urutan Infografis</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photos.map((p, i) => (
                  <div key={p.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-4">
                    {/* Klik Gambar di list untuk view detail popup */}
                    <img 
                      src={`${INTEGRASI_IMG_URL}${p.gambar}`} 
                      className="w-16 h-16 object-cover rounded-xl border border-white shadow-sm cursor-zoom-in hover:scale-105 transition-all" 
                      alt="Syarat"
                      title="Klik untuk memperbesar"
                      onClick={() => handleViewDetailImage(`${INTEGRASI_IMG_URL}${p.gambar}`, `Posisi Gambar ${i+1}`)}
                    />
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">Posisi {i+1}</p>
                      <div className="flex gap-1">
                        <button onClick={() => handleMove(i, 'up')} className="p-2 bg-white border rounded-lg hover:text-blue-600"><MoveUp size={14}/></button>
                        <button onClick={() => handleMove(i, 'down')} className="p-2 bg-white border rounded-lg hover:text-blue-600"><MoveDown size={14}/></button>
                        <button onClick={() => handleDeleteImage(p.id, p.gambar)} className="p-2 bg-red-50 text-red-600 border border-red-100 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM UPLOAD & PREVIEW */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-8">
              <h2 className="font-bold mb-6 flex items-center gap-2"><Plus className="text-emerald-500" size={20}/> Tambah Foto</h2>
              <div 
                className="border-2 border-dashed border-slate-200 p-6 rounded-3xl text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                onClick={() => document.getElementById('f').click()}
              >
                {preview ? (
                  <div className="relative group">
                    <img src={preview} className="max-h-48 mx-auto rounded-xl shadow-md cursor-zoom-in" alt="Preview" title="Klik untuk memperbesar detail preview" onClick={(e) => { e.stopPropagation(); handleViewDetailImage(preview, 'Pratinjau Unggahan Baru'); }} />
                    <p className="text-[10px] text-emerald-600 mt-2 font-medium">Klik gambar untuk melihat detail rincian</p>
                  </div>
                ) : (
                  <div className="py-10 text-slate-400">
                    <ImageIcon className="mx-auto mb-2 opacity-20" size={48} />
                    <p className="text-sm font-medium">Klik untuk upload gambar</p>
                  </div>
                )}
                <input id="f" type="file" className="hidden" accept="image/*" onChange={e => { if(e.target.files[0]) { setPreview(URL.createObjectURL(e.target.files[0])); setSelectedFile(e.target.files[0]); } }} />
              </div>
              <button 
                onClick={handleUpload}
                disabled={!selectedFile}
                className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 disabled:bg-slate-200 disabled:shadow-none active:scale-95 transition-all"
              >
                Unggah Sekarang
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminIntegrasi;