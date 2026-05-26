import logoKemenimipas from "../../assets/img/logo_kemenimipas.png";
import logoLapas from "../../assets/img/logo_zi_lapas_blitar.png";

/**
 * Fungsi untuk menghasilkan HTML cetak kartu kunjungan
 * @param {Object} data - Data dari database pendaftaran pengunjung
 */
export const generatePrintHTML = (data) => {
  // --- 1. KONFIGURASI URL SERVER (SESUAIKAN DI SINI) ---
  // Pastikan URL ini mengarah ke backend Anda agar foto bisa dipanggil
  const BASE_URL = "http://localhost:5000"; 
  
  // URL Lengkap Foto: Base URL + Folder Upload + Nama File dari DB
  const fotoUrl = data.foto 
    ? `${BASE_URL}/uploads/pendaftaran/${data.foto}` 
    : '';

  // --- 2. PARSING DATA PENGIKUT ---
  // Karena kolom 'pengikut' di DB bertipe TEXT, kita perlu JSON.parse
  let pengikut = [];
  try {
    pengikut = typeof data.pengikut === 'string' 
      ? JSON.parse(data.pengikut) 
      : (Array.isArray(data.pengikut) ? data.pengikut : []);
  } catch (e) {
    pengikut = [];
  }

  // --- 3. TEMPLATE HTML & CSS ---
  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Cetak Kartu Kunjungan - ${data.nomorAntrian || '0'}</title>
        <style>
          @page { 
            size: A4; 
            margin: 15mm; 
          }
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 0;
          }
          
          /* KOP SURAT */
          .header-table {
            width: 100%;
            border-bottom: 3px solid #000;
            padding-bottom: 10px;
          }
          .logo-col { width: 80px; }
          .logo { width: 80px; height: auto; }
          .header-text { text-align: center; }
          .header-text h2 { margin: 0; font-size: 12px; font-weight: normal; text-transform: uppercase; }
          .header-text h1 { margin: 2px 0; font-size: 15px; font-weight: bold; text-transform: uppercase; }
          .header-text p { margin: 0; font-size: 10px; }
          
          .line-thin { border-bottom: 1px solid #000; margin-top: 2px; margin-bottom: 20px; }

          /* NOMOR ANTRIAN */
          .antrian-container {
            text-align: center;
            margin: 15px 0;
          }
          .antrian-box {
            display: inline-block;
            border: 3px solid #000;
            padding: 8px 25px;
            border-radius: 5px;
          }
          .antrian-box span { font-size: 12px; font-weight: bold; display: block; letter-spacing: 1px; }
          .antrian-box strong { font-size: 48px; display: block; line-height: 1; }

          .title {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            text-decoration: underline;
            margin-bottom: 20px;
            text-transform: uppercase;
          }

          /* TATA LETAK UTAMA (FOTO & BIODATA) */
          .main-content {
            display: flex;
            gap: 25px;
            margin-bottom: 25px;
          }
          .foto-container {
            width: 160px;
            text-align: center;
          }
          .foto-box {
            width: 160px;
            height: 210px;
            border: 1px solid #000;
            object-fit: cover;
            display: block;
            background-color: #f9f9f9;
          }
          .foto-label {
            font-size: 10px;
            margin-top: 8px;
            font-weight: bold;
            text-transform: uppercase;
            border: 1px solid #000;
            padding: 2px;
          }

          /* TABEL BIODATA */
          .info-table {
            flex-grow: 1;
            border-collapse: collapse;
          }
          .info-table td { 
            padding: 7px 0; 
            vertical-align: top; 
            font-size: 13px; 
            border-bottom: 0.5px dotted #ccc;
          }
          .label { 
            width: 160px; 
            font-size: 11px; 
            color: #444; 
            font-weight: bold; 
            text-transform: uppercase;
          }
          .colon { width: 15px; }
          .bold { font-weight: bold; font-size: 14px; }

          /* TABEL PENGIKUT */
          .section-title {
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 10px;
            font-size: 13px;
            text-transform: uppercase;
          }
          .rombongan-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          .rombongan-table th, .rombongan-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          .rombongan-table th { 
            background-color: #f0f0f0 !important; 
            text-transform: uppercase;
          }

          /* TANDA TANGAN */
          .footer-sign {
            margin-top: 40px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 13px;
          }
          .sign-box { width: 220px; text-align: center; }
          .sign-space { height: 70px; }

          /* PRINT OPTIMIZATION */
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <!-- HEADER KOP SURAT -->
        <table class="header-table">
          <tr>
            <td class="logo-col"><img src="${logoKemenimipas}" class="logo"></td>
            <td class="header-text">
              <h2>KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN RI</h2>
              <h2>DIREKTORAT JENDERAL PEMASYARAKATAN</h2>
              <h2>KANTOR WILAYAH JAWA TIMUR</h2>
              <h1>LEMBAGA PEMASYARAKATAN KELAS IIB BLITAR</h1>
              <p>Jl. Merapi No.02, Kepanjen Lor, Kota Blitar, Jawa Timur</p>
              <p>Telp: (0342) 801012 | Email: lapasblitar@yahoo.co.id</p>
            </td>
            <td class="logo-col"><img src="${logoLapas}" class="logo"></td>
          </tr>
        </table>
        <div class="line-thin"></div>

        <div class="title">KARTU IZIN KUNJUNGAN</div>

        <!-- NOMOR ANTRIAN -->
        <div class="antrian-container">
          <div class="antrian-box">
            <span>NOMOR ANTRIAN</span>
            <strong>${data.nomorAntrian || '0'}</strong>
          </div>
        </div>

        <div class="main-content">
          <!-- BAGIAN FOTO -->
          <div class="foto-container">
            <img src="${fotoUrl}" class="foto-box" onerror="this.src='https://via.placeholder.com/160x210?text=FOTO+TIDAK+ADA'">
            <div class="foto-label">FOTO PENGUNJUNG</div>
          </div>

          <!-- BAGIAN INFORMASI (SESUAI KOLOM DATABASE) -->
          <table class="info-table">
            <tr>
              <td class="label">NAMA PENGUNJUNG</td>
              <td class="colon">:</td>
              <td class="bold">${(data.namaPengunjung || '-').toUpperCase()}</td>
            </tr>
            <tr>
              <td class="label">NIK / IDENTITAS</td>
              <td class="colon">:</td>
              <td>${data.nik || '-'}</td>
            </tr>
            <tr>
              <td class="label">ALAMAT</td>
              <td class="colon">:</td>
              <td>${data.alamat || '-'}</td>
            </tr>
            <tr>
              <td class="label">NOMOR WHATSAPP</td>
              <td class="colon">:</td>
              <td>${data.nomorWa || '-'}</td>
            </tr>
            <tr>
              <td class="label">NAMA WBP (TUJUAN)</td>
              <td class="colon">:</td>
              <td class="bold">${(data.namaWbp || '-').toUpperCase()}</td>
            </tr>
            <tr>
              <td class="label">KATEGORI WBP</td>
              <td class="colon">:</td>
              <td>${data.kategoriWbp || '-'}</td>
            </tr>
            <tr>
              <td class="label">WAKTU DAFTAR</td>
              <td class="colon">:</td>
              <td>${data.createdAt ? new Date(data.createdAt).toLocaleString('id-ID') : '-'}</td>
            </tr>
          </table>
        </div>

        <!-- TABEL PENGIKUT (HANYA MUNCUL JIKA ADA) -->
        ${pengikut.length > 0 ? `
          <div class="section-title">PENGIKUT ROMBONGAN (${pengikut.length} ORANG)</div>
          <table class="rombongan-table">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">NO</th>
                <th>NAMA LENGKAP</th>
                <th>NIK / NO. IDENTITAS</th>
              </tr>
            </thead>
            <tbody>
              ${pengikut.map((p, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>${(p.nama || p.nama_lengkap || '-').toUpperCase()}</td>
                  <td>${p.nik || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        <!-- BAGIAN TANDA TANGAN -->
        <div class="footer-sign">
          <div class="sign-box">
            <p>Petugas Verifikasi,</p>
            <div class="sign-space"></div>
            <p>( ........................................ )</p>
          </div>
          
          <div class="sign-box">
             <p>Blitar, ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
             <p>Pengunjung Utama,</p>
             <div class="sign-space"></div>
             <p><strong>( ${(data.namaPengunjung || '-').toUpperCase()} )</strong></p>
          </div>
        </div>

        <!-- AUTO PRINT SCRIPT -->
        <script>
          window.onload = function() {
            // Tunggu sebentar agar gambar/foto ter-load sempurna
            setTimeout(() => {
              window.print();
            }, 1200);
          }
        </script>
      </body>
    </html>
  `;
};