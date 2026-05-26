import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// --- IMPORT MAINTENANCE GUARD ---
import MaintenanceGuard from "./utils/MaintenanceGuard"; 

// Komponen Pendukung
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";
import NavbarAdmin from "./components/admin/NavbarAdmin";
import SidebarAdmin from "./components/admin/SidebarAdmin";
import FooterAdmin from "./components/admin/FooterAdmin";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Halaman Dasar & Lainnya
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Berita from "./pages/Berita";
import DetailBeritaUser from "./pages/DetailBeritaUser";
import Informasi from "./pages/Informasi";
import FormLayanan from "./pages/FormLayanan";
import Struktur from "./pages/StrukturOrganisasi";
import VisiMisi from "./pages/VisiMisi";
import Sejarah from "./pages/Sejarah";
import Profil from "./pages/Profil";
import Lakip from "./pages/Lakip";
import Dipa from "./pages/Dipa";
import Renstra from "./pages/Renstra";
import PerjanjianKerja from "./pages/PerjanjianKerja";
import KaryaWBP from "./pages/KaryaWbp";
import Pengaduan from "./pages/Pengaduan";
import TataTertib from "./pages/TataTertib";
import AlurKunjungan from "./pages/AlurKunjungan";
import HakWargaBinaan from "./pages/HakWargaBinaan";
import LayananIntegrasi from "./pages/LayananIntegrasi";

// Admin Pages
import DashboardAdmin from "./pages/administrator/Dashboard";
import KelolaBerita from "./pages/administrator/KelolaBerita";
import LayananPublik from "./pages/administrator/LayananPublik";
import TambahBerita from './pages/administrator/TambahBerita';
import DetailBeritaAdmin from './pages/administrator/DetailBerita';
import EditBerita from './pages/administrator/EditBerita';
import DataStruktur from "./pages/administrator/DataStruktur";
import InformasiPublik from "./pages/administrator/InformasiPublik";
import AdminAlurKunjungan from "./pages/administrator/AdminAlurKunjungan";
import AdminKaryaWbp from "./pages/administrator/AdminKaryaWbp";
import DaftarPesanan from "./pages/administrator/DaftarPesanan";
import KelolaVideo from "./pages/administrator/KelolaVideo";
import AdminPengaduan from "./pages/administrator/AdminPengaduan";
import GaleriKegiatan from "./pages/administrator/GaleriKegiatan";
import AdminUsers from "./pages/administrator/AdminUsers";
import AdminSlider from "./pages/administrator/AdminSlider";
import AdminIntegrasi from "./pages/administrator/AdminIntegrasi";
import AdminTataTertib from "./pages/administrator/AdminTataTertib";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MaintenanceGuard>
      <ScrollToTop />
      
      <Routes>
        {/* 1. LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 2. REDIRECT BASE ADMIN */}
        <Route path="/administrator" element={<Navigate to="/admin/dashboard" replace />} />

        {/* 3. GROUP ADMIN (PROTECTED & ROLE-BASED) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-slate-50 flex overflow-x-hidden relative">
                {/* Sidebar menerima state untuk toggle di mobile */}
                <SidebarAdmin isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                
                {/* Overlay untuk mobile sidebar */}
                <div 
                  className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] transition-opacity duration-300 lg:hidden ${
                    sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                />
                
                <div className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300 lg:ml-72"> 
                  <div className="sticky top-0 z-40">
                    <NavbarAdmin onOpenSidebar={() => setSidebarOpen(true)} />
                  </div>
                  
                  <main className="flex-1 p-3 md:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
                    <Routes>
                      {/* Default Admin Page */}
                      <Route index element={<Navigate to="dashboard" replace />} />
                      
                      {/* AKSES SEMUA ADMIN: Dashboard boleh diakses semua yang sudah login */}
                      <Route path="dashboard" element={<DashboardAdmin />} />
                      <Route path="galeri-kegiatan" element={<GaleriKegiatan/>} />
                      
                      {/* AKSES UNTUK PENGAWAS */}
                      <Route element={<ProtectedRoute allowedRoles={'pengawas'}/>}>
                        <Route path="list-pengaduan" element={<AdminPengaduan/>}/>
                        <Route path="hak-akses" element={<AdminUsers/>}/>
                      </Route>

                      {/* FILTER ROLE: BINADIK & PENGAWAS */}
                      <Route element={<ProtectedRoute allowedRoles={['pengawas', 'binadik']}/>}>
                        <Route path="persyaratan-integrasi" element={<AdminIntegrasi/>} />
                      </Route>

                      {/* FILTER ROLE: BINADIK, ADKAMTIB & PENGAWAS */}
                      <Route element={<ProtectedRoute allowedRoles={['pengawas', 'binadik', 'adkamtib']}/>}>
                        <Route path="layanan" element={<LayananPublik/>} />
                        <Route path="alur-kunjungan" element={<AdminAlurKunjungan/>} />
                      </Route>

                      {/* FILTER ROLE: Humas, ADKAMTIB & PENGAWAS */}
                      <Route element={<ProtectedRoute allowedRoles={['pengawas', 'humas', 'adkamtib']}/>}>
                        <Route path="tata-tertib" element={<AdminTataTertib/>} />
                      </Route>

                      {/* FILTER ROLE: HUMAS & PENGAWAS */}
                      <Route element={<ProtectedRoute allowedRoles={['humas', 'pengawas']} />}>
                        <Route path="berita" element={<KelolaBerita/>} />
                        <Route path="berita/tambah" element={<TambahBerita/>} />
                        <Route path="berita/detail/:id" element={<DetailBeritaAdmin/>} />
                        <Route path="berita/edit/:id" element={<EditBerita/>} />
                        <Route path="informasi" element={<InformasiPublik/>} />
                        <Route path="struktur" element={<DataStruktur/>} />
                        <Route path="video" element={<KelolaVideo/>} />
                        <Route path="set-slider" element={<AdminSlider/>} />
                      </Route>

                      {/* FILTER ROLE: BINADIK, HUMAS & PENGAWAS */}
                      <Route element={<ProtectedRoute allowedRoles={['binadik', 'humas', 'pengawas']} />}>
                        <Route path="karya-wbp" element={<AdminKaryaWbp/>} />
                        <Route path="pesanan" element={<DaftarPesanan/>} />
                      </Route>

                      {/* FILTER ROLE: KEAMANAN (ADKAMTIB, KPLP & PENGAWAS) */}
                      <Route element={<ProtectedRoute allowedRoles={['adkamtib', 'kplp', 'pengawas']} />}>
                        <Route path="keamanan" element={<div className="p-6 bg-white rounded-xl shadow-sm">Modul Keamanan (ADKAMTIB/KPLP)</div>} />
                      </Route>

                      {/* Catch-all untuk path admin yang salah */}
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </main>

                  <FooterAdmin />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 4. GROUP USER (PUBLIC) */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <NavbarComponent />
              <main className="flex-grow"> 
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/berita" element={<Berita />} />
                  <Route path="/karya-wbp" element={<KaryaWBP />} />
                  <Route path="/informasi" element={<Informasi />} />
                  <Route path="/informasi/lakip" element={<Lakip />} />
                  <Route path="/informasi/dipa" element={<Dipa />} />
                  <Route path="/informasi/rencana-strategis" element={<Renstra />} />
                  <Route path="/informasi/perjanjian-kerja" element={<PerjanjianKerja />} />
                  <Route path="/informasi/tata-tertib" element={<TataTertib />} />
                  <Route path="/informasi/alur-kunjungan" element={<AlurKunjungan />} />
                  <Route path="/informasi/hak-wbp" element={<HakWargaBinaan />} />
                  <Route path="/form-layanan" element={<FormLayanan />} />
                  <Route path="/layanan/pengaduan" element={<Pengaduan />} />
                  <Route path="/layanan/layanan-integrasi" element={<LayananIntegrasi />} />
                  <Route path="/berita/:id" element={<DetailBeritaUser />} />
                  <Route path="/profil/profil" element={<Profil />} />
                  <Route path="/profil/visi-misi" element={<VisiMisi />} />
                  <Route path="/profil/struktur" element={<Struktur />} />
                  <Route path="/profil/sejarah" element={<Sejarah />} />
                  
                  {/* Catch-all untuk path public yang salah */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <FooterComponent />
            </div>
          }
        />
      </Routes>
    </MaintenanceGuard>
  );
}

export default App;