CHARISNA MONEY MANAGEMENT v14.0.0 — MULTI-USER FINANCIAL SPACES
================================================================

PLATFORM
- Web/Netlify
- Android HP dan tablet melalui Capacitor
- Windows Desktop melalui Electron

MODEL AKUN
Aplikasi memakai satu akun cloud Supabase dan satu PIN brankas utama. Di dalam
brankas tersebut pengguna dapat membuat beberapa Akun Keuangan, misalnya:
- Saya
- Pasangan
- Toko Bangunan
- Usaha Listrik
- Usaha Air
- Proyek Renovasi

Saat akun keuangan diganti, dashboard, saldo, transaksi, budget, target, kalender,
analisis, laporan, kategori, tag, utang, investasi, dan langganan ikut berganti.

CATATAN KEAMANAN
Akun Keuangan adalah ruang data internal, bukan login terpisah. Semua ruang dapat
diakses oleh pemilik login cloud dan PIN utama. Untuk pembagian akses per orang,
role, atau PIN khusus per profil diperlukan modul keamanan tambahan pada versi
berikutnya.

CLOUD
- Supabase tetap menjadi penyimpanan cloud utama.
- Struktur tabel Supabase v12 tetap dipakai.
- Tidak memerlukan SQL baru atau paket berbayar.
- Data v6-v13.0.1 dimigrasikan otomatis saat pertama dibuka.

PENGGUNAAN
1. Masuk ke akun cloud dan buka brankas dengan PIN.
2. Tekan pemilih Akun Keuangan pada header.
3. Pilih Tambah Akun.
4. Isi nama, jenis, ikon, warna, dan mata uang.
5. Aktifkan dompet Tunai awal bila diperlukan.
6. Setelah dibuat, seluruh halaman otomatis memakai akun baru tersebut.

URL WEB
https://charisna-money.netlify.app
