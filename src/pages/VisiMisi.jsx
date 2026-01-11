import { useNavigate } from 'react-router-dom';

const VisiMisi = () => {
  const navigate = useNavigate();

  const misiData = [
    {
      id: "01",
      text: "Mewujudkan pelayanan tahanan dan pembinaan warga binaan yang optimal berbasis pada perlindungan hak asasi manusia.",
    },
    {
      id: "02",
      text: "Meningkatkan profesionalisme sumber daya manusia petugas pemasyarakatan yang berintegritas dan tangguh.",
    },
    {
      id: "03",
      text: "Mengoptimalkan sarana dan prasarana pendukung pelayanan publik yang modern dan transparan.",
    },
    {
      id: "04",
      text: "Menjalin sinergitas dengan instansi penegak hukum dan stakeholder terkait demi terciptanya keamanan dan ketertiban.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* --- HEADER SECTION --- */}
      <section className="bg-midnight text-white pt-40 pb-32 px-6 relative overflow-hidden">
        {/* Dekorasi Latar Belakang */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-dignity/5 skew-x-12 translate-x-32"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h2 className="text-gold-dignity font-black tracking-[0.4em] text-sm uppercase mb-4">
            Legalitas & Jati Diri
          </h2>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Visi & <span className="text-gold-dignity">Misi</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Pedoman utama Lapas Kelas IIB Blitar dalam menjalankan amanah pembinaan dan pelayanan pemasyarakatan.
          </p>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* BAGIAN VISI (KIRI/ATAS) */}
          <div className="lg:col-span-5">
            <div className="bg-gold-dignity p-12 rounded-[3.5rem] shadow-2xl sticky top-32">
              <div className="inline-block bg-midnight text-white px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-8">
                Visi Kami
              </div>
              <h3 className="text-midnight text-3xl md:text-4xl font-black leading-tight italic">
                "Menjadi Lembaga Pemasyarakatan yang Profesional, Akuntabel, dan Berorientasi pada Pelayanan Prima."
              </h3>
              <div className="mt-10 h-1 w-24 bg-midnight/20"></div>
            </div>
          </div>

          {/* BAGIAN MISI (KANAN) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4 mb-8 pl-4">
              <h4 className="text-2xl font-black text-midnight uppercase tracking-tighter">Misi Strategis</h4>
              <div className="h-[2px] flex-grow bg-slate-100"></div>
            </div>

            {misiData.map((misi) => (
              <div 
                key={misi.id}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-gold-dignity/50 transition-all duration-500 flex gap-8 items-start"
              >
                <div className="text-4xl font-black text-slate-100 group-hover:text-gold-dignity transition-colors duration-500">
                  {misi.id}
                </div>
                <div className="space-y-2">
                  <p className="text-slate-600 text-lg leading-relaxed font-medium group-hover:text-midnight transition-colors italic">
                    {misi.text}
                  </p>
                </div>
              </div>
            ))}

            {/* Quote Tambahan */}
            <div className="mt-12 p-10 bg-midnight rounded-[3rem] text-center">
              <p className="text-gold-dignity text-sm font-black tracking-widest uppercase mb-2">Motto Pelayanan</p>
              <h5 className="text-white text-3xl font-black tracking-tighter italic">"Melayani dengan Hati, Membina dengan Dedikasi"</h5>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default VisiMisi;