import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import DocViewer from '../DocViewer';

const Lakip = () => {
  const [lakipList, setLakipList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLakip = async () => {
      try {
        // Mengambil data dari endpoint yang sudah kita buat
        const response = await axios.get(`${API_BASE_URL}/informasi`);
        const BASE_URL = API_BASE_URL.replace('/api', '');
        // Filter data yang hanya berkategori 'LAKIP'
        const filteredData = response.data.filter(item => item.kategori === 'LAKIP');
        
        // Mapping agar sesuai dengan props yang dibutuhkan DocViewer
        const mappedData = filteredData.map(item => ({
          name: item.nama_dokumen,
          // Tambahkan prefix URL backend agar gambar/pdf bisa diakses
          cover: `${BASE_URL}${item.path_cover}`, 
          fileUrl: `${BASE_URL}${item.path_pdf}`
        }));

        setLakipList(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data LAKIP:", error);
        setLoading(false);
      }
    };

    fetchLakip();
  }, []);

  if (loading) return <div className="p-10 text-center">Memuat Dokumen...</div>;

  return (
    <DocViewer 
      title="LAKIP" 
      description="Laporan Akuntabilitas Kinerja Instansi Pemerintah Lapas Kelas IIB Blitar."
      data={lakipList}
    />
  );
};

export default Lakip;