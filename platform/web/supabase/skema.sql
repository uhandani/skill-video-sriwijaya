-- Skema UDcation (prototipe uji coba kelas). Jalankan sekali di proyek Supabase (SQL editor / migrasi).
-- Prinsip: siswa hanya melihat datanya sendiri; guru hanya kelas miliknya; peran guru hanya dari tabel guru_diizinkan.

create extension if not exists pgcrypto;

-- Fungsi bantu kebijakan di skema 'privat' (tidak diekspos lewat API).
create schema if not exists privat;
grant usage on schema privat to authenticated, anon;

create table public.guru_diizinkan (email text primary key);

create table public.profil (
  id uuid primary key references auth.users (id) on delete cascade,
  nama text not null default '',
  email text not null,
  peran text not null default 'siswa' check (peran in ('siswa', 'guru')),
  dibuat timestamptz not null default now()
);

create table public.kelas (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (length(nama) between 1 and 80),
  kode text not null unique check (kode ~ '^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{7}$'),
  guru_id uuid not null references public.profil (id) on delete cascade,
  aktif boolean not null default true,
  dibuat timestamptz not null default now()
);

-- Satu siswa satu kelas aktif (uji coba).
create table public.anggota (
  siswa_id uuid primary key references public.profil (id) on delete cascade,
  kelas_id uuid not null references public.kelas (id) on delete cascade,
  bergabung timestamptz not null default now()
);

create table public.jawaban (
  id uuid primary key,
  siswa_id uuid not null references public.profil (id) on delete cascade,
  kelas_id uuid not null references public.kelas (id) on delete cascade,
  mode text not null check (mode in ('diagnostik', 'latihan', 'langkah')),
  simpul text not null,
  templat_id text not null,
  seed bigint not null,
  teks_jawaban text not null check (length(teks_jawaban) <= 500),
  status text not null check (status in ('benar', 'pola', 'tak-dikenal', 'tak-terbaca')),
  pola_id text,
  detik real not null check (detik >= 0),
  dibuat timestamptz not null default now()
);
create index jawaban_kelas on public.jawaban (kelas_id, dibuat);
create index jawaban_siswa on public.jawaban (siswa_id, dibuat);

create table public.status_simpul (
  siswa_id uuid not null references public.profil (id) on delete cascade,
  simpul text not null,
  status text not null check (status in ('kuasai', 'rapuh', 'bolong')),
  sumber text not null check (sumber in ('diagnostik', 'latihan')),
  diperbarui timestamptz not null default now(),
  primary key (siswa_id, simpul)
);

-- ── Fungsi bantu (security definer → memutus rekursi antar-kebijakan) ──
create function privat.adalah_guru() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profil where id = auth.uid() and peran = 'guru')
$$;
create function privat.kelas_saya() returns uuid language sql stable security definer set search_path = public as $$
  select kelas_id from anggota where siswa_id = auth.uid()
$$;
create function privat.kelas_milik_saya() returns setof uuid language sql stable security definer set search_path = public as $$
  select id from kelas where guru_id = auth.uid()
$$;
create function privat.siswa_dari_guru(siswa uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from anggota a join kelas k on k.id = a.kelas_id where a.siswa_id = siswa and k.guru_id = auth.uid())
$$;

-- ── Profil dibuat otomatis saat daftar; peran guru hanya bila email diizinkan ──
create function public.profil_baru() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profil (id, nama, email, peran) values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    case when exists (select 1 from guru_diizinkan g where lower(g.email) = lower(new.email)) then 'guru' else 'siswa' end
  );
  return new;
end $$;
create trigger profil_baru after insert on auth.users for each row execute function public.profil_baru();

-- ── Gabung kelas lewat kode (satu-satunya cara menulis ke anggota) ──
create function public.gabung_kelas(kode_masuk text) returns jsonb language plpgsql security definer set search_path = public as $$
declare k kelas;
begin
  if auth.uid() is null then raise exception 'belum masuk' using errcode = '42501'; end if;
  if (select peran from profil where id = auth.uid()) is distinct from 'siswa' then
    raise exception 'hanya siswa yang bergabung ke kelas' using errcode = '42501';
  end if;
  select * into k from kelas where kode = upper(trim(kode_masuk));
  if not found then return jsonb_build_object('ok', false, 'alasan', 'tidak-ada'); end if;
  if not k.aktif then return jsonb_build_object('ok', false, 'alasan', 'nonaktif'); end if;
  if exists (select 1 from anggota where siswa_id = auth.uid()) then return jsonb_build_object('ok', false, 'alasan', 'sudah-punya-kelas'); end if;
  insert into anggota (siswa_id, kelas_id) values (auth.uid(), k.id);
  return jsonb_build_object('ok', true, 'kelas', jsonb_build_object('id', k.id, 'nama', k.nama, 'kode', k.kode, 'aktif', k.aktif));
end $$;

-- ── RLS ──
alter table public.guru_diizinkan enable row level security;  -- tanpa kebijakan: tak terbaca klien
alter table public.profil enable row level security;
alter table public.kelas enable row level security;
alter table public.anggota enable row level security;
alter table public.jawaban enable row level security;
alter table public.status_simpul enable row level security;

-- profil: baca diri sendiri / siswa di kelas saya. Tidak ada insert/update/delete dari klien → peran tak bisa diubah.
create policy profil_baca on public.profil for select using (id = auth.uid() or privat.siswa_dari_guru(id));

-- kelas
create policy kelas_baca on public.kelas for select using (guru_id = auth.uid() or id = privat.kelas_saya());
create policy kelas_buat on public.kelas for insert with check (guru_id = auth.uid() and privat.adalah_guru());
create policy kelas_ubah on public.kelas for update using (guru_id = auth.uid()) with check (guru_id = auth.uid());

-- anggota: baca saja (tulis lewat gabung_kelas)
create policy anggota_baca on public.anggota for select
  using (siswa_id = auth.uid() or kelas_id in (select privat.kelas_milik_saya()));

-- jawaban: siswa menulis/membaca miliknya di kelasnya; guru membaca kelas miliknya
create policy jawaban_baca on public.jawaban for select
  using (siswa_id = auth.uid() or kelas_id in (select privat.kelas_milik_saya()));
create policy jawaban_tulis on public.jawaban for insert
  with check (siswa_id = auth.uid() and kelas_id = privat.kelas_saya());
create policy jawaban_ubah on public.jawaban for update
  using (siswa_id = auth.uid()) with check (siswa_id = auth.uid() and kelas_id = privat.kelas_saya());

-- status simpul
create policy status_baca on public.status_simpul for select using (siswa_id = auth.uid() or privat.siswa_dari_guru(siswa_id));
create policy status_tulis on public.status_simpul for insert with check (siswa_id = auth.uid());
create policy status_ubah on public.status_simpul for update using (siswa_id = auth.uid()) with check (siswa_id = auth.uid());

revoke execute on function public.profil_baru() from public, anon, authenticated;
revoke execute on function public.gabung_kelas(text) from public, anon;
grant execute on function public.gabung_kelas(text) to authenticated;
