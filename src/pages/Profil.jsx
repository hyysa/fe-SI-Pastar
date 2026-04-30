import React, { useState, useEffect } from 'react';
import { Play, Shield, Music, Users, Star, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

const Profil = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/videos`);
      setVideos(response.data);
    } catch (error) {
      console.error("Gagal memuat video:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk menentukan icon berdasarkan kategori
  const getIcon = (kategori) => {
    switch (kategori?.toUpperCase()) {
      case 'UTAMA': return <Shield className="text-gold-dignity" />;
      case 'MASKOT': return <Star className="text-gold-dignity" />;
      case 'AUDIO': return <Music className="text-gold-dignity" />;
      case 'SEMANGAT': return <Users className="text-gold-dignity" />;
      default: return <Play className="text-gold-dignity" />;
    }
  };

  // Helper untuk konversi URL YouTube ke format Embed
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    else videoId = url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-6">
      {/* Ornamen Background */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gold-dignity/5 blur-[120px] rounded-full -z-0"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Media & <span className="text-gold-dignity">Identitas</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
            Kumpulan video dokumentasi, kreativitas, dan kobaran semangat pelayanan Lembaga Pemasyarakatan Kelas IIB Blitar.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-gold-dignity animate-spin mb-4" />
            <p className="text-slate-400 font-bold">Memuat Media...</p>
          </div>
        ) : (
          /* Video Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {videos.map((video) => (
              <div 
                key={video.id} 
                className="group bg-slate-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-amber-500/50 transition-all duration-500 shadow-2xl shadow-black"
              >
                {/* Video Player Container */}
                <div className="aspect-video w-full bg-black relative">
                  <iframe
                    className="w-full h-full"
                    src={getYouTubeEmbedUrl(video.url)}
                    title={video.judul}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Info Content */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-gold-dignity/10 transition-colors">
                        {getIcon(video.kategori)}
                      </div>
                      <div>
                        <span className="text-gold-dignity text-[10px] font-black uppercase tracking-[0.2em]">
                          {video.kategori}
                        </span>
                        <h3 className="text-2xl font-bold text-white group-hover:text-gold-dignity transition-colors">
                          {video.judul}
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 leading-relaxed font-medium">
                    {video.deskripsi || "Tidak ada deskripsi untuk video ini."}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-white/40 text-sm font-bold">
                    <Play size={14} className="fill-current" />
                    Official Media Lapas Blitar
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-20 p-10 bg-gradient-to-br from-gold-dignity to-amber-600 rounded-[3rem] text-center">
          <h2 className="text-3xl font-black text-midnight mb-2">Bangga Melayani Bangsa</h2>
          <p className="text-midnight/80 font-bold tracking-wide uppercase text-sm">
            Lapas Kelas IIB Blitar - PASTAR (Pasti Responsif)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profil;