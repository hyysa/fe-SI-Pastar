import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import NavbarComponet from "./components/NavbarComponent";
import FooterComponet from "./components/FooterComponent";
import NavbarAdmin from "./components/admin/NavbarAdmin";
import SidebarAdmin from "./components/admin/SidebarAdmin";
import FooterAdmin from "./components/admin/FooterAdmin";
import ScrollToTop from "./components/ScrollToTop";

// Halaman User
import Homepage from "./pages/Homepage";
import Berita from "./pages/Berita";
import Informasi from "./pages/Informasi";
import FormLayanan from "./pages/FormLayanan";
import DetailBerita from "./pages/DetailBerita";
import Struktur from "./pages/Struktur";
import VisiMisi from "./pages/VisiMisi";
import Sejarah from "./pages/Sejarah";

// Halaman Admin
import DashboardAdmin from "./pages/administrator/Dashboard";
import KelolaBerita from "./pages/administrator/KelolaBerita";
import LayananPublik from "./pages/administrator/LayananPublik";

//Function Admin
import TambahBerita from './pages/administrator/TambahBerita';

function App() {
  // State untuk mengontrol Sidebar di perangkat Mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <ScrollToTop />
      
      <Routes>
        {/* --- KELOMPOK RUTE USER (PUBLIC) --- */}
        <Route
          path="/*"
          element={
            <>
              <NavbarComponet />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/berita" element={<Berita />} />
                <Route path="/informasi" element={<Informasi />} />
                <Route path="/form-layanan" element={<FormLayanan />} />
                <Route path="/detail-berita" element={<DetailBerita />} />
                <Route path="/profil/visi-misi" element={<VisiMisi />} />
                <Route path="/profil/struktur" element={<Struktur />} />
                <Route path="/profil/sejarah" element={<Sejarah />} />
              </Routes>
              <FooterComponet />
            </>
          }
        />

        {/* --- GROUP HALAMAN ADMINISTRATOR --- */}
        <Route
          path="/admin/*"
          element={
            <div className="min-h-screen bg-gray-50 flex">
              {/* Sidebar: Menerima state dan fungsi untuk menutup */}
              <SidebarAdmin isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
              
              {/* Konten Utama: ml-0 di mobile, ml-72 di desktop */}
              <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:ml-72"> 
                
                {/* Navbar Admin: onOpenSidebar memicu state menjadi true */}
                <NavbarAdmin onOpenSidebar={() => setSidebarOpen(true)} />
                
                <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
                  <Routes>
                    {/* Redirect dari /admin ke /admin/dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />
                    
                    <Route path="dashboard" element={<DashboardAdmin />} />
                    {/* Tambahkan rute admin lainnya di sini */}
                    <Route path="berita" element={<KelolaBerita/>} />
                    <Route path="berita/tambah" element={<TambahBerita/>} />
                    <Route path="layanan" element={<LayananPublik/>} />
                    <Route path="informasi" element={<div>Halaman Data Informasi</div>} />
                    <Route path="visi-misi" element={<div>Halaman Visi Misi</div>} />
                    <Route path="struktur" element={<div>Halaman Struktur</div>} />
                    <Route path="sejarah" element={<div>Halaman Sejarah</div>} />
                  </Routes>
                </main>

                <FooterAdmin />
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;