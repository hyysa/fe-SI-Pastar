import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Loader2, ShoppingBag, X, Send, User, MapPin, Phone, 
  Minus, Plus, ClipboardList, LayoutGrid,
  ChevronLeft, ChevronRight, MessageSquare, CheckCircle2
} from 'lucide-react';
import { API_BASE_URL, IMG_BASE_URL } from '../utils/api';
import { useEsc } from '../hooks/useEsc';

const KaryaWbp = () => {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('detail'); 
  const [qty, setQty] = useState(1);
  const [formData, setFormData] = useState({ 
    nama: '', 
    alamat: '', 
    telepon: '', 
    catatan: '' 
  });
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // URL Helper untuk folder 'karya'
  const KARYA_IMG_URL = IMG_BASE_URL.replace('/berita/', '/karya/');

  // --- FETCH DATA ---
  const fetchKarya = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/karya`);
      if (response.data.status === 'success') {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Gagal memuat data produk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKarya();
  }, []);

  // --- LOGIC HELPERS ---
  const getAllProductImages = (item) => {
    if (!item) return [];
    let images = [];
    if (item.foto) images.push(`${KARYA_IMG_URL}${item.foto}`);
    if (item.gallery && item.gallery.length > 0) {
      item.gallery.forEach(g => {
        const url = `${KARYA_IMG_URL}${g.filename}`;
        if (!images.includes(url)) images.push(url);
      });
    }
    return images.length > 0 ? images : ["https://placehold.co/800?text=No+Image"];
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQty(1);
    setActiveTab('detail');
    setCurrentImgIndex(0);
    setOrderSuccess(false);
    setFormData({ nama: '', alamat: '', telepon: '', catatan: '' });
  };

  useEsc(closeModal);

  // --- HANDLE ORDER (SUBMIT TO DB) ---
  const handleOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      karya_id: selectedProduct.id,
      nama_pembeli: formData.nama,
      telepon: formData.telepon,
      alamat: formData.alamat,
      jumlah: qty,
      total_harga: selectedProduct.harga * qty,
      catatan: formData.catatan,
      status: 'pending' // Default status untuk admin konfirmasi
    };

    try {
      /**
       * PENTING: Backend Anda harus menangani:
       * 1. Insert ke tabel 'pesanan'
       * 2. Update tabel 'karya' set stok = stok - payload.jumlah
       */
      const response = await axios.post(`${API_BASE_URL}/pesanan`, payload);
      
      if (response.data.status === 'success' || response.status === 201) {
        setOrderSuccess(true);
        fetchKarya(); // Refresh stok di UI
        
        // Auto close modal setelah 3 detik sukses
        setTimeout(() => {
          closeModal();
        }, 3500);
      }
    } catch (error) {
      console.error("Error order:", error);
      alert(error.response?.data?.message || "Gagal mengirim pesanan. Silakan hubungi admin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-gold-dignity mb-4" size={48} />
      <p className="tracking-widest uppercase text-[10px] font-bold text-gold-dignity animate-pulse">Sinkronisasi Galeri...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-6 font-sans selection:bg-gold-dignity selection:text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">
            Karya <span className="text-gold-dignity underline decoration-white/10 underline-offset-8">WBP</span>
          </h1>
          <p className="text-slate-400 font-medium border-l-4 border-gold-dignity pl-6 text-lg max-w-2xl leading-relaxed italic">
            "Seni yang membebaskan. Setiap produk adalah bukti dedikasi warga binaan untuk hari esok yang lebih baik."
          </p>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((item) => (
            <div key={item.id} className="group relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col hover:border-gold-dignity/30 transition-all duration-500 shadow-2xl">
              
              {/* Stok Badge */}
              <div className={`absolute top-6 left-6 z-10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${item.stok > 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                {item.stok > 0 ? `Stok: ${item.stok}` : 'Stok Habis'}
              </div>

              {/* Image Thumbnail */}
              <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(item)}>
                <img 
                  src={item.foto ? `${KARYA_IMG_URL}${item.foto}` : "https://placehold.co/600?text=No+Image"} 
                  alt={item.nama} 
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.stok === 0 ? 'grayscale opacity-50' : ''}`} 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid size={20} /> Detail Karya
                   </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-white mb-3 uppercase italic group-hover:text-gold-dignity transition-colors">{item.nama}</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2">{item.deskripsi}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-gold-dignity font-black text-2xl">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.harga)}
                  </span>
                  <button 
                    disabled={item.stok === 0}
                    onClick={() => setSelectedProduct(item)} 
                    className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${item.stok > 0 ? 'bg-gold-dignity hover:bg-white text-black shadow-lg active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                  >
                    {item.stok > 0 ? 'Pesan' : 'Habis'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- MODAL SYSTEM --- */}
        {selectedProduct && (() => {
          const allImages = getAllProductImages(selectedProduct);
          const specs = typeof selectedProduct.specs === 'string' ? JSON.parse(selectedProduct.specs) : selectedProduct.specs;

          return (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={closeModal}></div>
              
              <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                
                {orderSuccess ? (
                  /* SUCCESS VIEW */
                  <div className="p-12 text-center flex flex-col items-center justify-center min-h-[450px] animate-in fade-in zoom-in duration-500">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                            <CheckCircle2 size={48} className="text-emerald-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic mb-3">Pesanan Diterima!</h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                        Data Anda sudah tersimpan di sistem kami. Admin akan segera menghubungi nomor WhatsApp 
                        <span className="text-gold-dignity font-bold ml-1">{formData.telepon}</span> untuk proses pembayaran.
                    </p>
                  </div>
                ) : (
                  /* FORM & DETAIL VIEW */
                  <>
                    {/* Slider Header */}
                    <div className="h-56 md:h-64 w-full relative group/slider">
                      <img src={allImages[currentImgIndex]} className="w-full h-full object-cover" alt="preview" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/20"></div>
                      
                      {/* Nav Slider */}
                      {allImages.length > 1 && (
                        <>
                           <button onClick={(e) => {e.stopPropagation(); setCurrentImgIndex(prev => prev === 0 ? allImages.length -1 : prev - 1)}} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-gold-dignity transition-all opacity-0 group-hover/slider:opacity-100"><ChevronLeft size={20} /></button>
                           <button onClick={(e) => {e.stopPropagation(); setCurrentImgIndex(prev => prev === allImages.length -1 ? 0 : prev + 1)}} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-gold-dignity transition-all opacity-0 group-hover/slider:opacity-100"><ChevronRight size={20} /></button>
                        </>
                      )}

                      <button onClick={closeModal} className="absolute top-6 right-6 p-2 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors z-20"><X size={18} /></button>
                    </div>

                    <div className="p-8 pt-0 -mt-10 relative">
                      <div className="mb-6">
                         <h2 className="text-3xl font-black text-white uppercase italic leading-none truncate">{selectedProduct.nama}</h2>
                         <p className="text-gold-dignity font-black text-xl mt-3 tracking-tight">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedProduct.harga)}
                         </p>
                      </div>

                      {/* Tab Navigation */}
                      <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 border border-white/5">
                        <button onClick={() => setActiveTab('detail')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'detail' ? 'bg-gold-dignity text-black shadow-lg shadow-gold-dignity/20' : 'text-slate-500 hover:text-white'}`}>
                          <ClipboardList size={14} /> Spek
                        </button>
                        <button onClick={() => setActiveTab('form')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'form' ? 'bg-gold-dignity text-black shadow-lg shadow-gold-dignity/20' : 'text-slate-500 hover:text-white'}`}>
                          <ShoppingBag size={14} /> Pesan
                        </button>
                      </div>

                      {activeTab === 'detail' ? (
                        /* Detail View */
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          <p className="text-slate-400 text-sm leading-relaxed italic border-l-2 border-gold-dignity pl-4">"{selectedProduct.deskripsi}"</p>
                          <div className="grid grid-cols-2 gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                            {specs && Object.entries(specs).map(([key, value]) => (
                              <div key={key} className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                                <p className="text-[8px] uppercase font-black text-gold-dignity/60 tracking-widest mb-1">{key}</p>
                                <p className="text-[11px] font-bold text-white uppercase">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Order Form View */
                        <form onSubmit={handleOrder} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          {/* Qty Selector */}
                          <div className="bg-gold-dignity/10 p-4 rounded-2xl border border-gold-dignity/20 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gold-dignity/60 uppercase tracking-widest">Jumlah Unit</span>
                              <span className="text-[11px] text-white font-bold italic mt-1 leading-none">Min. 1 Unit</span>
                            </div>
                            <div className="flex items-center gap-5 bg-black/40 p-1.5 rounded-xl border border-white/5">
                              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-lg bg-white/5 text-white flex items-center justify-center hover:bg-gold-dignity hover:text-black transition-all"><Minus size={14}/></button>
                              <span className="text-white font-black text-lg min-w-[20px] text-center">{qty}</span>
                              <button type="button" onClick={() => setQty(Math.min(selectedProduct.stok, qty + 1))} className="w-8 h-8 rounded-lg bg-white/5 text-white flex items-center justify-center hover:bg-gold-dignity hover:text-black transition-all"><Plus size={14}/></button>
                            </div>
                          </div>

                          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-gold-dignity transition-colors" size={18} />
                              <input required type="text" placeholder="Nama Anda" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-gold-dignity transition-all" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} />
                            </div>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-gold-dignity transition-colors" size={18} />
                              <input required type="number" placeholder="No. WhatsApp (Untuk Konfirmasi)" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-gold-dignity transition-all" value={formData.telepon} onChange={(e) => setFormData({...formData, telepon: e.target.value})} />
                            </div>
                            <div className="relative group">
                              <MapPin className="absolute left-4 top-4 text-slate-600 group-focus-within:text-gold-dignity transition-colors" size={18} />
                              <textarea required rows="2" placeholder="Alamat Lengkap Pengiriman" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-gold-dignity resize-none transition-all" value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})}></textarea>
                            </div>
                            <div className="relative group">
                              <MessageSquare className="absolute left-4 top-4 text-slate-600 group-focus-within:text-gold-dignity transition-colors" size={18} />
                              <textarea rows="1" placeholder="Catatan Tambahan / Ukuran (opsional) " className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-gold-dignity resize-none transition-all" value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})}></textarea>
                            </div>
                          </div>

                          <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full bg-gold-dignity hover:bg-white text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <><Send size={18} /> Buat Pesanan Sekarang</>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default KaryaWbp;