import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // 1. Import SweetAlert2
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender 
} from '@tanstack/react-table';
import { 
  Plus, Search, Edit2, Trash2, Package, AlertCircle, 
  ChevronUp, ChevronDown, Loader2, ChevronLeft, ChevronRight, 
  Box, X, Save, Image as ImageIcon, Layers, Maximize, Sparkles, Clock, Trash
} from 'lucide-react';

import { API_BASE_URL, IMG_BASE_URL, getAuthHeader } from '../../utils/api';

const AdminKaryaWbp = () => {
  const getKaryaImgPath = (filename) => {
    if (!filename) return 'https://placehold.co/150?text=No+Image';
    const parts = IMG_BASE_URL.split('/berita/');
    const baseUrl = parts[0]; 
    return `${baseUrl}/karya/${filename}`;
  };

  const [dataKarya, setDataKarya] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(''); 
  const [globalFilter, setGlobalFilter] = useState(''); 
  const [sorting, setSorting] = useState([{ id: 'no', desc: false }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama: '', harga: '', stok: '', deskripsi: '', bidang: '',
    images: [], 
    oldFoto: null,
    specs: { bahan: '', ukuran: '', finishing: '', pengerjaan: '' }
  });

  const fetchKarya = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/karya`, getAuthHeader());
      const result = response.data.data;
      setDataKarya(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Gagal mengambil data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKarya(); }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setGlobalFilter(searchValue), 300);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 3) {
      Swal.fire({ icon: 'warning', title: 'Limit Foto', text: 'Maksimal 3 foto untuk slider gallery.' });
      return;
    }
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeImage = (index) => {
    const filtered = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: filtered });
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      const itemSpecs = typeof item.specs === 'string' ? JSON.parse(item.specs) : item.specs;
      setFormData({
        nama: item.nama || '',
        harga: item.harga || '',
        stok: item.stok || '',
        deskripsi: item.deskripsi || '',
        bidang: item.bidang || '',
        images: [], 
        oldFoto: item.foto,
        specs: itemSpecs || { bahan: '', ukuran: '', finishing: '', pengerjaan: '' }
      });
    } else {
      setEditingId(null);
      setFormData({ 
        nama: '', harga: '', stok: '', deskripsi: '', bidang: '', images: [], oldFoto: null,
        specs: { bahan: '', ukuran: '', finishing: '', pengerjaan: '' }
      });
    }
    setIsModalOpen(true);
  };

  // 2. SweetAlert Konfirmasi Hapus
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Karya?',
      text: "Produk akan dihapus permanen dari galeri publik.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/karya/${id}`, getAuthHeader());
        Swal.fire({ icon: 'success', title: 'Terhapus!', showConfirmButton: false, timer: 1000 });
        fetchKarya();
      } catch (error) { 
        Swal.fire('Gagal!', 'Tidak dapat menghapus data.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('nama', formData.nama);
    data.append('harga', formData.harga);
    data.append('stok', formData.stok);
    data.append('deskripsi', formData.deskripsi);
    data.append('bidang', formData.bidang);
    data.append('specs', JSON.stringify(formData.specs));
    
    formData.images.forEach((file) => { 
      data.append('images[]', file); 
    });

    try {
      const config = getAuthHeader();
      config.headers = { ...config.headers, 'Content-Type': 'multipart/form-data' };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/karya/${editingId}`, data, config);
      } else {
        await axios.post(`${API_BASE_URL}/karya`, data, config);
      }
      
      // 3. SweetAlert Sukses Simpan
      Swal.fire({
        icon: 'success',
        title: editingId ? 'Berhasil Diperbarui' : 'Berhasil Dipublish',
        text: editingId ? 'Data karya telah diperbarui.' : 'Karya WBP kini tampil di galeri.',
        showConfirmButton: false,
        timer: 1500
      });

      setIsModalOpen(false);
      fetchKarya();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: error.response?.data?.message || "Terjadi kesalahan sistem."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kolom & Table Setup (Tetap Sama)
  const columns = useMemo(() => [
    {
      id: 'no',
      header: 'No',
      cell: (info) => (info.row.index + 1).toString().padStart(2, '0'),
      className: "w-10 text-center font-bold text-slate-300 text-[10px]",
    },
    {
      accessorKey: 'nama',
      header: 'Produk & Spek',
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 shrink-0 shadow-sm">
            <img 
              src={getKaryaImgPath(row.original.foto)} 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Img'}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] md:text-[13px] font-black text-slate-700 uppercase italic leading-tight truncate">{row.original.nama}</p>
            <div className="flex gap-1 mt-1">
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded text-[8px] font-black uppercase tracking-tighter italic border border-blue-100">
                {row.original.bidang || 'UMUM'}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'harga',
      header: 'Harga Satuan',
      cell: (info) => <span className="text-[11px] font-bold text-slate-600 tracking-tight">Rp {Number(info.getValue()).toLocaleString('id-ID')}</span>
    },
    {
      accessorKey: 'stok',
      header: 'Stock',
      cell: (info) => (
        <span className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest ${info.getValue() > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {info.getValue() > 0 ? `${info.getValue()} UNIT` : 'HABIS'}
        </span>
      )
    },
    {
      id: 'aksi',
      header: () => <div className="text-center">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5">
          <button onClick={() => openModal(row.original)} className="p-2 bg-slate-50 text-slate-400 rounded-xl border border-slate-100 hover:bg-slate-900 hover:text-white transition-all"><Edit2 size={13} /></button>
          <button onClick={() => handleDelete(row.original.id)} className="p-2 bg-red-50 text-red-400 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={13} /></button>
        </div>
      )
    }
  ], []);

  const table = useReactTable({
    data: dataKarya,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="p-2 md:p-6 space-y-4 max-w-full overflow-hidden bg-slate-50/30 min-h-screen font-sans">
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-1">
        <StatCard label="Total Produk Galeri" val={dataKarya.length} icon={<Package size={18}/>} color="blue" />
        <StatCard label="Peringatan Stok" val={dataKarya.filter(d => d.stok < 5 && d.stok > 0).length} icon={<AlertCircle size={18}/>} color="amber" />
        <StatCard label="Produk Ready" val={dataKarya.filter(d => d.stok > 0).length} icon={<Box size={18}/>} color="green" />
      </div>

      <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 overflow-hidden mx-1">
        <div className="p-5 md:p-8 space-y-4 border-b border-slate-50">
          <div className="flex justify-between items-center gap-2">
            <div>
              <h2 className="text-base md:text-xl font-black text-slate-800 tracking-tight leading-none uppercase italic">Inventory Karya WBP</h2>
              <p className="text-[9px] md:text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest italic">Lapas Kelas IIB Blitar</p>
            </div>
            <button onClick={() => openModal()} className="bg-slate-900 text-white px-3 py-2.5 md:px-6 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-lg active:scale-95 transition-all">
              <Plus size={14} /> TAMBAH PRODUK
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Cari produk berdasarkan nama..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-[11px] md:text-sm outline-none focus:ring-2 focus:ring-slate-100 transition-all font-medium" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest" onClick={header.column.getToggleSortingHandler()}>
                      <div className="flex items-center gap-1 cursor-pointer">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: <ChevronUp size={10} />, desc: <ChevronDown size={10} /> }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={10} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-200" size={32} /></td></tr>
              ) : dataKarya.length === 0 ? (
                <tr><td colSpan={10} className="py-20 text-center text-slate-400 text-xs font-bold uppercase italic tracking-widest">Belum ada data produk</td></tr>
              ) : table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/30 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-tighter">
            Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
          </p>
          <div className="flex gap-2">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 shadow-sm transition-all"><ChevronLeft size={16}/></button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 shadow-sm transition-all"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg">
                  {editingId ? <Edit2 size={20}/> : <Plus size={20}/>}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                    {editingId ? 'Edit Karya' : 'Karya Baru'}
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Multi-Image & Spec Config</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500"><X size={24}/></button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              <form id="karya-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={14} className="text-blue-500" />
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">Gallery Slider (Max 3)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {editingId && formData.images.length === 0 && formData.oldFoto && (
                      <div className="relative aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-inner">
                        <img src={getKaryaImgPath(formData.oldFoto)} className="w-full h-full object-cover opacity-60" alt="old" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-[8px] text-white font-black uppercase tracking-widest text-center px-1">Foto Saat Ini</div>
                      </div>
                    )}
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden group shadow-sm">
                        <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={12}/></button>
                      </div>
                    ))}
                    {formData.images.length < 3 && (
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all group">
                        <Plus size={20} className="text-slate-300 group-hover:text-slate-500" />
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nama Produk</label>
                    <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-200 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Bidang</label>
                    <input required type="text" value={formData.bidang} onChange={e => setFormData({...formData, bidang: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-200 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Harga (Rp)</label>
                    <input required type="number" value={formData.harga} onChange={e => setFormData({...formData, harga: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-200 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Stok</label>
                    <input required type="number" value={formData.stok} onChange={e => setFormData({...formData, stok: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-200 transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Deskripsi Quote</label>
                  <textarea required rows="2" value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none italic focus:ring-2 focus:ring-slate-200 transition-all" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2"><Layers size={14} className="text-amber-500" /><span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">Spesifikasi Detail</span></div>
                  <div className="grid grid-cols-2 gap-3">
                    <SpecInput label="Bahan Baku" icon={<Box size={10}/>} val={formData.specs.bahan} onChange={v => setFormData({...formData, specs: {...formData.specs, bahan: v}})} />
                    <SpecInput label="Ukuran/Kapasitas" icon={<Maximize size={10}/>} val={formData.specs.ukuran} onChange={v => setFormData({...formData, specs: {...formData.specs, ukuran: v}})} />
                    <SpecInput label="Finishing" icon={<Sparkles size={10}/>} val={formData.specs.finishing} onChange={v => setFormData({...formData, specs: {...formData.specs, finishing: v}})} />
                    <SpecInput label="Waktu" icon={<Clock size={10}/>} val={formData.specs.pengerjaan} onChange={v => setFormData({...formData, specs: {...formData.specs, pengerjaan: v}})} />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 shrink-0">
              <button disabled={isSubmitting} form="karya-form" type="submit" className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                {editingId ? 'SIMPAN PERUBAHAN' : 'PUBLISH KE GALERI'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SpecInput = ({ icon, label, val, onChange }) => (
  <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-2">
    <div className="flex items-center gap-1.5 opacity-50">{icon} <span className="text-[8px] font-black uppercase tracking-widest">{label}</span></div>
    <input type="text" value={val} onChange={e => onChange(e.target.value)} className="w-full bg-transparent border-b border-slate-200 pb-1 text-[11px] font-black outline-none focus:border-amber-500 transition-all" />
  </div>
);

const StatCard = ({ label, val, icon, color }) => (
  <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
    <div className={`p-3 rounded-2xl ${color === 'blue' ? 'bg-blue-50 text-blue-600' : color === 'green' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-xl font-black text-slate-800 leading-none">{val}</p>
    </div>
  </div>
);

export default AdminKaryaWbp;