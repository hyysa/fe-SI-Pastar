import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL, getAuthHeader } from '../../utils/api'; 
import { 
  Trash2, Download, Plus, Folder, 
  ArrowLeft, X, Calendar, SortAsc, 
  SortDesc, Image as ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';

const GaleriKegiatan = () => {
  // --- State Management ---
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null); 
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // --- Filter State ---
  const [sortOrder, setSortOrder] = useState('desc'); 
  const [searchDate, setSearchDate] = useState(''); 

  // --- Upload State ---
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);

  const IMAGE_HOST = API_BASE_URL.replace('/api', ''); 

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/galeri`);
      setImages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleDownload = async (url) => {
    try {
      const response = await fetch(`${IMAGE_HOST}${url}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split('/').pop(); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      Swal.fire('Error', 'Gagal download', 'error');
    }
  };

  // --- Logika Filter Tanggal & Grouping ---
  const groupedData = useMemo(() => {
    const groups = {};
    
    const filtered = images.filter(img => {
      if (!searchDate) return true;
      const imgDate = new Date(img.createdAt).toISOString().split('T')[0];
      return imgDate === searchDate;
    });

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    sorted.forEach(img => {
      const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(img.createdAt));
      if (!groups[monthName]) groups[monthName] = [];
      groups[monthName].push(img);
    });

    return groups;
  }, [images, sortOrder, searchDate]);

  const handleConfirmUpload = async () => {
    if (!selectedFile) return Swal.fire('Opps', 'Pilih gambar dulu', 'warning');
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('createdAt', eventDate);

    try {
      setUploading(true);
      await axios.post(`${API_BASE_URL}/galeri/upload`, formData, {
        ...getAuthHeader(),
        headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' }
      });
      await fetchImages();
      setUploading(false);
      setIsModalOpen(false);
      setPreviewUrl(null);
      setSelectedFile(null);
      Swal.fire({ icon: 'success', title: 'Berhasil', timer: 1000, showConfirmButton: false });
    } catch (error) {
      setUploading(false);
      Swal.fire('Error', 'Gagal upload', 'error');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Hapus foto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/galeri/${id}`, getAuthHeader());
        await fetchImages();
        Swal.fire('Terhapus', '', 'success');
      } catch (error) {
        Swal.fire('Gagal', 'Gagal hapus', 'error');
      }
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50/50">
      {/* HEADER & FILTER TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center gap-4">
          {selectedFolder && (
            <button onClick={() => setSelectedFolder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-gray-800 italic uppercase">
              {selectedFolder ? selectedFolder : 'Galeri Kegiatan'}
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase italic">SI-PASTAR DOKUMENTASI</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filter Tanggal */}
          <div className="relative flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
            <Calendar className="text-gray-400" size={16} />
            <span className="text-[10px] font-black text-gray-400 uppercase italic">Cari Tgl:</span>
            <input 
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="bg-transparent text-xs font-bold focus:outline-none text-gray-700"
            />
            {searchDate && (
              <button onClick={() => setSearchDate('')} className="text-red-400">
                <X size={14} />
              </button>
            )}
          </div>

          <button 
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase text-gray-600 hover:bg-gray-100 transition-all"
          >
            {sortOrder === 'desc' ? <SortDesc size={16}/> : <SortAsc size={16}/>}
            {sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}
          </button>

          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg transition-all active:scale-95">
            <Plus size={18} /> Unggah
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      {loading ? (
        <div className="p-20 text-center font-black text-gray-300 uppercase italic animate-pulse">Memuat Dokumentasi...</div>
      ) : (
        <>
          {Object.keys(groupedData).length === 0 ? (
            <div className="p-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 animate-in fade-in">
                <ImageIcon className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="font-black text-gray-300 uppercase italic">Tidak ada foto ditemukan</p>
                {searchDate && (
                  <button onClick={() => setSearchDate('')} className="mt-4 text-blue-500 text-xs font-bold underline italic uppercase">Lihat Semua Foto</button>
                )}
            </div>
          ) : !selectedFolder ? (
            /* VIEW: DAFTAR FOLDER */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              {Object.keys(groupedData).map(folder => (
                <div key={folder} onClick={() => setSelectedFolder(folder)} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 cursor-pointer hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Folder fill="currentColor" size={24} />
                    </div>
                    <div>
                      <p className="font-black text-gray-800">{folder}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{groupedData[folder].length} Foto</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* VIEW: GRID GAMBAR DENGAN LABEL TANGGAL */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 animate-in zoom-in-95 duration-500">
              {groupedData[selectedFolder]?.map(img => (
                <div key={img.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  
                  {/* Area Gambar */}
                  <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedImage(img)}>
                    <img 
                      src={`${IMAGE_HOST}${img.url}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
                      alt="kegiatan"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-300 backdrop-blur-[1px]">
                      <button onClick={(e) => { e.stopPropagation(); handleDownload(img.url); }} className="p-3 bg-white text-blue-600 rounded-2xl hover:scale-110 transition-transform shadow-lg">
                        <Download size={18}/>
                      </button>
                      <button onClick={(e) => handleDelete(e, img.id)} className="p-3 bg-red-500 text-white rounded-2xl hover:scale-110 transition-transform shadow-lg">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </div>

                  {/* Area Label Tanggal (DI BAWAH FOTO) */}
                  <div className="px-5 py-4 border-t border-gray-50 flex items-center gap-3 bg-white">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-700 leading-tight">
                        {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long' }).format(new Date(img.createdAt))}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(img.createdAt).getFullYear()}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* --- LIGHTBOX PREVIEW --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
          <div className="max-w-5xl w-full flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
            <img src={`${IMAGE_HOST}${selectedImage.url}`} className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl border border-white/10 animate-in zoom-in-95" alt="Full Preview" />
            <div className="flex flex-col items-center gap-2">
                <p className="text-white font-black italic uppercase tracking-widest">
                    {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(selectedImage.createdAt))}
                </p>
                <button onClick={() => handleDownload(selectedImage.url)} className="mt-2 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full backdrop-blur-xl transition-all font-bold">
                    <Download size={20} /> Unduh Gambar
                </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL UPLOAD --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 space-y-8 relative shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-red-500"><X /></button>
            <div className="text-center">
                <h2 className="text-xl font-black uppercase italic text-gray-800">Unggah Dokumentasi</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase italic">SI-PASTAR DATABASE</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-2 italic">Tanggal Kegiatan</label>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-700 focus:ring-2 focus:ring-blue-500" />
              </div>
              <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-100 rounded-[2.5rem] cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden">
                {!previewUrl ? (
                  <><Plus className="text-gray-300" size={32} /><p className="text-[10px] font-black uppercase text-gray-400 mt-2">Pilih File</p></>
                ) : (
                  <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if(file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                }} />
              </label>
              <button onClick={handleConfirmUpload} disabled={uploading} className="w-full py-5 rounded-[2.5rem] font-black bg-blue-600 text-white shadow-xl shadow-blue-100 uppercase text-xs tracking-widest hover:bg-blue-700 transition-all active:scale-95">
                {uploading ? "MEMPROSES..." : "SIMPAN DOKUMENTASI"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriKegiatan;