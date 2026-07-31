CHARISNA MONEY MANAGEMENT v12 — PIN & ALWAYS-LATEST CLOUD
==========================================================

Versi ini berlaku untuk Web/Netlify, Android/Tablet, dan aplikasi Windows.

FITUR UTAMA v12
- Setelah login email + password cloud, brankas dibuka memakai PIN angka.
- Panjang PIN yang tersedia: tepat 4, 6, 8, atau 12 digit.
- Tersedia panel angka pada halaman login di HP, tablet, dan PC.
- Cloud Always-Latest: versi cloud terbaru dipakai otomatis tanpa dialog pilih
  data lokal atau cloud.
- Autosave terenkripsi setelah setiap perubahan, saat lock, logout, aplikasi
  disembunyikan, koneksi kembali, dan sebelum aplikasi desktop benar-benar keluar.
- Realtime multi-device dan pemeriksaan cloud otomatis setiap satu menit.
- Salinan recovery terenkripsi dibuat sebelum data lokal diganti cloud terbaru.
- Pengingat native Android dan Windows tetap dapat muncul saat jendela aplikasi
  tidak sedang dibuka. Jadwal lama dibatalkan sebelum jadwal baru dibuat sehingga
  tidak menumpuk; aplikasi tidak perlu membuat acara di kalender perangkat.
- Windows berjalan dari paket lokal, bukan membuka situs di dalam elemen webview.
  Situs Netlify tetap dapat digunakan secara terpisah. Kanal update dapat
  diarahkan dinamis dari konfigurasi kecil Netlify ke GitHub Releases.

KEAMANAN PIN
- PIN 4 digit diperbolehkan, tetapi PIN 6 atau 8 digit lebih disarankan.
- PIN 12 digit memberikan ruang kombinasi paling besar.
- PIN tidak dikirim sebagai teks biasa. PIN dipakai untuk membentuk kunci
  enkripsi menggunakan PBKDF2 600.000 iterasi dan AES-GCM.
- PIN brankas berbeda dari password akun Supabase/email.
- PIN tidak dapat dipulihkan oleh server. Simpan PIN di tempat aman.

MIGRASI DARI VERSI LAMA
- Brankas lama tetap dapat dibuka satu kali memakai sandi lamanya.
- Setelah terbuka, aplikasi menawarkan migrasi ke PIN angka 4/6/8/12 digit.
- Buat Backup Terenkripsi sebelum melakukan deploy atau instalasi pembaruan.

FILE PENTING
- index.html
- app.js, app-pro.js, app-patch-v12.js
- native-bootstrap.js
- styles-patch-v12.css
- service-worker.js
- SUPABASE-SETUP-V12.sql
- UPDATE-V12.txt
- QA-REPORT-V12.txt

URL PRODUKSI
https://charisna-money.netlify.app
