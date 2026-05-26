import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // 1. Import SweetAlert2
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
} from '@tanstack/react-table';
import { 
  Save, UserPlus, Image as ImageIcon, Trash2, Edit2, X, User, Loader2
} from 'lucide-react';

import { API_BASE_URL, IMG_BASE_URL, getAuthHeader } from '../../utils/api';

const DataStruktur = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    bidang: '',
    level: '', 
    foto: null,
    preview: null
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/struktur`, getAuthHeader());
      const cleanData = response.data.data || response.data;
      setData(Array.isArray(cleanData) ? cleanData : []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (rowData) => {
    setEditingId(rowData.id);
    setFormData({
      nama: rowData.nama,
      jabatan: rowData.jabatan,
      bidang: rowData.bidang,
      level: rowData.level,
      foto: null,
      preview: rowData.url 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("nama", formData.nama);
    payload.append("jabatan", formData.jabatan);
    payload.append("bidang", formData.bidang);
    payload.append("level", formData.level);
    if (formData.foto) payload.append("foto", formData.foto);

    try {
      const config = {
        ...getAuthHeader(),
        headers: { 
          ...getAuthHeader().headers,
          "Content-Type": "multipart/form-data" 
        }
      };

      if (editingId) {
        await axios.patch(`${API_BASE_URL}/struktur/${editingId}`, payload, config);
        // 2. SweetAlert Sukses Update
        Swal.fire({
          icon: 'success',
          title: 'Berhasil diperbarui',
          text: 'Data pejabat telah diperbarui dalam sistem.',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        await axios.post(`${API_BASE_URL}/struktur`, payload, config);
        // 3. SweetAlert Sukses Simpan
        Swal.fire({
          icon: 'success',
          title: 'Berhasil disimpan',
          text: 'Pejabat baru telah ditambahkan ke struktur.',
          showConfirmButton: false,
          timer: 1500
        });
      }

      closeModal();
      fetchData();
    } catch (error) {
      // 4. SweetAlert Error
      Swal.fire({
        icon: 'error',
        title: 'Gagal memproses data',
        text: error.response?.data?.msg || "Terjadi kesalahan sistem"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nama: '', jabatan: '', bidang: '', level: '', foto: null, preview: null });
  };

  const deletePejabat = async (id) => {
    // 5. SweetAlert Konfirmasi Hapus
    const result = await Swal.fire({
      title: 'Hapus data ini?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/struktur/${id}`, getAuthHeader());
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Data telah dihapus dari database.',
          showConfirmButton: false,
          timer: 1000
        });
        fetchData();
      } catch (error) {
        Swal.fire('Gagal!', 'Tidak dapat menghapus data.', 'error');
      }
    }
  };

  const opsiJabatan = {
    pimpinan: ["Kepala Lembaga Pemasyarakatan Kelas IIB Blitar"],
    tataUsaha: ["Kepala Sub Bagian Tata Usaha", "Kepala Urusan Kepegawaian dan Keuangan", "Kepala Urusan Umum"],
    adkamtib: ["Kepala Seksi Administrasi Keamanan dan Tata Tertib", "Kepala Sub Seksi Keamanan", "Kepala Sub Seksi Pelaporan dan Tata Tertib"],
    binadik: ["Kepala Seksi Bimbingan Narapidana/Anak Didik dan Kegiatan Kerja", "Kepala Sub Seksi Perawatan Narapidan/Anak Didik", "Kepala Sub Seksi Kegiatan Kerja", "Kepala Sub Seksi Registrasi dan Bimbingan Kemasyarakatan"],
    kplp: ["Kepala Kesatuan Pengamanan Lembaga Pemasyarakatan"]
  };

  const columns = useMemo(() => [
    {
      id: 'no',
      header: 'NO',
      cell: (info) => <span className="text-slate-400 font-bold">{info.row.index + 1}</span>,
    },
    {
      accessorKey: 'url',
      header: 'FOTO',
      cell: (info) => {
        const rawUrl = info.getValue();
        const getSanitizedImg = (url) => {
          if (!url) return null;
          const fileName = url.split('/').pop();
          const baseHost = IMG_BASE_URL.split('/uploads/')[0];
          return `${baseHost}/uploads/struktur/${fileName}`;
        };
        const finalImgUrl = getSanitizedImg(rawUrl);

        return (
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
            {finalImgUrl ? (
              <img src={finalImgUrl} className="w-full h-full object-cover" alt="profil" />
            ) : (
              <User size={16} className="text-slate-300" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'nama',
      header: 'NAMA PEJABAT',
      cell: info => <div className="font-bold text-slate-800 leading-tight">{info.getValue()}</div>,
    },
    {
      accessorKey: 'bidang',
      header: 'BIDANG',
      cell: info => <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase tracking-widest">{info.getValue()}</span>,
    },
    {
      accessorKey: 'level',
      header: 'POSISI BAGAN',
      cell: info => <span className="text-blue-600 text-[10px] font-bold uppercase italic">{info.getValue()?.replace(/_/g, ' ')}</span>,
    },
    {
      id: 'actions',
      header: 'AKSI',
      cell: (info) => (
        <div className="flex gap-1">
          <button 
            onClick={() => handleEdit(info.row.original)}
            className="p-2 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => deletePejabat(info.row.original.id)} 
            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ], [data]);

  const table = useReactTable({
    data, columns, 
    getCoreRowModel: getCoreRowModel(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bidang') {
      setFormData({ ...formData, [name]: value, jabatan: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 6. SweetAlert Peringatan File
        Swal.fire({
          icon: 'warning',
          title: 'File terlalu besar',
          text: 'Maksimal ukuran file adalah 2MB.'
        });
        return;
      }
      setFormData({
        ...formData,
        foto: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Database Pejabat</h1>
            <p className="text-slate-400 text-sm font-medium italic underline decoration-blue-500/40 underline-offset-4">Struktur Organisasi Lapas Blitar</p>
          </div>
          <button 
            onClick={() => { setEditingId(null); setIsModalOpen(true); }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-black transition-all shadow-xl tracking-[0.2em]"
          >
            <UserPlus size={18} /> TAMBAH DATA STRUKTUR
          </button>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left">
              <thead>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id}>
                    {hg.headers.map(h => (
                      <th key={h.id} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-50">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 text-sm font-medium">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
          <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden my-auto">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tight">
                {editingId ? "Edit Pejabat" : "Tambah Pejabat"}
              </h2>
              <button onClick={closeModal} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nama Lengkap</label>
                  <input name="nama" type="text" required className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-slate-900 transition-all" placeholder="Nama, S.H." value={formData.nama} onChange={handleChange} />
                </div>
                <div className="space-y-2 text-center">
                   <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                      {formData.preview ? (
                        <img src={formData.preview.startsWith('blob') ? formData.preview : `${IMG_BASE_URL.split('/uploads/')[0]}/uploads/struktur/${formData.preview.split('/').pop()}`} className="w-full h-full object-cover" alt="preview" />
                      ) : (
                        <ImageIcon className="text-slate-300" size={24} />
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                   </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[32px] border-2 border-slate-100 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select name="bidang" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-xs" value={formData.bidang} onChange={handleChange}>
                    <option value="">Pilih Bidang...</option>
                    <option value="pimpinan">Pimpinan</option>
                    <option value="tataUsaha">Sub Bagian Tata Usaha</option>
                    <option value="adkamtib">Seksi Administrasi Kamtib</option>
                    <option value="binadik">Seksi Binadik & Giatja</option>
                    <option value="kplp">Kesatuan Pengamanan (KPLP)</option>
                  </select>

                  <select name="jabatan" required disabled={!formData.bidang} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-xs disabled:opacity-50" value={formData.jabatan} onChange={handleChange}>
                    <option value="">Pilih Jabatan...</option>
                    {formData.bidang && opsiJabatan[formData.bidang].map((j, i) => <option key={i} value={j}>{j}</option>)}
                  </select>
                </div>

                <select name="level" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold text-xs" value={formData.level} onChange={handleChange}>
                    <option value="">--- Pilih Lokasi Bagan ---</option>
                    <option value="level_1">Kepala Lapas</option>
                    <option value="level_2_tu">Kasubag Tata Usaha</option>
                    <option value="level_2_kamtib">Kasi Adm Kamtib</option>
                    <option value="level_2_binadik">Kasi Binadik & Giatja</option>
                    <option value="level_2_kplp">Ka. KPLP</option>
                    <option value="level_3_tu_1">Kaur Kepegawaian</option>
                    <option value="level_3_tu_2">Kaur Umum</option>
                    <option value="level_3_kamtib_1">Kasubsi Keamanan</option>
                    <option value="level_3_kamtib_2">Kasubsi Pelaporan</option>
                    <option value="level_3_binadik_1">Kasubsi Registrasi</option>
                    <option value="level_3_binadik_2">Kasubsi Perawatan</option>
                    <option value="level_3_binadik_3">Kasubsi Giatja</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-[22px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl tracking-[0.2em] text-[11px] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {editingId ? "UPDATE DATA" : "SIMPAN DATA"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataStruktur;