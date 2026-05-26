import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  flexRender 
} from '@tanstack/react-table';
import { API_BASE_URL, IMG_BASE_URL } from '../../utils/api';
import { 
  Save, Plus, Trash2, Image as ImageIcon, 
  Scale, FileText, Type, Heading3, Maximize2,
  Edit, Search, ChevronLeft, ChevronRight, ArrowUpDown
} from 'lucide-react';

const AdminTataTertib = () => {
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  
  // State Form untuk Tambah / Edit data
  const [formData, setFormData] = useState({ id: null, title: '', desc: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const RULES_IMG_URL = IMG_BASE_URL.replace('/berita/', '/tatib/');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/tatatertib`);
      setRules(res.data.data || res.data);
    } catch (err) {
      console.error("Gagal mengambil dokumen tata tertib:", err);
    }
  };

  const handleViewDetail = (url, title) => {
    Swal.fire({
      title: title,
      imageUrl: url,
      imageAlt: title,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-3xl shadow-2xl',
        image: 'max-h-[80vh] object-contain rounded-xl'
      }
    });
  };

  const handleEditSelect = (rule) => {
    setFormData({ id: rule.id, title: rule.title, desc: rule.desc });
    setPreview(`${RULES_IMG_URL}${rule.url}`);
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setFormData({ id: null, title: '', desc: '' });
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSaveDocument = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return Swal.fire({ icon: 'warning', title: 'Judul Wajib Diisi', confirmButtonColor: '#0f172a' });
    }
    if (!formData.id && !selectedFile) {
      return Swal.fire({ icon: 'warning', title: 'File Dokumen Wajib Diunggah', confirmButtonColor: '#0f172a' });
    }

    setLoading(true);
    Swal.fire({ title: 'Memproses data...', didOpen: () => Swal.showLoading(), allowOutsideClick: false });

    const dataSend = new FormData();
    dataSend.append('title', formData.title);
    dataSend.append('desc', formData.desc);
    if (selectedFile) dataSend.append('gambar', selectedFile);

    try {
      if (formData.id) {
        await axios.put(`${API_BASE_URL}/tatatertib/${formData.id}`, dataSend);
        Swal.fire({ icon: 'success', title: 'Diperbarui!', text: 'Dokumen tata tertib berhasil diubah.', timer: 2000, showConfirmButton: false });
      } else {
        await axios.post(`${API_BASE_URL}/tatatertib`, dataSend);
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Dokumen tata tertib baru telah ditambahkan.', timer: 2000, showConfirmButton: false });
      }
      handleResetForm();
      fetchRules();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal Menyimpan', text: err.response?.data?.message || 'Terjadi kesalahan sistem.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = (id) => {
    Swal.fire({
      title: 'Hapus Dokumen?',
      text: "Seluruh data aturan dan gambar berkas ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/tatatertib/${id}`);
          fetchRules();
          Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Dokumen berhasil dibersihkan.', timer: 1500, showConfirmButton: false });
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Gagal Hapus', text: 'Gagal menyingkirkan dokumen dari server.' });
        }
      }
    });
  };

  // DEFINISI KOLOM TANSTACK TABLE
  const columns = useMemo(() => [
    {
      accessorKey: 'url',
      header: 'Visual/Berkas',
      cell: (info) => (
        <div className="relative w-16 aspect-[1.414/1] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
          <img 
            src={`${RULES_IMG_URL}${info.getValue()}`} 
            className="w-full h-full object-cover" 
            alt="Rule Visual" 
          />
          <button 
            type="button"
            onClick={() => handleViewDetail(`${RULES_IMG_URL}${info.getValue()}`, info.row.original.title)}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'title',
      header: 'Judul Regulasi',
      cell: (info) => <span className="font-bold text-slate-900 block italic">{info.getValue()}</span>
    },
    {
      accessorKey: 'desc',
      header: 'Ringkasan Keterangan',
      cell: (info) => <span className="text-xs text-slate-500 line-clamp-2 leading-relaxed max-w-[250px]">{info.getValue() || '-'}</span>
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: (info) => (
        <div className="flex gap-1.5">
          <button 
            onClick={() => handleEditSelect(info.row.original)}
            className="p-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all"
            title="Ubah Detail"
          >
            <Edit size={14} />
          </button>
          <button 
            onClick={() => handleDeleteRule(info.row.original.id)}
            className="p-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-all"
            title="Hapus Dokumen"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    }
  ], [rules]);

  // KONFIGURASI UTAMA RECOGNIZER TANSTACK TABLE
  const table = useReactTable({
    data: rules,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, // Tampilkan 5 baris per halaman
      },
    },
  });

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Scale className="text-slate-700" /> Regulasi & Tata Tertib
            </h1>
            <p className="text-slate-500 text-sm mt-1">Kelola lembar maklumat aturan kunjungan dan barang bawaan Lapas via Data Table.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* PANEL FORM INPUT (Kiri) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-6">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-900">
              {formData.id ? <FileText size={20} className="text-amber-500" /> : <Plus size={20} className="text-emerald-500" />}
              {formData.id ? 'Edit Aturan' : 'Tambah Aturan'}
            </h2>

            <form onSubmit={handleSaveDocument} className="space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
                  <Heading3 size={14}/> Judul Regulasi
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Ketentuan Barang Larangan"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
                  <Type size={14}/> Ringkasan Keterangan
                </label>
                <textarea 
                  placeholder="Deskripsi singkat mengenai aturan di atas..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm h-24 resize-none"
                  value={formData.desc}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Berkas Visual (Kertas A4 / Poster)</label>
                <div 
                  className="border-2 border-dashed border-slate-200 p-4 rounded-2xl text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all"
                  onClick={() => document.getElementById('ruleFile').click()}
                >
                  {preview ? (
                    <div className="relative group">
                      <img src={preview} className="max-h-44 mx-auto rounded-lg shadow-sm" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg" onClick={(e) => { e.stopPropagation(); handleViewDetail(preview, 'Pratinjau Berkas'); }}>
                        <Maximize2 size={18} className="text-white"/>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-slate-400">
                      <ImageIcon className="mx-auto mb-2 opacity-30" size={36} />
                      <p className="text-xs font-semibold">Klik / seret file disini</p>
                    </div>
                  )}
                  <input id="ruleFile" type="file" className="hidden" accept="image/*" onChange={e => { if (e.target.files[0]) { setPreview(URL.createObjectURL(e.target.files[0])); setSelectedFile(e.target.files[0]); } }} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={loading} className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-md text-sm disabled:bg-slate-300">
                  <Save size={16}/> Simpan
                </button>
                { (formData.id || preview) && (
                  <button type="button" onClick={handleResetForm} className="px-4 py-3.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Batal</button>
                )}
              </div>
            </form>
          </div>

          {/* SISI PANEL DATA TABLE (Kanan - 2 Kolom Grid) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            
            {/* Header Kontrol Table (Pencarian) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 self-start sm:self-center">Daftar Regulasi Aktif</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari tata tertib..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Kontainer Render Tabel */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-200">
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 select-none">
                          {header.isPlaceholder ? null : (
                            <div 
                              className={`flex items-center gap-1 ${header.column.getCanSort() ? 'cursor-pointer hover:text-slate-900' : ''}`}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && <ArrowUpDown size={12} className="opacity-60" />}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="p-8 text-center text-slate-400 font-medium">
                        Tidak ada data tata tertib ditemukan.
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="p-4 align-middle text-slate-700">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Fitur Pagination Footer */}
            {rules.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1">
                  <span>Halaman</span>
                  <strong className="text-slate-800">
                    {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => table.previousPage()} 
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-40 disabled:hover:bg-slate-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => table.nextPage()} 
                    disabled={!table.getCanNextPage()}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-40 disabled:hover:bg-slate-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminTataTertib;