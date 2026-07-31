-- CHARISNA Money Management v12
-- Always-Latest Cloud: nomor versi atomik, waktu server, dan realtime.
-- Jalankan sekali melalui Supabase SQL Editor setelah SUPABASE-SETUP-V6.sql/V10.sql.

do $$
begin
  if to_regclass('public.moniflow_vaults') is null then
    raise exception 'Tabel public.moniflow_vaults belum ada. Gunakan setup cloud CHARISNA lama terlebih dahulu.';
  end if;
end;
$$;

create or replace function public.charisna_v12_prepare_vault_write()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.version := greatest(coalesce(new.version, 1), 1);
  else
    -- Dua perangkat dapat menyimpan hampir bersamaan. Jika checksum berubah,
    -- server memastikan revisi tetap naik dan tidak memakai nomor yang sama.
    if new.checksum is distinct from old.checksum then
      new.version := greatest(coalesce(new.version, 0), coalesce(old.version, 0) + 1);
    else
      new.version := greatest(coalesce(new.version, 0), coalesce(old.version, 0));
    end if;
  end if;

  -- Waktu server dipakai supaya jam perangkat yang berbeda tidak menentukan
  -- data mana yang dianggap paling baru.
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists charisna_v12_vault_write on public.moniflow_vaults;
create trigger charisna_v12_vault_write
before insert or update on public.moniflow_vaults
for each row execute function public.charisna_v12_prepare_vault_write();

alter table public.moniflow_vaults replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'moniflow_vaults'
  ) then
    alter publication supabase_realtime add table public.moniflow_vaults;
  end if;
exception
  when undefined_object then
    raise notice 'Publication supabase_realtime belum tersedia; aktifkan Realtime untuk moniflow_vaults melalui Dashboard Supabase.';
end;
$$;

comment on function public.charisna_v12_prepare_vault_write() is
  'Menjamin versi brankas CHARISNA naik secara atomik dan updated_at memakai waktu server.';
