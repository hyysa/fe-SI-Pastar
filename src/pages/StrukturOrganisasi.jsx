import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, User, ShieldCheck, Users, Briefcase, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL, IMG_BASE_URL } from '../utils/api';

const StrukturOrganisasi = () => {
  const [pejabatList, setPejabatList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/struktur`);
        const cleanData = response.data.data || response.data;
        setPejabatList(cleanData);
      } catch (error) {
        console.error("Gagal sinkronisasi data:", error);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchData();
  }, []);

  const getPejabatByLevel = (levelCode) => {
    return pejabatList.find(p => p.level === levelCode) || null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const PejabatCard = ({ data, colorClass, isDark = false, large = false, badgeText = "", placeholder, icon: Icon }) => {
    const [imgError, setImgError] = useState(false);
    const displayData = data || { nama: "Belum Terisi", jabatan: placeholder, url: null };

    const getFotoUrl = () => {
      if (!displayData.url) return null;
      const fileName = displayData.url.split('/').pop();
      const baseHost = IMG_BASE_URL.split('/uploads/')[0];
      return `${baseHost}/uploads/struktur/${fileName}`;
    };

    const fotoUrl = getFotoUrl();

    return (
      <motion.div variants={itemVariants} className={`relative pt-10 h-full ${!data ? 'opacity-40 grayscale' : ''}`}>
        {badgeText && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
            <span className="bg-[#D4AF37] text-[#020617] text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-[0.1em] flex items-center gap-2 shadow-xl border border-white/10">
              <Star size={10} fill="currentColor" /> {badgeText}
            </span>
          </div>
        )}
        
        <div className={`group relative h-full overflow-hidden ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-xl'} border rounded-[40px] p-7 transition-all duration-500 hover:-translate-y-3`}>
          <div className={`relative w-full ${large ? 'aspect-[3/4.2]' : 'aspect-[3/4]'} mb-6 rounded-2xl overflow-hidden border ${isDark ? 'border-slate-800' : 'border-slate-100'} bg-slate-950 flex items-center justify-center`}>
            {fotoUrl && !imgError ? (
              <img 
                src={fotoUrl} 
                alt={displayData.nama} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={() => setImgError(true)}
              />
            ) : (
              <User size={large ? 60 : 45} className="text-slate-800" />
            )}
          </div>

          <div className="relative">
            <div className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] mb-3 ${colorClass}`}>
              {Icon && <Icon size={12} />} Jabatan Struktural
            </div>
            <h3 className={`text-base font-bold leading-snug tracking-normal mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {displayData.nama}
            </h3>
            <div className={`h-0.5 w-10 mb-4 rounded-full ${colorClass.replace('text', 'bg')} opacity-40`} />
            <p className="text-[10px] text-slate-500 font-semibold uppercase italic tracking-wide leading-relaxed">
              {displayData.jabatan}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-[#020617] flex flex-col items-center justify-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full mb-6"
            />
            <p className="text-[#D4AF37] font-bold uppercase tracking-[0.4em] text-[10px]">Loading Structure</p>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative z-10 flex flex-col w-full"
          >
            {/* Main Content Wrap */}
            <div className="max-w-[1400px] mx-auto px-8 py-32 w-full">
              
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center mb-32">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white uppercase mb-6 leading-tight">
                  Struktur <span className="text-[#D4AF37] italic">Organisasi</span>
                </h1>
                <div className="flex items-center justify-center gap-6">
                  <div className="h-px w-12 bg-slate-700" />
                  <p className="text-slate-400 text-xs md:text-lg font-medium tracking-[0.3em] uppercase">
                    Lembaga Pemasyarakatan Kelas IIB Blitar
                  </p>
                  <div className="h-px w-12 bg-slate-700" />
                </div>
              </motion.div>

              {/* Level 1 */}
              <div className="flex justify-center mb-40 w-full">
                <div className="w-full max-w-[320px]">
                  <PejabatCard 
                      data={getPejabatByLevel('level_1')} 
                      colorClass="text-[#D4AF37]" 
                      isDark={true} 
                      large={true} 
                      badgeText="Kepala Lembaga Pemasyarakatan"
                      placeholder="KALAPAS"
                      icon={ShieldCheck}
                  />
                </div>
              </div>

              {/* Grid System */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 w-full items-start">
                
                {/* Column TU */}
                <div className="flex flex-col gap-10">
                  <PejabatCard data={getPejabatByLevel('level_2_tu')} colorClass="text-blue-400" isDark={true} badgeText="KASUBAG TU" placeholder="KASUBAG TATA USAHA" icon={Users} />
                  <div className="flex flex-col gap-8 pl-6 border-l border-slate-800">
                    <PejabatCard data={getPejabatByLevel('level_3_tu_1')} colorClass="text-slate-500" placeholder="KAUR KEP & KEU" />
                    <PejabatCard data={getPejabatByLevel('level_3_tu_2')} colorClass="text-slate-500" placeholder="KAUR UMUM" />
                  </div>
                </div>

                {/* Column Kamtib */}
                <div className="flex flex-col gap-10">
                  <PejabatCard data={getPejabatByLevel('level_2_kamtib')} colorClass="text-amber-500" isDark={true} badgeText="KASI ADKAMTIB" placeholder="KASI ADKAMTIB" icon={ShieldCheck} />
                  <div className="flex flex-col gap-8 pl-6 border-l border-slate-800">
                    <PejabatCard data={getPejabatByLevel('level_3_kamtib_1')} colorClass="text-slate-500" placeholder="KASUBSI KEAMANAN" />
                    <PejabatCard data={getPejabatByLevel('level_3_kamtib_2')} colorClass="text-slate-500" placeholder="KASUBSI PELAPORAN" />
                  </div>
                </div>

                {/* Column Binadik */}
                <div className="flex flex-col gap-10">
                  <PejabatCard data={getPejabatByLevel('level_2_binadik')} colorClass="text-emerald-500" isDark={true} badgeText="KASI BINADIK" placeholder="KASI BINADIK & GIATJA" icon={Zap} />
                  <div className="flex flex-col gap-8 pl-6 border-l border-slate-800">
                    <PejabatCard data={getPejabatByLevel('level_3_binadik_1')} colorClass="text-slate-500" placeholder="KASUBSI REGISTRASI" />
                    <PejabatCard data={getPejabatByLevel('level_3_binadik_2')} colorClass="text-slate-500" placeholder="KASUBSI PERAWATAN" />
                    <PejabatCard data={getPejabatByLevel('level_3_binadik_3')} colorClass="text-slate-500" placeholder="KASUBSI GIATJA" />
                  </div>
                </div>

                {/* Column KPLP */}
                <div className="flex flex-col gap-10">
                  <PejabatCard data={getPejabatByLevel('level_2_kplp')} colorClass="text-rose-500" isDark={true} badgeText="KA. KPLP" placeholder="KA. KPLP" icon={Briefcase} />
                </div>
              </div>
            </div>
            
            {/* Spacer bawah untuk memastikan footer tidak bertumpuk */}
            <div className="h-40 w-full pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StrukturOrganisasi;