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
  Search, MessageCircle, CheckCircle2, Clock, 
  ChevronUp, ChevronDown, Loader2, ChevronLeft, ChevronRight, 
  X, User, MapPin, Phone, ShoppingCart, Trash2
} from 'lucide-react';

import { API_BASE_URL, getAuthHeader } from '../../utils/api';

const DaftarPesanan = () => {
  const [dataPesanan, setDataPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(''); 
  const [globalFilter, setGlobalFilter] = useState(''); 
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchPesanan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/pesanan`, getAuthHeader());
      const result = response.data.data;
      setDataPesanan(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPesanan(); }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setGlobalFilter(searchValue), 300);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const handleWhatsApp = (order) => {
    let cleanNumber = order.telepon.replace(/\D/g, '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '62' + cleanNumber.substring(1);
    }

    const isiPesan = `Halo *${order.nama_pembeli}*,\n\nKami dari *Admin Galeri WBP Lapas Blitar* ingin mengonfirmasi pesanan Anda:\n\n` +
      `📦 *Produk:* ${order.nama_produk}\n` +
      `🔢 *Jumlah:* ${order.jumlah} unit\n` +
      `💰 *Total Bayar:* Rp ${Number(order.total_harga).toLocaleString('id-ID')}\n\n` +
      `Silakan melakukan pembayaran melalui transfer. Jika sudah, kirimkan bukti transfernya di sini ya. Terima kasih! 🙏`;

    const waUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(isiPesan)}`;
    window.open(waUrl, '_blank');
  };

  const openDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // 2. SweetAlert Update Status
  const handleUpdateStatus = async (id, status) => {
    const result = await Swal.fire({
      title: 'Ubah Status?',
      text: `Pesanan ini akan ditandai sebagai ${status.toUpperCase()}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'selesai' ? '#0f172a' : '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);
      try {
        await axios.put(`${API_BASE_URL}/pesanan/${id}`, { status }, getAuthHeader());
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Pesanan telah berstatus ${status}`,
          showConfirmButton: false,
          timer: 1500
        });

        setIsModalOpen(false);
        fetchPesanan();
      } catch (error) {
        Swal.fire('Gagal!', 'Gagal memperbarui status pesanan.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 3. SweetAlert Hapus Data
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Pesanan?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/pesanan/${id}`, getAuthHeader());
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Data pesanan berhasil dihapus.',
          showConfirmButton: false,
          timer: 1500
        });
        fetchPesanan();
      } catch (error) {
        Swal.fire('Gagal!', 'Tidak dapat menghapus data.', 'error');
      }
    }
  };

  // --- Table Columns & Logic (Tetap sama) ---
  const columns = useMemo(() => [
    {
      id: 'no',
      header: 'No',
      cell: (info) => (info.row.index + 1).toString().padStart(2, '0'),
      className: "w-10 text-center font-bold text-slate-300 text-[10px]",
    },
    {
      accessorKey: 'createdAt',
      header: 'Waktu Pesan',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="flex flex-col text-[10px]">
            <span className="font-bold text-slate-700">{date.toLocaleDateString('id-ID')}</span>
            <span className="text-slate-400">{date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'nama_pembeli',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex flex-col min-w-[150px]">
          <span className="text-[12px] font-black text-slate-700 uppercase italic leading-tight">{row.original.nama_pembeli}</span>
          <div className="flex items-center gap-1 mt-1 text-slate-400">
            <Phone size={10} />
            <span className="text-[9px] font-bold">{row.original.telepon}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'nama_produk',
      header: 'Produk Dipesan',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
           <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><ShoppingCart size={14}/></div>
           <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-600 uppercase">{row.original.nama_produk}</span>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">{row.original.jumlah} UNIT</span>
           </div>
        </div>
      )
    },
    {
      accessorKey: 'total_harga',
      header: 'Total Bayar',
      cell: (info) => <span className="text-[11px] font-black text-slate-700 tracking-tight">Rp {Number(info.getValue()).toLocaleString('id-ID')}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue()?.toLowerCase();
        const style = status === 'selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      status === 'proses' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      status === 'ditolak' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-amber-50 text-amber-600 border-amber-100';
        return (
          <span className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest border ${style} uppercase`}>
            {status || 'PENDING'}
          </span>
        );
      }
    },
    {
      id: 'aksi',
      header: () => <div className="text-center">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5">
          <button onClick={() => openDetail(row.original)} className="p-2 bg-slate-50 text-slate-400 rounded-xl border border-slate-100 hover:bg-slate-900 hover:text-white transition-all"><Search size={13} /></button>
          <button onClick={() => handleDelete(row.original.id)} className="p-2 bg-red-50 text-red-400 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={13} /></button>
        </div>
      )
    }
  ], []);

  const table = useReactTable({
    data: dataPesanan,
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
      
      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-1">
        <StatCard label="Total Pesanan" val={dataPesanan.length} icon={<ShoppingCart size={18}/>} color="blue" />
        <StatCard label="Menunggu Konfirmasi" val={dataPesanan.filter(d => d.status === 'pending').length} icon={<Clock size={18}/>} color="amber" />
        <StatCard label="Pesanan Selesai" val={dataPesanan.filter(d => d.status === 'selesai').length} icon={<CheckCircle2 size={18}/>} color="green" />
      </div>

      <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 overflow-hidden mx-1">
        <div className="p-5 md:p-8 space-y-4 border-b border-slate-50">
          <div>
            <h2 className="text-base md:text-xl font-black text-slate-800 tracking-tight leading-none uppercase italic">Daftar Pesanan Karya</h2>
            <p className="text-[9px] md:text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest italic">Lapas Kelas IIB Blitar</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Cari..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none font-medium" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
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
                <tr><td colSpan={10} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-200" size={32} /></td></tr>
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
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30"><ChevronLeft size={16}/></button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg"><ShoppingCart size={20}/></div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Detail Pesanan</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Order ID: #ORD-{selectedOrder.id}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500"><X size={24}/></button>
            </div>

            <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[65vh]">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Nama Pembeli" val={selectedOrder.nama_pembeli} icon={<User size={14}/>} />
                <DetailItem label="No. WhatsApp" val={selectedOrder.telepon} icon={<Phone size={14}/>} />
              </div>
              <DetailItem label="Alamat Pengiriman" val={selectedOrder.alamat} icon={<MapPin size={14}/>} fullWidth />
              <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-3">
                 <div className="flex items-center gap-2 text-slate-400"><ShoppingCart size={14}/><span className="text-[10px] font-black uppercase tracking-widest">Item Pesanan</span></div>
                 <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase italic">{selectedOrder.nama_produk}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{selectedOrder.jumlah} UNIT x Rp {Number(selectedOrder.harga_satuan || 0).toLocaleString('id-ID')}</p>
                    </div>
                    <p className="text-lg font-black text-blue-600 tracking-tighter">Rp {Number(selectedOrder.total_harga).toLocaleString('id-ID')}</p>
                 </div>
              </div>
              {selectedOrder.catatan && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                   <p className="text-[9px] font-black text-amber-600 uppercase mb-1">Catatan Pembeli:</p>
                   <p className="text-xs text-amber-800 italic">"{selectedOrder.catatan}"</p>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleWhatsApp(selectedOrder)}
                className="col-span-2 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg mb-2"
              >
                <MessageCircle size={18}/> Hubungi & Konfirmasi Pembayaran
              </button>
              <button 
                  disabled={isSubmitting || selectedOrder.status === 'ditolak' || selectedOrder.status === 'selesai'}
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'ditolak')}
                  className="bg-white border border-red-200 text-red-500 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all disabled:opacity-50"
              >
                  Tolak Pesanan
              </button>
              <button 
                disabled={isSubmitting || selectedOrder.status === 'selesai' || selectedOrder.status === 'ditolak'}
                onClick={() => handleUpdateStatus(selectedOrder.id, 'selesai')}
                className="bg-slate-900 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={14}/> : <CheckCircle2 size={16}/>} Tandai Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components (Tetap sama)
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

const DetailItem = ({ label, val, icon, fullWidth = false }) => (
  <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 ${fullWidth ? 'col-span-2' : ''}`}>
    <div className="flex items-center gap-1.5 opacity-40 text-slate-900">
      {icon} <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-xs font-bold text-slate-700 leading-tight uppercase">{val || '-'}</p>
  </div>
);

export default DaftarPesanan;