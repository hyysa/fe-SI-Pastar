import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FormLayanan = () => {
  const navigate = useNavigate();
  
  // Pastikan saat masuk halaman ini, scroll otomatis ke paling atas
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    kategoriWbp: '',
    namaPengunjung: '',
    nik: '',
    alamat: '',
    nomorWa: '',
    namaWbp: '',
    foto: null,
    setujuAturan: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.kategoriWbp) {
      alert("Pilih kategori kunjungan!"); return;
    }
    alert("Pendaftaran Berhasil!");
    navigate('/');
  };

  return (
    // Tambahkan pt-32 agar konten tidak tertutup Navbar fixed
    <div className="min-h-screen bg-midnight text-midnight pt-32 pb-20 px-6 relative overflow-x-hidden">
      
      {/* Background Decor - Dibuat Fixed agar tidak berantakan saat scroll */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gold-dignity/10 blur-[120px] rounded-full -z-0 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -z-0 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black mb-4 text-platinum tracking-tight">
            Formulir Kunjungan Online
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-platinum text-sm font-medium mb-10 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-gold-dignity animate-pulse"></span>
            Lembaga Pemasyarakatan Kelas IIB Blitar
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-platinum border border-slate-200 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl shadow-slate-200/60">
          <form onSubmit={handleSubmit} className="space-y-7">
            
            {/* 1. Select Kategori */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-midnight uppercase tracking-[0.2em] ml-1">Tujuan Kunjungan</label>
              <div className="relative">
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-midnight appearance-none focus:border-gold-dignity focus:ring-4 focus:ring-gold-dignity/10 outline-none transition-all cursor-pointer"
                  onChange={(e) => setFormData({...formData, kategoriWbp: e.target.value})}
                >
                  <option value="">Pilih Kategori...</option>
                  <option value="Tahanan">Tahanan</option>
                  <option value="Narapidana">Narapidana</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gold-dignity">
                   ▼
                </div>
              </div>
            </div>

            {/* 2. Grid Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-midnight uppercase tracking-[0.2em] ml-1">Nama Pengunjung</label>
                <input type="text" required placeholder="Nama Lengkap" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-gold-dignity outline-none transition-all" onChange={(e) => setFormData({...formData, namaPengunjung: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-midnight uppercase tracking-[0.2em] ml-1">NIK Identitas</label>
                <input type="text" required placeholder="16 Digit NIK" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-gold-dignity outline-none transition-all" onChange={(e) => setFormData({...formData, nik: e.target.value})}/>
              </div>
            </div>

            {/* 3. Alamat */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-midnight uppercase tracking-[0.2em] ml-1">Alamat Sesuai KTP</label>
              <textarea rows="2" required placeholder="Alamat Lengkap..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-gold-dignity outline-none transition-all" onChange={(e) => setFormData({...formData, alamat: e.target.value})}></textarea>
            </div>

            {/* 4. Nomor WA & Nama Terpidana */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-midnight uppercase tracking-[0.2em] ml-1">No. WhatsApp</label>
                <input type="tel" required placeholder="0812..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-gold-dignity outline-none transition-all" onChange={(e) => setFormData({...formData, nomorWa: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-midnight uppercase tracking-[0.2em] ml-1">Nama WBP (Warga Binaan)</label>
                <input type="text" required placeholder="Nama yang dikunjungi" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-gold-dignity outline-none transition-all" onChange={(e) => setFormData({...formData, namaWbp: e.target.value})}/>
              </div>
            </div>

            {/* 5. Upload Foto */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-midnight uppercase tracking-[0.2em] ml-1">Foto Identitas / Selfie</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:bg-slate-50 transition-all text-center group cursor-pointer relative">
                <input type="file" accept="image/*" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFormData({...formData, foto: e.target.files[0]})} />
                <p className="text-slate-400 font-medium group-hover:text-gold-dignity">Klik untuk pilih foto atau drag & drop</p>
              </div>
            </div>

            {/* 6. Checkbox */}
            <label className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl cursor-pointer group">
              <input type="checkbox" required className="mt-1 w-5 h-5 text-gold-dignity rounded border-slate-300" onChange={(e) => setFormData({...formData, setujuAturan: e.target.checked})} />
              <span className="text-xs text-slate-700 leading-relaxed font-medium">Saya bersedia menaati seluruh aturan kunjungan di Lapas Blitar.</span>
            </label>

            {/* 7. Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button type="button" onClick={() => navigate('/')} className="flex-1 py-4 bg-platinum font-bold text-slate-700 hover:text-midnight transition-colors">Batal</button>
              <button type="submit" className="flex-[2] py-4 bg-midnight text-white rounded-2xl font-black shadow-xl shadow-midnight/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm">Kirim Data Kunjungan</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default FormLayanan;