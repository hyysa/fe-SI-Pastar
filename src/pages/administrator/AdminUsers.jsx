import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios'; 
import { API_BASE_URL } from '../../utils/api'; 
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  flexRender 
} from '@tanstack/react-table';
import { 
  Search, Edit3, ShieldCheck, 
  X, Lock, Save, AlertTriangle, KeyRound, RefreshCw,
  Eye, EyeOff, Clock 
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  // 1. STATE DATA
  const [users, setUsers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showPassLama, setShowPassLama] = useState(false);
  const [showPassBaru, setShowPassBaru] = useState(false);

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    role: '',
    passwordLama: '',
    passwordBaru: ''
  });

  // --- AMBIL DATA DARI BACKEND ---
  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // 3. FUNGSI HANDLER
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      nama_lengkap: user.nama_lengkap || '', 
      role: user.role || 'humas',
      passwordLama: '',
      passwordBaru: ''
    });
    setShowPassLama(false);
    setShowPassBaru(false);
    setIsModalOpen(true);
  };

  const handleDirectReset = (user) => {
    Swal.fire({
      title: 'Reset Password?',
      html: `Password petugas <b>${user.nama_lengkap}</b> akan dikembalikan ke default:<br><br><code class="bg-gray-100 p-2 rounded text-red-600">!Lapas#blitar980</code>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0f172a',
      confirmButtonText: 'Ya, Reset!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${API_BASE_URL}/users/reset/${user.id}`); 
          Swal.fire('Berhasil!', 'Password telah di-reset ke default.', 'success');
          getUsers(); // Refresh data agar waktu update muncul
        } catch (error) {
          Swal.fire('Gagal', error.response?.data?.msg || 'Terjadi kesalahan', 'error');
        }
      }
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_BASE_URL}/users/${selectedUser.id}`, formData);
      Swal.fire({
        title: 'Berhasil!',
        text: `Data ${formData.nama_lengkap} telah diperbarui.`,
        icon: 'success',
        confirmButtonColor: '#0f172a'
      });
      setIsModalOpen(false);
      getUsers(); 
    } catch (error) {
      Swal.fire('Gagal', error.response?.data?.msg || 'Gagal memperbarui data.', 'error');
    }
  };

  // 4. DEFINISI KOLOM TABEL
  const columns = useMemo(() => [
    {
      header: 'Identitas Admin',
      accessorKey: 'nama_lengkap',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xs border-2 border-slate-200 shadow-sm">
            {row.original.nama_lengkap ? row.original.nama_lengkap.substring(0, 2).toUpperCase() : '??'}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm leading-tight">{row.original.nama_lengkap}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">@{row.original.username}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Otoritas',
      accessorKey: 'role',
      cell: ({ getValue }) => (
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100 shadow-sm">
          {getValue()}
        </span>
      )
    },
    {
      header: 'Pembaruan Terakhir',
      id: 'updated_at',
      // Menggunakan accessorFn agar fleksibel membaca snake_case atau camelCase
      accessorFn: (row) => row.updated_at || row.updatedAt,
      cell: ({ getValue }) => {
        const date = getValue();
        if (!date) return (
          <div className="flex items-center gap-2 opacity-30 italic">
            <Clock size={12} />
            <span className="text-[10px] font-bold uppercase">Belum Tercatat</span>
          </div>
        );
        
        const d = new Date(date);
        const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{tgl}</span>
            </div>
            <span className="text-[9px] text-slate-400 font-bold ml-3.5 uppercase">Pukul {jam} WIB</span>
          </div>
        );
      }
    },
    {
      header: 'Aksi Pengawas',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenEdit(row.original)}
            className="flex items-center gap-2 px-3 py-2 bg-white text-slate-900 border-2 border-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter"
          >
            <Edit3 size={14} /> Koreksi
          </button>
          
          <button 
            onClick={() => handleDirectReset(row.original)}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border-2 border-red-100 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-[10px] font-black uppercase tracking-tighter shadow-sm"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      )
    }
  ], []);

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-black text-gray-800 uppercase italic flex items-center gap-2 tracking-tighter">
          <ShieldCheck size={28} className="text-slate-900" /> Hak Akses Admin
        </h1>
        <p className="text-xs text-gray-500 font-medium italic tracking-wide">SI-PASTAR: Manajemen Otoritas & Keamanan Akun Petugas</p>
      </div>

      {/* Bar Pencarian */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input 
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Cari nama atau role petugas..."
          className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/5 text-sm font-medium transition-all"
        />
      </div>

      {/* Tabel Utama */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-slate-50 border-b border-gray-100">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="p-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-10 text-center text-gray-400 italic text-sm">
                    Data tidak ditemukan atau sedang memuat...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Akun */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          
          <form 
            onSubmit={handleUpdate}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300"
          >
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-800 uppercase italic leading-none">Koreksi Akun</h2>
                  <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-2">Identitas Digital Petugas</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      value={formData.nama_lengkap}
                      onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-700 text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Role Petugas</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-700 text-sm appearance-none cursor-pointer"
                    >
                      <option value="humas">Humas</option>
                      <option value="binadik">Binadik</option>
                      <option value="kplp">KPLP</option>
                      <option value="adkamtib">Adkamtib</option>
                      <option value="pengawas">Pengawas</option>
                    </select>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-amber-600">
                    <KeyRound size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verifikasi Keamanan</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Password Lama</label>
                      <div className="relative">
                        <input 
                          type={showPassLama ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={formData.passwordLama}
                          onChange={(e) => setFormData({...formData, passwordLama: e.target.value})}
                          className="w-full p-4 pr-12 bg-gray-50 border border-amber-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 text-sm transition-all"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassLama(!showPassLama)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          {showPassLama ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Password Baru</label>
                      <div className="relative">
                        <input 
                          type={showPassBaru ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={formData.passwordBaru}
                          onChange={(e) => setFormData({...formData, passwordBaru: e.target.value})}
                          className="w-full p-4 pr-12 bg-white border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 text-sm transition-all shadow-sm"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassBaru(!showPassBaru)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {showPassBaru ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[2rem] mt-4 flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-xs"
                >
                  <Save size={20} /> Simpan Perubahan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center justify-between text-white shadow-2xl shadow-slate-300">
        <div className="flex gap-5 items-center">
          <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-sm">
            <AlertTriangle size={32} className="text-amber-400" />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest italic leading-none">Peringatan Keamanan</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-2 max-w-sm font-medium">
              Setiap perubahan pada identitas atau password akan diaudit sistem SI-PASTAR.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
          <Lock size={14} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Enkripsi Aktif</span>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;