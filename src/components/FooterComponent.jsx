import logoKemenimipas from '../assets/img/logo_kemenimipas.png';
import logoPastar from "../assets/img/logo_zi_lapas_blitar.png";

const FooterComponent = () => {
  return (
    <footer className="relative bg-[#020617] border-t border-white/5 pt-16 pb-8 px-6 overflow-hidden">
      {/* Efek Cahaya Halus di Footer */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gold-dignity/5 blur-[100px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Grid ditingkatkan menjadi 5 kolom untuk desktop agar ada ruang bagi Maps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Kolom 1: Identitas */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logoPastar} alt="Logo" className="h-10 w-auto" />
              <span className="text-white font-bold text-xl tracking-tight">SI-PASTAR</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sistem Informasi Pelayanan Terpadu dan Transparan Lembaga Pemasyarakatan Kelas IIB Blitar.
            </p>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div>
            <h4 className="text-gold-dignity font-semibold mb-6">Informasi</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Tata Tertib & Ketentuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Alur Kunjungan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Karya WBP</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hak Warga Binaan</a></li>
            </ul>
          </div>

          {/* Kolom 3: Profil */}
          <div>
            <h4 className="text-gold-dignity font-semibold mb-6">Profil</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="/profil/visi-misi" className="hover:text-white transition-colors">Visi & Misi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Struktur Organisasi</a></li>
              <li><a href="/profil/sejarah" className="hover:text-white transition-colors">Sejarah</a></li>
            </ul>
          </div>

          {/* Kolom 4: Kontak */}
          <div>
            <h4 className="text-gold-dignity font-semibold mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-gold-dignity">📍</span>
                <span className="leading-relaxed">Jl. Merapi No.02, Kepanjen Lor, Kota Blitar</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold-dignity">📞</span>
                <span>(0342) 801743</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold-dignity">✉️</span>
                <span className="break-all">kontak@lapasblitar.go.id</span>
              </li>
            </ul>
          </div>

          {/* Kolom 5: Maps (Berada di sisi kanan Hubungi Kami) */}
          <div className="lg:col-span-1">
            <h4 className="text-gold-dignity font-semibold mb-6">Lokasi</h4>
            <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10 grayscale-[0.8] hover:grayscale-0 transition-all duration-500 shadow-2xl">
              <iframe 
                title="Lokasi Lapas Blitar"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.0340835080965!2d112.16347201106211!3d-8.0980065918971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78ec132546ccd7%3A0x33d82ab2cf296a4c!2sLembaga%20Pemasyarakatan%20Kelas%20II%20B%20Blitar!5e0!3m2!1sid!2sid!4v1768120790118!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

        </div>

        {/* Garis Bawah & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center">
            &copy; {new Date().getFullYear()} Lembaga Pemasyarakatan Kelas IIB Blitar. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gold-dignity transition-colors text-xs">Kebijakan Privasi</a>
            <a href="#" className="text-gray-500 hover:text-gold-dignity transition-colors text-xs">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;