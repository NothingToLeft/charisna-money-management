-- TEMPLATE CRON CHARISNA v10
-- JANGAN langsung Run sebelum mengganti YOUR_CRON_SECRET.
-- Edge Function send-bill-reminders harus sudah dideploy dengan Verify JWT OFF.

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;
create extension if not exists supabase_vault with schema vault;

-- Jalankan baris ini satu kali setelah mengganti YOUR_CRON_SECRET.
select vault.create_secret('YOUR_CRON_SECRET', 'charisna_cron_secret');

-- Jika job dengan nama sama sudah ada, hapus dahulu:
select cron.unschedule('charisna-bill-reminders')
where exists (select 1 from cron.job where jobname = 'charisna-bill-reminders');

-- Jalankan setiap 15 menit.
select cron.schedule(
  'charisna-bill-reminders',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := 'https://ankctkfybpepwpdnswwe.supabase.co/functions/v1/send-bill-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'charisna_cron_secret'
        limit 1
      )
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);
