import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocViewer from '../DocViewer';
import { API_BASE_URL } from '../utils/api'; 
import { Loader2 } from 'lucide-react';

const PerjanjianKerja = () => {
  const [dataPK, setDataPK] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil BASE_URL tanpa /api untuk akses file fisik (pdf/cover)
  const BASE_URL = API_BASE_URL.replace('/api', '');

  useEffect(() => {
    const fetchPK = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/informasi`);
        
        // Filter data yang kategorinya adalah 'PERJANJIAN KERJA' 
        // .toUpperCase() digunakan untuk menghindari kesalahan penulisan huruf besar/kecil
        const filteredData = response.data
          .filter(item => item.kategori.toUpperCase() === 'PERJANJIAN KERJA')
          .map(item => ({
            name: item.nama_dokumen,
            cover: `${BASE_URL}${item.path_cover}`,
            fileUrl: `${BASE_URL}${item.path_pdf}`
          }));

        setDataPK(filteredData);
      } catch (error) {
        console.error("Gagal mengambil data Perjanjian Kerja:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPK();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
        <p className="tracking-widest uppercase text-xs font-bold text-amber-500/80">Memuat Perjanjian Kerja...</p>
      </div>
    );
  }

  return (
    <DocViewer 
      title="Perjanjian Kerja" 
      description="Dokumen kesepakatan antara penerima amanah dengan pemberi amanah atas kinerja terukur berdasarkan tugas, fungsi, dan wewenang di Lapas Blitar."
      data={dataPK}
    />
  );
};

export default PerjanjianKerja;