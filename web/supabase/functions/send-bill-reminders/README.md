# send-bill-reminders

Supabase Edge Function untuk mengirim Web Push CHARISNA Money Management.

Secrets yang wajib diatur:

- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY
- VAPID_SUBJECT (contoh: mailto:emailanda@example.com)
- CRON_SECRET

SUPABASE_URL, SUPABASE_ANON_KEY, dan SUPABASE_SERVICE_ROLE_KEY disediakan oleh Supabase saat function berjalan.

Deploy:

```bash
supabase functions deploy send-bill-reminders --no-verify-jwt
```

Scheduled request harus mengirim header:

```text
x-cron-secret: NILAI_CRON_SECRET_ANDA
```

Jalankan setiap 15 menit agar pengaturan jam reminder bekerja dengan toleransi ±14 menit.
