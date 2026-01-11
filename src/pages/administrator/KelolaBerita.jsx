import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Edit2, Trash2, Eye, 
  Newspaper, CheckCircle, Clock, ChevronUp, ChevronDown,
  Globe, FileEdit // Icon tambahan untuk Quick Action
} from 'lucide-react';

const KelolaBerita = () => {
  const navigate = useNavigate();

  // State awal (Nantinya diganti dengan data dari Express.js)
  const [dataBerita, setDataBerita] = useState([
    { id: 1, judul: "Kegiatan Kerohanian Warga Binaan", kategori: "Pembinaan", tanggal: "2025-12-23", status: "Published" },
    { id: 2, judul: "Kunjungan Kerja Kakanwil", kategori: "Kedinasan", tanggal: "2025-12-20", status: "Draft" },
    { id: 3, judul: "Pelatihan Kemandirian Meubel", kategori: "Kemandirian", tanggal: "2025-12-18", status: "Published" },
  ]);

  // --- LOGIKA QUICK ACTION ---
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Draft' ? 'Published' : 'Draft';
    
    // Simulasi update state (Nantinya pakai axios.patch ke backend)
    const updatedData = dataBerita.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    
    setDataBerita(updatedData);
    alert(`Berita berhasil diubah menjadi ${newStatus}`);
  };

  const handleDelete = (id) => {
    if(window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      setDataBerita(dataBerita.filter(item => item.id !== id));
    }
  };

  // --- LOGIKA SORTING ---
  const [sortConfig, setSortConfig] = useState({ key: 'tanggal', direction: 'desc' });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...dataBerita];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [dataBerita, sortConfig]);

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return <ChevronUp size={12} className="opacity-20" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div className="space-y-6 p-4">
      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Berita', val: dataBerita.length, icon: <Newspaper />, color: 'blue' },
          { label: 'Published', val: dataBerita.filter(d => d.status === 'Published').length, icon: <CheckCircle />, color: 'green' },
          { label: 'Draft', val: dataBerita.filter(d => d.status === 'Draft').length, icon: <Clock />, color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-50 flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
              stat.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {React.cloneElement(stat.icon, { size: 22 })}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800 leading-tight">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Main Table Card */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
        <div className="p-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Kelola Artikel</h2>
            <p className="text-xs font-medium text-slate-400">Total {dataBerita.length} berita terdaftar dalam sistem</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari berita..." 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
              />
            </div>
            <button 
              onClick={() => navigate('/admin/berita/tambah')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              <Plus size={16} /> Tambah
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                {[
                  { label: 'Judul Berita', key: 'judul' },
                  { label: 'Kategori', key: 'kategori' },
                  { label: 'Tanggal', key: 'tanggal' },
                  { label: 'Status', key: 'status' },
                ].map((col) => (
                  <th 
                    key={col.key}
                    onClick={() => requestSort(col.key)}
                    className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[2px] cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {col.label} {getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-700 block truncate max-w-xs group-hover:text-blue-600 transition-colors">
                      {item.judul}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">{item.kategori}</span>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-400">{item.tanggal}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-sm ${
                      item.status === 'Published' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      {/* QUICK ACTION STATUS */}
                      <button 
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`p-2 rounded-xl transition-all shadow-sm border ${
                          item.status === 'Draft' 
                          ? 'bg-green-50 border-green-100 text-green-600 hover:bg-green-600 hover:text-white' 
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        title={item.status === 'Draft' ? 'Terbitkan' : 'Tarik ke Draft'}
                      >
                        {item.status === 'Draft' ? <Globe size={16} /> : <FileEdit size={16} />}
                      </button>

                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"><Eye size={16} /></button>
                      <button 
                        onClick={() => navigate(`/admin/berita/edit/${item.id}`)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100"
                      ><Edit2 size={16} /></button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                      ><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Menampilkan <span className="text-slate-700">{sortedData.length}</span> dari <span className="text-slate-700">124</span> Data Artikel
          </p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all disabled:opacity-50">Prev</button>
            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-black transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaBerita;