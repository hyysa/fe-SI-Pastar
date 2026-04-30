import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocViewer from '../DocViewer';
import { API_BASE_URL } from '../utils/api'; // Pastikan path ini sesuai dengan config API Anda
import { Loader2 } from 'lucide-react';

const Dipa = () => {
  const [dataDipa, setDataDipa] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil BASE_URL tanpa /api untuk akses file fisik (pdf/cover)
  const BASE_URL = API_BASE_URL.replace('/api', '');

  useEffect(() => {
    const fetchDipa = async () => {
      try {
        setLoading(true);
        // Ambil data dari endpoint informasi
        const response = await axios.get(`${API_BASE_URL}/informasi`);
        
        // Filter data yang kategorinya adalah 'DIPA' (sesuaikan dengan case-sensitive di DB)
        const filteredData = response.data
          .filter(item => item.kategori.toUpperCase() === 'DIPA')
          .map(item => ({
            name: item.nama_dokumen,
            cover: `${BASE_URL}${item.path_cover}`, // Gabungkan dengan URL Backend
            fileUrl: `${BASE_URL}${item.path_pdf}`  // Gabungkan dengan URL Backend
          }));

        setDataDipa(filteredData);
      } catch (error) {
        console.error("Gagal mengambil data DIPA:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDipa();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-gold-dignity mb-4" size={48} />
        <p className="tracking-widest uppercase text-xs font-bold">Memuat Data DIPA...</p>
      </div>
    );
  }

  return (
    <DocViewer 
      title="DIPA" 
      description="Daftar Isian Pelaksanaan Anggaran sebagai bentuk transparansi pengelolaan keuangan Lapas Blitar."
      data={dataDipa}
    />
  );
};

export default Dipa;