import React, { useState, useEffect } from 'react';
import { FaPlus, FaYoutube, FaEdit, FaTrashAlt, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../utils/api';

const KelolaVideo = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        kategori: 'UTAMA',
        judul: '',
        deskripsi: '',
        url: ''
    });

    // Perbaikan: Pastikan endpoint sesuai dengan app.use('/api/videos', ...) di index.js
    // Jika API_BASE_URL adalah "http://localhost:5000/api", maka API_URL jadi "http://localhost:5000/api/videos"
    const API_URL = `${API_BASE_URL}/videos`;

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        let videoId = "";
        try {
            if (url.includes("v=")) {
                videoId = url.split("v=")[1].split("&")[0];
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1].split("?")[0];
            } else if (url.includes("embed/")) {
                videoId = url.split("embed/")[1].split("?")[0];
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch (error) {
            return null;
        }
    };

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            // Pastikan mengambil data dari response.data
            setVideos(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            // Tampilkan pesan error jika server mati atau 404
            Swal.fire('Error', 'Gagal menyambung ke server API', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({ kategori: 'UTAMA', judul: '', deskripsi: '', url: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (video) => {
        setIsEditMode(true);
        setCurrentId(video.id);
        setFormData({
            kategori: video.kategori,
            judul: video.judul,
            deskripsi: video.deskripsi || '',
            url: video.url
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi Sederhana
        if (!formData.judul || !formData.url) {
            return Swal.fire('Error', 'Judul dan URL wajib diisi!', 'error');
        }

        try {
            Swal.showLoading();
            if (isEditMode) {
                await axios.patch(`${API_URL}/${currentId}`, formData);
                Swal.fire('Berhasil!', 'Data video telah diperbarui.', 'success');
            } else {
                await axios.post(API_URL, formData);
                Swal.fire('Berhasil!', 'Video baru telah ditambahkan.', 'success');
            }
            setIsModalOpen(false);
            fetchVideos(); 
        } catch (error) {
            console.error("Error Detail:", error.response?.data);
            Swal.fire('Error', error.response?.data?.message || 'Gagal memproses data ke server.', 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah yakin?',
            text: "Video akan dihapus permanen dari database!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/${id}`);
                    Swal.fire('Terhapus!', 'Video berhasil dihapus.', 'success');
                    fetchVideos();
                } catch (error) {
                    Swal.fire('Error', 'Gagal menghapus data.', 'error');
                }
            }
        });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-gray-600">Sinkronisasi Database...</p>
        </div>
    );

    return (
        <div className="relative space-y-6 p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kelola Video & Identitas</h1>
                    <p className="text-sm text-gray-500">Manajemen konten video dokumentasi Lapas.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg"
                >
                    <FaPlus size={14} />
                    <span className="text-sm font-semibold">Tambah Video</span>
                </button>
            </div>

            {/* Content Grid */}
            {videos.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-20 text-center text-gray-400">
                    Belum ada data video di database.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video) => (
                        <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-all hover:shadow-md">
                            <div className="aspect-video bg-slate-900 relative">
                                {video.url ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={getYouTubeEmbedUrl(video.url)}
                                        title={video.judul}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white/20">
                                        <FaYoutube size={60} />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-md">
                                        {video.kategori}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{video.judul}</h3>
                                <p className="text-sm text-gray-600 mb-6 line-clamp-2 italic">
                                    {video.deskripsi ? `"${video.deskripsi}"` : "Tidak ada deskripsi."}
                                </p>
                                <div className="flex items-center justify-between border-t pt-4">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => openEditModal(video)}
                                            className="p-2.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(video.id)} 
                                            className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <FaTrashAlt size={16} />
                                        </button>
                                    </div>
                                    <a href={video.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium">
                                        Buka YouTube <FaExternalLinkAlt size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Video' : 'Tambah Video Baru'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
                                <select 
                                    name="kategori" value={formData.kategori} onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="UTAMA">UTAMA</option>
                                    <option value="MASKOT">MASKOT</option>
                                    <option value="AUDIO">AUDIO</option>
                                    <option value="SEMANGAT">SEMANGAT</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Video</label>
                                <input 
                                    type="text" name="judul" value={formData.judul} onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">URL YouTube</label>
                                <input 
                                    type="text" name="url" value={formData.url} onChange={handleChange}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                                <textarea 
                                    name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="3"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                ></textarea>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50">Batal</button>
                                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">{isEditMode ? 'Simpan Perubahan' : 'Simpan Video'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KelolaVideo;