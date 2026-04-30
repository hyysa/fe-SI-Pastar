import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocViewer from '../DocViewer';
import { API_BASE_URL } from '../utils/api'; 
import { Loader2 } from 'lucide-react';

const Renstra = () => {
  const [dataRenstra, setDataRenstra] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil BASE_URL tanpa /api untuk akses file (pdf/cover)
  const BASE_URL = API_BASE_URL.replace('/api', '');

  useEffect(() => {
    const fetchRenstra = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/informasi`);
        
        // PERBAIKAN DI SINI:
        // Kita ubah filter agar mencari teks "RENCANA STRATEGIS" 
        // karena teks di database "Rencana Strategis" di-toUpperCase menjadi "RENCANA STRATEGIS"
        const filteredData = response.data
          .filter(item => 
            item.kategori.toUpperCase() === 'RENCANA STRATEGIS' || 
            item.kategori.toUpperCase() === 'RENSTRA'
          )
          .map(item => ({
            name: item.nama_dokumen,
            cover: `${BASE_URL}${item.path_cover}`,
            fileUrl: `${BASE_URL}${item.path_pdf}`
          }));

        setDataRenstra(filteredData);
      } catch (error) {
        console.error("Gagal mengambil data RENSTRA:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRenstra();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center">
            <Loader2 className="animate-spin text-amber-500" size={60} />
            <div className="absolute text-[10px] font-bold text-amber-500">LPS</div>
        </div>
        <p className="mt-4 tracking-[0.5em] uppercase text-[10px] font-black text-amber-500/80">
            Memuat Rencana Strategis...
        </p>
      </div>
    );
  }

  return (
    <DocViewer 
      title="Rencana Strategis" 
      description="Dokumen perencanaan jangka menengah yang menetapkan visi, misi, tujuan, strategi, kebijakan, program, dan kegiatan Lapas Kelas IIB Blitar."
      data={dataRenstra}
    />
  );
};

export default Renstra;