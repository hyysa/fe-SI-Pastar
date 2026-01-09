import { Routes, Route } from "react-router-dom";

import NavbarComponet from "./components/NavbarComponent";
import FooterComponet from "./components/FooterComponent";
import ScrollToTop from "./components/ScrollToTop";

import Homepage from "./pages/Homepage";
import Berita from "./pages/Berita";
import Informasi from "./pages/Informasi";
import FormLayanan from "./pages/FormLayanan";
import DetailBerita from "./pages/DetailBerita";
import Struktur from "./pages/Struktur";

function App() {
  return (
    <div>
      <ScrollToTop/>
      <NavbarComponet />
      <Routes>
        <Route path="" Component={Homepage}/>
        <Route path="/berita" Component={Berita}/>
        <Route path="/informasi" Component={Informasi}/>
        <Route path="/form-layanan" Component={FormLayanan}/>
        <Route path="/detail-berita" Component={DetailBerita}/>
        <Route path="/profil/Struktur" Component={Struktur}/>
      </Routes>
      <FooterComponet />
    </div>
  );
}

export default App
