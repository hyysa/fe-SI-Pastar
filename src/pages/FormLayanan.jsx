import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../utils/api';
import { Camera, X, Users, UserPlus, Trash2, Loader2 } from 'lucide-react';

const FormLayanan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  // --- STATE LIMIT DINAMIS ---
  const [maxLimit, setMaxLimit] = useState(2); 

  const [formData, setFormData] = useState({
    kategoriWbp: '',
    namaPengunjung: '',
    nik: '',
    alamat: '',
    nomorWa: '',
    namaWbp: '',
    foto: null,
    setujuAturan: false,
    pengikut: [] // Array untuk menampung data rombongan
  });

  // --- AMBIL SETTINGS DARI DATABASE ---
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/settings`);
        if (response.data && response.data.max_rombongan !== undefined) {
          setMaxLimit(parseInt(response.data.max_rombongan));
        }
      } catch (error) {
        console.error("Gagal mengambil limit rombongan:", error);
        // Fallback tetap di 2 jika API error
      }
    };

    fetchSettings();
  }, []);

  // --- LOGIKA PENGIKUT (ROMBONGAN) ---
  const addPengikut = () => {
    if (formData.pengikut.length >= maxLimit) {
      Swal.fire({
        icon: 'warning',
        title: 'Batas Maksimum',
        text: `Sesuai kebijakan, maksimal rombongan adalah ${maxLimit} orang tambahan.`,
        confirmButtonColor: '#f59e0b'
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      pengikut: [...prev.pengikut, { nama: '', nik: '' }]
    }));
  };

  const removePengikut = (index) => {
    const newPengikut = formData.pengikut.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, pengikut: newPengikut }));
  };

  const handlePengikutChange = (index, field, value) => {
    const newPengikut = [...formData.pengikut];
    newPengikut[index] = { ...newPengikut[index], [field]: value };
    setFormData(prev => ({ ...prev, pengikut: newPengikut }));
  };

  // --- LOGIKA UPLOAD FOTO ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) { // Limit 2MB
        return Swal.fire('File Terlalu Besar', 'Maksimal ukuran foto adalah 2MB', 'error');
      }
      setFormData({ ...formData, foto: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, foto: null });
    setPreview(null);
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.foto) {
      return Swal.fire({
        icon: 'error',
        title: 'Foto Identitas Wajib',
        text: 'Silakan unggah foto KTP atau Selfie untuk verifikasi.',
        confirmButtonColor: '#0f172a'
      });
    }

    const data = new FormData();
    data.append('kategoriWbp', formData.kategoriWbp);
    data.append('namaPengunjung', formData.namaPengunjung);
    data.append('nik', formData.nik);
    data.append('alamat', formData.alamat);
    data.append('nomorWa', formData.nomorWa);
    data.append('namaWbp', formData.namaWbp);
    data.append('foto', formData.foto);
    // Kirim pengikut sebagai string JSON karena menggunakan multipart/form-data
    data.append('pengikut', JSON.stringify(formData.pengikut));

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/pendaftaran`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const noAntrian = response.data.nomorAntrian || '000';

      await Swal.fire({
        icon: 'success',
        title: 'Pendaftaran Berhasil!',
        html: `
          <div class="text-center">
            <p class="text-sm font-bold text-slate-500 uppercase tracking-tighter">Nomor Antrian Anda:</p>
            <h2 class="text-5xl font-black text-amber-500 my-4 tracking-tighter italic">${noAntrian}</h2>
            <p class="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
              Silakan simpan nomor ini atau screenshot layar ini.<br/>
              Tunggu konfirmasi petugas melalui WhatsApp.
            </p>
          </div>
        `,
        confirmButtonText: 'Kembali ke Beranda',
        confirmButtonColor: '#0f172a',
        allowOutsideClick: false
      });

      navigate('/');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim',
        text: error.response?.data?.message || "Terjadi kesalahan pada server.",
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-6 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full -z-0 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black mb-4 text-white tracking-tight italic uppercase">
            Formulir Kunjungan
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            Lapas Kelas IIB Blitar
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Kategori WBP */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kategori Warga Binaan</label>
              <select 
                required
                value={formData.kategoriWbp}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all cursor-pointer"
                onChange={(e) => setFormData({...formData, kategoriWbp: e.target.value})}
              >
                <option value="">Pilih Kategori...</option>
                <option value="Tahanan">Tahanan</option>
                <option value="Narapidana">Narapidana</option>
              </select>
            </div>

            {/* Nama & NIK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Pengunjung (Utama)</label>
                <input type="text" required placeholder="Sesuai KTP" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-amber-500 outline-none transition-all" 
                  onChange={(e) => setFormData({...formData, namaPengunjung: e.target.value})}/>
              </div>
              <div className="space-y-3">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">NIK KTP</label>
                <input type="number" required placeholder="16 Digit" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-amber-500 outline-none transition-all" 
                  onChange={(e) => setFormData({...formData, nik: e.target.value})}/>
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Alamat Domisili</label>
              <textarea rows="2" required placeholder="Alamat lengkap..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-amber-500 outline-none transition-all" 
                onChange={(e) => setFormData({...formData, alamat: e.target.value})}></textarea>
            </div>

            {/* WA & Nama WBP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">No. WhatsApp</label>
                <input type="tel" required placeholder="08xxx" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-amber-500 outline-none transition-all" 
                  onChange={(e) => setFormData({...formData, nomorWa: e.target.value})}/>
              </div>
              <div className="space-y-3">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Warga Binaan</label>
                <input type="text" required placeholder="Siapa yang dikunjungi?" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:border-amber-500 outline-none transition-all" 
                  onChange={(e) => setFormData({...formData, namaWbp: e.target.value})}/>
              </div>
            </div>

            {/* SEKSI ROMBONGAN */}
            <div className="p-6 bg-slate-900 rounded-[2.5rem] border-b-4 border-amber-500 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-lg text-slate-900"><Users size={18} /></div>
                  <h3 className="text-[12px] font-black text-white uppercase tracking-widest italic">Rombongan Keluarga</h3>
                </div>
                <button 
                  type="button" 
                  onClick={addPengikut}
                  disabled={formData.pengikut.length >= maxLimit}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                    formData.pengikut.length >= maxLimit ? 'bg-slate-800 text-slate-600' : 'bg-amber-500 text-slate-900 hover:bg-amber-600'
                  }`}
                >
                  <UserPlus size={14} /> Tambah
                </button>
              </div>

              <div className="space-y-3">
                {formData.pengikut.length === 0 ? (
                  <div className="py-8 border border-dashed border-slate-800 rounded-2xl text-center opacity-40">
                    <p className="text-[10px] text-slate-400 font-bold uppercase italic tracking-widest">Kunjungan Perorangan (Tanpa Pengikut)</p>
                  </div>
                ) : (
                  formData.pengikut.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 animate-in fade-in zoom-in duration-300">
                      <div className="md:col-span-6">
                        <input type="text" placeholder="Nama Anggota" value={item.nama} required
                          onChange={(e) => handlePengikutChange(index, 'nama', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-amber-500 transition-all"/>
                      </div>
                      <div className="md:col-span-5">
                        <input type="number" placeholder="NIK Anggota" value={item.nik} required
                          onChange={(e) => handlePengikutChange(index, 'nik', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-amber-500 transition-all"/>
                      </div>
                      <div className="md:col-span-1 flex justify-center">
                        <button type="button" onClick={() => removePengikut(index)} className="text-slate-500 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight text-center italic">
                * Maksimal {maxLimit} orang tambahan sesuai kebijakan layanan.
              </p>
            </div>

            {/* Upload Foto */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Verifikasi Identitas</label>
              {!preview ? (
                <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-12 hover:bg-slate-50 hover:border-amber-500 transition-all text-center relative group">
                  <input type="file" accept="image/*" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:rotate-12 transition-transform"><Camera size={32} /></div>
                    <p className="font-black text-slate-700 text-sm uppercase">Unggah Foto Bersama</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-xl aspect-video bg-slate-900">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                  <button type="button" onClick={removePhoto} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-4 p-6 bg-amber-50/50 rounded-2xl cursor-pointer border border-amber-100 group">
              <input type="checkbox" required className="mt-1 w-5 h-5 accent-slate-900 rounded-lg" 
                onChange={(e) => setFormData({...formData, setujuAturan: e.target.checked})} />
              <span className="text-[10px] text-slate-600 leading-relaxed font-bold uppercase italic tracking-tight group-hover:text-slate-900 transition-colors">
                Saya menyatakan bahwa data yang diisi adalah benar. Saya bersedia mematuhi aturan kunjungan di Lapas Blitar.
              </span>
            </label>

            <div className="flex flex-col md:flex-row gap-4">
              <button type="button" onClick={() => navigate('/')} className="flex-1 py-5 font-black text-slate-400 hover:text-slate-900 uppercase text-xs tracking-widest">Kembali</button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-[2] py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-2xl hover:bg-slate-800 hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                {loading ? "Sedang Mengirim..." : "Kirim Pendaftaran"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default FormLayanan;