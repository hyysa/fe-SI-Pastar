import React, { useState, useEffect, useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  flexRender 
} from '@tanstack/react-table';
import { 
  Search, Trash2, Eye, Clock, CheckCircle, 
  Phone, X, UserRound, ShieldAlert 
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../utils/api';

const AdminPengaduan = () => {
  const [pengaduan, setPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedData, setSelectedData] = useState(null);

  // Pastikan URL mengarah ke endpoint yang benar
  const API_URL = `${API_BASE_URL}/pengaduan`;

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const fetchPengaduan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      // Sequelize biasanya mengembalikan data langsung dalam array jika menggunakan findAll
      setPengaduan(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengaduan:", error);
      Swal.fire('Error', 'Gagal memuat data dari server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, statusBaru) => {
    try {
      // Gunakan PATCH atau PUT sesuai route backend
      await axios.patch(`${API_URL}/${id}`, { status: statusBaru });
      Swal.fire('Berhasil', `Status diperbarui menjadi ${statusBaru}`, 'success');
      fetchPengaduan();
      setSelectedData(null);
    } catch (error) {
      Swal.fire('Error', 'Gagal memperbarui status', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Pengaduan?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          Swal.fire('Terhapus', 'Data berhasil dihapus', 'success');
          fetchPengaduan();
        } catch (error) {
          Swal.fire('Error', 'Gagal menghapus data', 'error');
        }
      }
    });
  };

  const columns = useMemo(() => [
    {
      header: 'Pelapor',
      accessorKey: 'nama',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.anonim ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
              {item.anonim ? <ShieldAlert size={18} /> : <UserRound size={18} />}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">{item.anonim ? 'Rahasia/Anonim' : item.nama}</p>
              {/* Mengganti Mail menjadi Phone karena kita menggunakan field 'kontak' */}
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold tracking-tighter">
                <Phone size={10} /> {item.kontak || 'N/A'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Subjek & Pesan',
      accessorKey: 'subjek',
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="font-bold text-gray-800 text-sm truncate">{row.original.subjek}</p>
          <p className="text-xs text-gray-500 line-clamp-1 italic">"{row.original.pesan}"</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue() || 'pending';
        const isSelesai = status.toLowerCase() === 'selesai';
        const isProses = status.toLowerCase() === 'proses';
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            isSelesai ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
            isProses ? 'bg-blue-50 text-blue-600 border-blue-100' :
            'bg-amber-50 text-amber-600 border-amber-100'
          }`}>
            {status}
          </span>
        );
      }
    },
    {
      header: 'Aksi',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => setSelectedData(row.original)}
            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => handleDelete(row.original.id)}
            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], []);

  const table = useReactTable({
    data: pengaduan,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase italic">Manajemen Pengaduan</h1>
          <p className="text-sm text-gray-500">SI-PASTAR: Monitoring Suara Masyarakat</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto">
          <Search className="text-gray-400 ml-2" size={18} />
          <input 
            type="text" 
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Cari laporan..."
            className="bg-transparent outline-none p-2 text-sm w-full md:w-64 text-gray-700"
          />
        </div>
      </div>

      {/* Tabel Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="p-10 text-center text-gray-400 italic">Sinkronisasi data database...</td></tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan="4" className="p-10 text-center text-gray-400">Belum ada pengaduan masuk.</td></tr>
              ) : table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedData && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedData(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-800 uppercase italic">Tindak Lanjut Aduan</h2>
                <button onClick={() => setSelectedData(null)} className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pengadu</p>
                    <p className="text-sm font-bold text-gray-700">{selectedData.anonim ? 'Rahasia' : selectedData.nama}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kontak</p>
                    <p className="text-sm font-bold text-gray-700">{selectedData.kontak}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Subjek: {selectedData.subjek}</p>
                  <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl italic text-gray-700 text-sm leading-relaxed shadow-inner">
                    "{selectedData.pesan}"
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleUpdateStatus(selectedData.id, 'selesai')}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Selesai
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedData.id, 'proses')}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
                  >
                    <Clock size={18} /> Proses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPengaduan;