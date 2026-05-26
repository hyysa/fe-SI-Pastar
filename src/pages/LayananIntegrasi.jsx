import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Swiper untuk galeri infografis
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

import { API_BASE_URL, IMG_BASE_URL } from '../utils/api';

const LayananIntegrasi = () => {
  const [data, setData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Menggunakan IMG_BASE_URL asli karena backend menyimpan file ke /uploads/berita
  const INTEGRASI_IMG_URL = IMG_BASE_URL;

  useEffect(() => {
    const fetchIntegrasiData = async () => {
      try {
        setLoading(true);
        
        // Melakukan fetch ke dua endpoint terpisah sesuai arsitektur backend baru
        const [resContent, resPhotos] = await Promise.all([
          axios.get(`${API_BASE_URL}/integrasi`),
          axios.get(`${API_BASE_URL}/integrasi/galeri`)
        ]);
        
        // Set data teks persyaratan
        if (resContent.data) {
          setData(resContent.data.data || resContent.data);
        }
        
        // Set data array foto galeri dan diurutkan berdasarkan field 'urutan'
        if (resPhotos.data) {
          const galleryData = resPhotos.data.data || resPhotos.data;
          setPhotos(galleryData.sort((a, b) => a.urutan - b.urutan));
        }
      } catch (err) {
        console.error("Gagal memuat data integrasi:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntegrasiData();
  }, []);

  const handleWhatsApp = () => {
    const pesan = encodeURIComponent("Halo Admin, saya ingin menanyakan prosedur Layanan Integrasi (PB/CB/CMB).");
    window.open(`https://wa.me/6281563942704?text=${pesan}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen bg-midnight flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-dignity"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-midnight text-white pb-20 selection:bg-gold-dignity selection:text-midnight font-sans">
      
      {/* HEADER */}
      <section className="py-20 px-6 text-center">
        <button onClick={() => navigate(-1)} className="text-gold-dignity mb-8 block mx-auto font-bold hover:underline">
          ← Kembali ke Beranda
        </button>
        <h1 className="text-4xl md:text-6xl font-black mb-6">
          Layanan <span className="text-gold-dignity italic">Integrasi</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">{data?.deskripsi_singkat}</p>
      </section>

      {/* SYARAT KHUSUS */}
      {data?.syarat_khusus && (
        <section className="max-w-4xl mx-auto px-6 mb-12">
          <div className="bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500 p-6 rounded-r-2xl backdrop-blur-md">
            <h4 className="text-amber-500 font-black uppercase tracking-widest text-xs mb-2">Informasi Penting</h4>
            <p className="text-white text-base leading-relaxed">{data.syarat_khusus}</p>
          </div>
        </section>
      )}

      {/* GALERI INFOGRAFIS */}
      {photos.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-6 md:p-10">
            <Swiper
              modules={[Navigation, Pagination, Zoom, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              zoom={true}
              className="rounded-2xl"
            >
              {photos.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="swiper-zoom-container">
                    <img 
                      src={`${INTEGRASI_IMG_URL}${item.gambar}`} 
                      className="max-h-[70vh] object-contain mx-auto" 
                      alt="Infografis Alur Integrasi" 
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* KONTEN HTML DETAIL */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-1 bg-gold-dignity"></span> Rincian Persyaratan
            </h3>
            {data?.konten_teks ? (
              <div 
                className="text-gray-300 prose prose-invert prose-lg max-w-none 
                           prose-headings:text-gold-dignity prose-li:text-gray-300 
                           prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: data.konten_teks }} 
              />
            ) : (
              <p className="text-gray-500 italic">Belum ada detail rincian persyaratan.</p>
            )}
          </div>

          {/* SIDEBAR HUBUNGI KAMI */}
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 h-fit sticky top-10 text-center">
            <h4 className="text-xl font-bold mb-4">Konsultasi Layanan</h4>
            <p className="text-gray-400 text-sm mb-6">Punya pertanyaan mengenai syarat integrasi? atau Ingin Mengajukan Pengusulan? Hubungi pusat informasi kami.</p>
            <button 
              onClick={handleWhatsApp}
              className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-green-950"
            >
              WhatsApp Admin ↗
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LayananIntegrasi;