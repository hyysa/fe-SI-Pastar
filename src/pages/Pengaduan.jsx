import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api'; // Pastikan path ini benar sesuai struktur proyekmu
import { 
  Send, 
  MessageSquare, 
  User, 
  Phone, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useEsc } from '../hooks/useEsc';
import Swal from 'sweetalert2';

const Pengaduan = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kontak: '', 
    subjek: '',
    pesan: '',
    anonim: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mengirim data ke endpoint backend yang sudah kita buat
      await axios.post(`${API_BASE_URL}/pengaduan`, formData);
      
      setSubmitted(true);
      // Reset form setelah berhasil
      setFormData({
        nama: '',
        kontak: '',
        subjek: '',
        pesan: '',
        anonim: false
      });
    } catch (error) {
      console.error("Gagal mengirim pengaduan:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal mengirim laporan. Pastikan koneksi internet atau server aktif.',
        confirmButtonColor: '#d4af37' // Warna gold
      });
    } finally {
      setLoading(false);
    }
  };

  // Menutup status "Terkirim" dengan tombol Esc
  useEsc(() => setSubmitted(false));

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-dignity/10 border border-gold-dignity/20 text-gold-dignity text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <ShieldCheck size={14} /> Layanan Pengaduan Masyarakat
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase italic tracking-tighter">
            Suara <span className="text-gold-dignity">Anda, <br /> </span> Progres <span className="text-gold-dignity">Kami!</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Laporkan kendala, saran, atau ketidaknyamanan layanan kami. Identitas Anda akan kami jaga kerahasiaannya sesuai standar prosedur yang berlaku.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Info Side */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem]">
              <AlertCircle className="text-gold-dignity mb-4" size={32} />
              <h3 className="text-white font-bold mb-2">Penting</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Pengaduan yang masuk akan segera ditindaklanjuti dalam waktu maksimal 3x24 jam kerja.
              </p>
            </div>
            <div className="bg-gold-dignity p-6 rounded-[2rem] text-slate-900">
              <MessageSquare className="mb-4" size={32} />
              <h3 className="font-black uppercase text-sm tracking-tight italic">Call Center</h3>
              <p className="font-bold text-xl">(0342) 801XXX</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:col-span-2">
            <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-sm">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nama Lengkap */}
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-gold-dignity transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={formData.nama}
                        placeholder={formData.anonim ? "Nama Disembunyikan" : "Nama Lengkap"}
                        required={!formData.anonim}
                        disabled={formData.anonim}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold-dignity outline-none transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      />
                    </div>
                    
                    {/* Nomor WhatsApp / HP */}
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-gold-dignity transition-colors" size={18} />
                      <input 
                        type="tel" 
                        value={formData.kontak}
                        placeholder="Nomor WA / HP Aktif"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold-dignity outline-none transition-all text-sm"
                        onChange={(e) => setFormData({...formData, kontak: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Subjek */}
                  <div className="relative group">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-gold-dignity transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={formData.subjek}
                      placeholder="Subjek Pengaduan"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold-dignity outline-none transition-all text-sm"
                      onChange={(e) => setFormData({...formData, subjek: e.target.value})}
                    />
                  </div>

                  {/* Pesan Detail */}
                  <div className="relative group">
                    <textarea 
                      rows="5" 
                      value={formData.pesan}
                      placeholder="Tuliskan laporan Anda secara mendetail..."
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-6 text-white focus:border-gold-dignity outline-none transition-all text-sm resize-none"
                      onChange={(e) => setFormData({...formData, pesan: e.target.value})}
                    ></textarea>
                  </div>

                  {/* Checkbox Anonim */}
                  <div className="flex items-center gap-3 px-2">
                    <input 
                      type="checkbox" 
                      id="anonim"
                      checked={formData.anonim}
                      className="w-5 h-5 accent-gold-dignity cursor-pointer"
                      onChange={(e) => setFormData({...formData, anonim: e.target.checked, nama: e.target.checked ? '' : formData.nama})}
                    />
                    <label htmlFor="anonim" className="text-slate-400 text-xs font-medium cursor-pointer select-none">
                      Kirim sebagai Anonim (Identitas nama disembunyikan)
                    </label>
                  </div>

                  {/* Button Submit */}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gold-dignity hover:bg-white text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    {loading ? 'Sedang Mengirim...' : 'Kirim Aduan'}
                  </button>
                </form>
              ) : (
                /* Success State View */
                <div className="py-12 text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 uppercase italic">Laporan Terkirim</h2>
                  <p className="text-slate-400 text-sm mb-8">
                    Terima kasih atas laporan Anda. Tim SI-PASTAR akan meninjau informasi tersebut dan menghubungi nomor Anda jika diperlukan.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 bg-white/5 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                  >
                    Kirim Laporan Lain
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengaduan;