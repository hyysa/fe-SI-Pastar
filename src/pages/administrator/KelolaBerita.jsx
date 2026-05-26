import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Plus, Search, Edit2, Trash2, Newspaper, CheckCircle, 
  Clock, ChevronUp, ChevronDown, Globe, FileEdit, 
  Loader2, ChevronLeft, ChevronRight, Eye, Calendar,
  History
} from 'lucide-react';

import { API_BASE_URL, IMG_BASE_URL, getAuthHeader } from '../../utils/api';

const KelolaBerita = () => {
  const navigate = useNavigate();
  const [dataBerita, setDataBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(''); 
  const [globalFilter, setGlobalFilter] = useState(''); 
  const [sorting, setSorting] = useState([{ id: 'created_at', desc: true }]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(searchValue);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/berita`);
      const result = response.data.data || response.data;
      setDataBerita(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      Swal.fire('Error', 'Gagal memuat data berita', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBerita(); }, []);

  // 2. SweetAlert untuk Toggle Status
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Draft' ? 'Published' : 'Draft';
    
    const result = await Swal.fire({
      title: 'Ubah Status?',
      text: `Apakah Anda yakin ingin mengubah status menjadi ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f172a', // Slate 900
      cancelButtonColor: '#94a3b8', // Slate 400
      confirmButtonText: 'Ya, Ubah!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${API_BASE_URL}/berita/status/${id}`, { status: newStatus }, getAuthHeader());
        setDataBerita(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Berita telah di-${newStatus}`,
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) { 
        Swal.fire('Gagal', 'Gagal memperbarui status berita', 'error');
      }
    }
  };

  // 3. SweetAlert untuk Hapus Berita
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Berita?',
      text: "Data yang dihapus tidak dapat dikembalikan secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48', // Rose 600
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/berita/${id}`, getAuthHeader());
        setDataBerita(prev => prev.filter(item => item.id !== id));
        
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Berita berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) { 
        Swal.fire('Gagal', 'Gagal menghapus berita tersebut', 'error');
      }
    }
  };

  const columns = useMemo(() => [
    {
      id: 'no',
      header: 'No',
      cell: (info) => (info.row.index + 1 + info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize).toString().padStart(2, '0'),
      className: "w-10 text-center font-bold text-slate-300 text-[10px]",
    },
    {
      accessorKey: 'judul',
      header: 'Informasi Berita',
      cell: ({ row }) => {
        const item = row.original;
        const formatTglKegiatan = (tgl) => {
          if(!tgl) return "Tanggal tidak set";
          return new Date(tgl).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        return (
          <div className="flex items-center gap-2 md:gap-3 min-w-[250px]">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
              <img 
                src={`${IMG_BASE_URL}${item.gambar}`} 
                alt="" 
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Img'}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] md:text-[13px] font-bold text-slate-700 leading-tight line-clamp-2">{item.judul}</p>
              <div className="flex items-center gap-1 mt-1 text-blue-500">
                <Calendar size={10} className="shrink-0" />
                <span className="text-[9px] md:text-[10px] font-bold italic">
                  Kegiatan: {formatTglKegiatan(item.tanggal)}
                </span>
              </div>
              <span className="md:hidden px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase italic tracking-tighter mt-1 inline-block">
                {item.kategori}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'kategori',
      header: 'Kategori',
      className: 'hidden md:table-cell',
      cell: (info) => (
        <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase italic tracking-tight">
          {info.getValue()}
        </span>
      )
    },
    {
      accessorKey: 'created_at',
      header: 'Data Dibuat',
      className: 'hidden lg:table-cell',
      cell: (info) => {
        const date = new Date(info.getValue());
        return (
          <div className="flex flex-col opacity-70">
            <div className="flex items-center gap-1 text-slate-600">
                <History size={10} />
                <span className="text-[10px] font-bold">
                  {date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            </div>
            <span className="text-[9px] text-slate-400 font-medium uppercase ml-3.5">
              Pukul {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      className: "w-24 text-center",
      cell: ({ row }) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-wider ${
          row.original.status === 'Published' ? 'bg-green-500 text-white shadow-sm' : 'bg-amber-100 text-amber-700 border border-amber-200'
        }`}>
          {row.original.status}
        </span>
      )
    },
    {
      id: 'aksi',
      header: () => <div className="text-center">Aksi</div>,
      className: "w-32",
      cell: ({ row }) => {
        const isDraft = row.original.status === 'Draft';
        return (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => navigate(`/admin/berita/detail/${row.original.id}`)} className="p-1.5 bg-blue-50 text-blue-500 rounded-lg border border-blue-100 hover:bg-blue-500 hover:text-white transition-all" title="Detail"><Eye size={14} /></button>
            <button onClick={() => handleToggleStatus(row.original.id, row.original.status)} className={`p-1.5 rounded-lg border transition-all ${isDraft ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white' : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white'}`} title={isDraft ? "Terbitkan" : "Arsipkan"}>{isDraft ? <Globe size={14} /> : <FileEdit size={14} />}</button>
            <button onClick={() => navigate(`/admin/berita/edit/${row.original.id}`)} className="p-1.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 hover:bg-slate-200 hover:text-slate-600" title="Edit"><Edit2 size={14} /></button>
            <button onClick={() => handleDelete(row.original.id)} className="p-1.5 bg-red-50 text-red-400 rounded-lg border border-red-100 hover:bg-red-500 hover:text-white transition-all" title="Hapus"><Trash2 size={14} /></button>
          </div>
        );
      }
    }
  ], [navigate]);

  const table = useReactTable({
    data: dataBerita,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="p-2 md:p-6 space-y-4 max-w-full overflow-hidden bg-slate-50/30 min-h-screen font-sans text-slate-900">
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-1">
        {[
          { label: 'Total Berita', val: dataBerita.length, icon: <Newspaper />, color: 'blue' },
          { label: 'Terbit (Live)', val: dataBerita.filter(d => d.status === 'Published').length, icon: <CheckCircle />, color: 'green' },
          { label: 'Arsip (Draft)', val: dataBerita.filter(d => d.status === 'Draft').length, icon: <Clock />, color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : stat.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{React.cloneElement(stat.icon, { size: 18 })}</div>
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-lg font-black text-slate-800 leading-none">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 overflow-hidden mx-1">
        {/* Header & Search */}
        <div className="p-5 md:p-8 space-y-4 border-b border-slate-50">
          <div className="flex justify-between items-center gap-2">
            <div>
              <h2 className="text-base md:text-xl font-black text-slate-800 tracking-tight leading-none">Manajemen Berita</h2>
              <p className="text-[9px] md:text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest italic">Lapas Kelas IIB Blitar</p>
            </div>
            <button onClick={() => navigate('/admin/berita/tambah')} className="bg-slate-900 text-white px-3 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-slate-200"><Plus size={14} /> TAMBAH BERITA</button>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Cari berita..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-[11px] md:text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className={`px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer ${header.column.columnDef.className}`} onClick={header.column.getToggleSortingHandler()}>
                      <div className="flex items-center gap-1">
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
                <tr><td colSpan={columns.length} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-200" size={32} /></td></tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    {row.getVisibleCells().map(cell => (<td key={cell.id} className={`px-4 py-3 ${cell.column.columnDef.className}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>))}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={columns.length} className="py-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Tidak Ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-tighter">Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}</p>
          <div className="flex gap-1.5">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 shadow-sm"><ChevronLeft size={16} /></button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 shadow-sm"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaBerita;