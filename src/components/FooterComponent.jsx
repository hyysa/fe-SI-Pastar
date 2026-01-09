import logoKemenimipas from '../assets/img/logo_kemenimipas.png';

const FooterComponent = () => {
  return (
    <footer className="relative bg-[#020617] border-t border-white/5 pt-16 pb-8 px-6 overflow-hidden">
      {/* Efek Cahaya Halus di Footer */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gold-dignity/5 blur-[100px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Kolom 1: Identitas */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logoKemenimipas} alt="Logo" className="h-10 w-auto" />
              <span className="text-white font-bold text-xl tracking-tight">SI-PASTAR</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sistem Informasi Pelayanan Terpadu dan Transparan Lembaga Pemasyarakatan Kelas IIB Blitar. Berkomitmen memberikan layanan pemasyarakatan terbaik.
            </p>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div>
            <h4 className="text-gold-dignity font-semibold mb-6">Navigasi</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="/berita" className="hover:text-white transition-colors">Berita Terkini</a></li>
              <li><a href="/form-layanan" className="hover:text-white transition-colors">Layanan Online</a></li>
              <li><a href="#profil" className="hover:text-white transition-colors">Profil Instansi</a></li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Populer */}
          <div>
            <h4 className="text-gold-dignity font-semibold mb-6">Profil</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Visi & Misi</a></li>
              <li><a href="/berita" className="hover:text-white transition-colors">Struktur Organisasi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sejarah</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrasi & Remisi</a></li>
            </ul>
          </div>

          {/* Kolom 4: Kontak */}
          <div>
            <h4 className="text-gold-dignity font-semibold mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-gold-dignity">📍</span>
                <span>Jl. Merapi No.02, Kepanjen Lor, Kec. Kepanjenkidul, Kota Blitar, Jawa Timur 66117</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold-dignity">📞</span>
                <span>(0342) 801743</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold-dignity">✉️</span>
                <span>kontak@lapasblitar.go.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Bawah & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center">
            &copy; {new Date().getFullYear()} Lembaga Pemasyarakatan Kelas IIB Blitar. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gold-dignity transition-colors">
              <span className="text-xs">Kebijakan Privasi</span>
            </a>
            <a href="#" className="text-gray-500 hover:text-gold-dignity transition-colors">
              <span className="text-xs">Syarat & Ketentuan</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;