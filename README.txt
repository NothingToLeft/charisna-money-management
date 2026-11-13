CHARISNA MONEY MANAGEMENT v14.1.2
MULTI-USER + TRANSFER ANTAR AKUN + SUPERAPP SYNC + UI POLISH

CARA MENGGUNAKAN
1. Pilih akun keuangan sumber, misalnya "Usaha Kos".
2. Tekan tombol "Antar Akun" pada header atau menu pengguna.
3. Pilih akun keuangan tujuan, misalnya "Personal".
4. Pilih rekening sumber dan rekening tujuan.
5. Isi nominal, biaya transfer bila ada, tanggal, dan catatan.
6. Simpan. Aplikasi membuat catatan keluar dan masuk yang saling terhubung.

FITUR BARU v14.1.2
- Penyelarasan UI modern: palet warna indigo (#4f46e5) & pink lembut (#ec4899), radius kartu konsisten.
- Universal Modal Prompts: menggantikan window.prompt() dengan showPromptModal() native HTML agar aman dan kompatibel di Windows Electron, Android Capacitor, dan Web PWA tanpa crash.
- SuperApp Integration & Event Sync: modul sinkronisasi lintas ekosistem CHARISNA SuperApp, Bumi Makmur POS, dan Homestay.
- Sesi & Keamanan: auto-lock membuang passkey sesi, webhook keluar dibatasi timeout 4s (AbortController), Android backup protection & notification channels.

CATATAN PENTING
- Transfer tidak menambah omzet dan tidak dihitung sebagai pengeluaran operasional.
- Untuk mata uang berbeda, isi nominal aktual yang diterima pada akun tujuan.
- Edit atau hapus dapat dilakukan dari akun sumber maupun tujuan.
- Koneksi internet diperlukan untuk autentikasi dan sinkronisasi cloud.

STRUKTUR TARGET
- www/             sumber web utama untuk Capacitor
- web/             paket deploy Netlify
- android/         project Android native/Capacitor
- windows/         project Windows Electron
- windows/app/     aset aplikasi desktop
