import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  Search, Eye, CheckCircle, XCircle, 
  Users, Calendar, Phone, Fingerprint, Clock, Loader2, X, MapPin, User, Tag, MessageCircle, 
  Hash, Mail, Settings, Save, ChevronUp, ChevronDown, Printer
} from 'lucide-react';
import { API_BASE_URL } from '../../utils/api';
// Import fungsi cetak dari file PrintStruk
import { generatePrintHTML } from './PrintStruk'; 

const LayananPublik = () => {
  const [dataKunjungan, setDataKunjungan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null);

  // --- STATE SORTING ---
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // --- STATE UNTUK PENGATURAN LAYANAN ---
  const [maxLimit, setMaxLimit] = useState(2);
  const [isUpdatingLimit, setIsUpdatingLimit] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/pendaftaran`);
      const result = response.data.data || response.data;
      setDataKunjungan(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Gagal mengambil data kunjungan:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/settings`);
      if (response.data && response.data.max_rombongan !== undefined) {
        setMaxLimit(response.data.max_rombongan);
      }
    } catch (error) {
      console.warn("Gagal mengambil limit settings, menggunakan default.");
    }
  };

  useEffect(() => {
    fetchData();
    fetchSettings();
  }, []);

  // --- LOGIC CETAK ---
  const handlePrint = (item) => {
    const printContent = generatePrintHTML(item);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Pop-up Terblokir',
        text: 'Mohon izinkan pop-up pada browser Anda untuk mencetak struk.',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  // --- LOGIC SORTING ---
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ChevronUp size={12} className="opacity-20" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />;
  };

  const handleUpdateLimit = async () => {
    if (maxLimit === "" || maxLimit < 0) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Masukkan jumlah kuota yang valid!', confirmButtonColor: '#f59e0b' });
      return;
    }
    try {
      setIsUpdatingLimit(true);
      // Menggunakan PUT sesuai dengan fungsi yang Anda buat sebelumnya
      await axios.put(`${API_BASE_URL}/settings`, { newValue: parseInt(maxLimit) });
      Swal.fire({ icon: 'success', title: 'Berhasil!', text: `Kuota rombongan diperbarui menjadi ${maxLimit} orang.`, timer: 2000, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal Update', text: 'Terjadi kesalahan pada server atau rute tidak ditemukan.' });
    } finally {
      setIsUpdatingLimit(false);
    }
  };

  const handleUpdateStatus = async (id, statusBaru) => {
    const isApprove = statusBaru === 'Disetujui';
    const result = await Swal.fire({
      title: isApprove ? 'Setujui Permohonan?' : 'Tolak Permohonan?',
      text: `Anda akan mengubah status antrian ini menjadi ${statusBaru}`,
      icon: isApprove ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isApprove ? '#16a34a' : '#dc2626',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: isApprove ? 'Ya, Setujui!' : 'Ya, Tolak!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.patch(`${API_BASE_URL}/pendaftaran/${id}`, { statusVerifikasi: statusBaru });
        if (response.status === 200 || response.status === 204) {
          setSelectedDetail(null);
          fetchData();
          Swal.fire('Updated!', `Permohonan telah ${statusBaru}.`, 'success');
        }
      } catch (error) {
        Swal.fire('Gagal!', error.response?.data?.message || 'Gagal memperbarui status.', 'error');
      }
    }
  };

  const getWhatsAppLink = (nomor, nama) => {
    const cleanNumber = nomor.replace(/\D/g, '').replace(/^0/, '62');
    const pesan = encodeURIComponent(`Halo Bapak/Ibu ${nama}, kami dari layanan pendaftaran kunjungan Lapas Blitar ingin menginformasikan...`);
    return `https://wa.me/${cleanNumber}?text=${pesan}`;
  };

  // --- FILTER & SORT DATA ---
  const sortedAndFilteredData = React.useMemo(() => {
    let items = dataKunjungan.filter(item => 
      item.namaPengunjung?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaWbp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nik?.includes(searchTerm) ||
      item.nomorAntrian?.toString().includes(searchTerm)
    );

    if (sortConfig.key) {
      items.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [dataKunjungan, searchTerm, sortConfig]);

  return (
    <div className="space-y-5">
      {/* PANEL PENGATURAN */}
      <div className="bg-slate-900 rounded-[24px] p-5 border-b-4 border-amber-500 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500 rounded-2xl text-slate-900"><Users size={20} /></div>
          <div>
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest leading-none">Kuota Rombongan</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 tracking-tight">Atur maksimal pengikut tambahan pengunjung</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input type="number" min="0" value={maxLimit} onChange={(e) => setMaxLimit(e.target.value)}
            className="w-full md:w-28 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center font-black text-amber-500 outline-none transition-all" />
          <button onClick={handleUpdateLimit} disabled={isUpdatingLimit}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg min-w-[120px] justify-center">
            {isUpdatingLimit ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>} Update
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Antrian', val: dataKunjungan.length, icon: <Hash />, color: 'blue' },
          { label: 'Perlu Verifikasi', val: dataKunjungan.filter(x => x.statusVerifikasi === 'Pending' || !x.statusVerifikasi).length, icon: <Fingerprint />, color: 'amber' },
          { label: 'Disetujui', val: dataKunjungan.filter(x => x.statusVerifikasi === 'Disetujui').length, icon: <CheckCircle />, color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>{stat.icon}</div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-slate-800 leading-none">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">Data Kunjungan Online</h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input type="text" placeholder="Cari Nama / NIK..." onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none font-medium text-slate-600" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
          ) : (
            <table className="w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-slate-50/50 uppercase text-[10px] font-bold text-slate-400 tracking-widest">
                  <th className="px-6 py-4 border-b border-slate-100 text-center cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('nomorAntrian')}>
                    <div className="flex items-center justify-center gap-1">No {getSortIcon('nomorAntrian')}</div>
                  </th>
                  <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('createdAt')}>
                    <div className="flex items-center gap-1">Waktu {getSortIcon('createdAt')}</div>
                  </th>
                  <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('namaPengunjung')}>
                    <div className="flex items-center gap-1">Pengunjung {getSortIcon('namaPengunjung')}</div>
                  </th>
                  <th className="px-6 py-4 border-b border-slate-100">Pengikut</th>
                  <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('namaWbp')}>
                    <div className="flex items-center gap-1">Tujuan {getSortIcon('namaWbp')}</div>
                  </th>
                  <th className="px-6 py-4 text-center border-b border-slate-100">Status</th>
                  <th className="px-6 py-4 text-center border-b border-slate-100">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedAndFilteredData.map((item) => {
                  const pengikut = Array.isArray(item.pengikut) ? item.pengikut : (JSON.parse(item.pengikut || '[]'));
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-black shadow-md">{item.nomorAntrian || '-'}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-700">{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                          <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1"><Clock size={10} /> {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 uppercase">{item.namaPengunjung}</span>
                          <span className="text-[10px] text-slate-400 font-mono italic">{item.nik}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-black ${pengikut.length > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Users size={12} className="mr-1" /> {pengikut.length} Orang
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-600 uppercase">{item.namaWbp}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                          item.statusVerifikasi === 'Disetujui' ? 'bg-green-50 text-green-600' : 
                          item.statusVerifikasi === 'Ditolak' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>{item.statusVerifikasi || 'Pending'}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* TOMBOL CETAK STRUK */}
                          <button onClick={() => handlePrint(item)} title="Cetak Struk" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                            <Printer size={18} />
                          </button>
                          <a href={getWhatsAppLink(item.nomorWa, item.namaPengunjung)} target="_blank" rel="noreferrer" className="p-2 text-green-500 hover:bg-green-50 rounded-lg"><MessageCircle size={18} /></a>
                          <button onClick={() => setSelectedDetail(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={18} /></button>
                          <button onClick={() => handleUpdateStatus(item.id, 'Disetujui')} className="p-2 text-slate-300 hover:text-green-600"><CheckCircle size={18} /></button>
                          <button onClick={() => handleUpdateStatus(item.id, 'Ditolak')} className="p-2 text-slate-300 hover:text-red-600"><XCircle size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL DETAIL */}
      {selectedDetail && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedDetail(null)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 italic uppercase">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><User size={20}/></div> Detail Pengunjung
              </h3>
              <div className="flex items-center gap-2">
                {/* TOMBOL CETAK DI DALAM MODAL */}
                <button onClick={() => handlePrint(selectedDetail)} className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase px-4">
                  <Printer size={16}/> Cetak
                </button>
                <button onClick={() => setSelectedDetail(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Foto Identitas</p>
                  <div className="aspect-[4/3] rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-inner">
                    <img src={`${API_BASE_URL.replace('/api', '')}/uploads/pendaftaran/${selectedDetail.foto}`} alt="Identitas" className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Foto+Tidak+Ditemukan"; }} />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: <Fingerprint size={14}/>, label: 'NIK', val: selectedDetail.nik },
                    { icon: <User size={14}/>, label: 'Nama', val: selectedDetail.namaPengunjung },
                    { icon: <Phone size={14}/>, label: 'WhatsApp', val: selectedDetail.nomorWa, isWa: true },
                    { icon: <Tag size={14}/>, label: 'Tujuan (WBP)', val: selectedDetail.namaWbp },
                    { icon: <Clock size={14}/>, label: 'Waktu Daftar', val: new Date(selectedDetail.createdAt).toLocaleString('id-ID') },
                  ].map((info, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 text-blue-500">{info.icon}</div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">{info.label}</p>
                        {info.isWa ? (
                          <a href={getWhatsAppLink(info.val, selectedDetail.namaPengunjung)} target="_blank" rel="noreferrer" className="text-sm font-black text-green-600 hover:underline flex items-center gap-1">
                            {info.val} <MessageCircle size={12} />
                          </a>
                        ) : <p className="text-sm font-black text-slate-700">{info.val}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DAFTAR PENGIKUT DI MODAL */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Users size={14}/> Pengikut Rombongan ({Array.isArray(selectedDetail.pengikut) ? selectedDetail.pengikut.length : (JSON.parse(selectedDetail.pengikut || '[]')).length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Array.isArray(selectedDetail.pengikut) ? selectedDetail.pengikut : (JSON.parse(selectedDetail.pengikut || '[]'))).map((p, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">{i+1}</div>
                      <div>
                        <p className="text-xs font-black text-slate-700 uppercase">{p.nama}</p>
                        <p className="text-[10px] text-slate-400 font-mono italic">NIK: {p.nik}</p>
                      </div>
                    </div>
                  ))}
                  {(Array.isArray(selectedDetail.pengikut) ? selectedDetail.pengikut : (JSON.parse(selectedDetail.pengikut || '[]'))).length === 0 && (
                    <p className="text-xs text-slate-400 italic">Tidak ada pengikut tambahan.</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3">
                <button onClick={() => handleUpdateStatus(selectedDetail.id, 'Disetujui')} className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-green-700 flex items-center justify-center gap-2 transition-all shadow-lg">
                  <CheckCircle size={16} /> Setujui
                </button>
                <button onClick={() => handleUpdateStatus(selectedDetail.id, 'Ditolak')} className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase hover:bg-red-100 flex items-center justify-center gap-2 transition-all">
                  <XCircle size={16} /> Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayananPublik;