-- Uji keamanan (RLS). Jalankan setelah skema.sql. Gagal = RAISE EXCEPTION; semua lulus = NOTICE 'RLS: LULUS'.
\set ON_ERROR_STOP on
insert into guru_diizinkan values ('guru1@uji.id'), ('guru2@uji.id'), ('guru3@uji.id');
insert into auth.users (id, email, raw_user_meta_data, raw_app_meta_data) values
  ('00000000-0000-0000-0000-0000000000a1', 'guru1@uji.id', '{"full_name":"Guru Satu"}', '{"provider":"google"}'),
  ('00000000-0000-0000-0000-0000000000a2', 'GURU2@uji.id', '{"full_name":"Guru Dua"}', '{"provider":"google"}'),
  -- daftar lewat email/password memakai email guru: TIDAK boleh jadi guru
  ('00000000-0000-0000-0000-0000000000a3', 'guru3@uji.id', '{}', '{"provider":"email"}');
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-0000000000b1', 'a@uji.id', '{"full_name":"Siswa A"}'),
  ('00000000-0000-0000-0000-0000000000b2', 'b@uji.id', '{"name":"Siswa B"}'),
  ('00000000-0000-0000-0000-0000000000b3', 'c@uji.id', '{}');

do $$ begin
  if (select peran from profil where id = '00000000-0000-0000-0000-0000000000a2') <> 'guru' then raise exception 'email guru (huruf besar) tidak jadi guru'; end if;
  if (select peran from profil where id = '00000000-0000-0000-0000-0000000000b1') <> 'siswa' then raise exception 'siswa salah peran'; end if;
  if (select peran from profil where id = '00000000-0000-0000-0000-0000000000a3') <> 'siswa' then raise exception 'akun non-Google dengan email guru menjadi guru'; end if;
  if (select nama from profil where id = '00000000-0000-0000-0000-0000000000b2') <> 'Siswa B' then raise exception 'nama dari meta name'; end if;
end $$;

-- Guru 1 & 2 membuat kelas
begin; set local role authenticated; set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1"}';
insert into kelas (nama, kode, guru_id) values ('XI IPA 2', 'KAWUNG7', '00000000-0000-0000-0000-0000000000a1'); commit;
begin; set local role authenticated; set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a2"}';
insert into kelas (nama, kode, guru_id) values ('X IPA 1', 'PARANG3', '00000000-0000-0000-0000-0000000000a2'); commit;

-- Siswa A & B bergabung ke kelas guru 1 dan menjawab
begin; set local role authenticated; set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b1"}';
do $$ declare r jsonb; begin
  r := gabung_kelas('ZZZZZZZ'); if r->>'alasan' <> 'tidak-ada' then raise exception 'kode salah: %', r; end if;
  r := gabung_kelas('KAWUNG7'); if (r->>'ok')::bool is not true then raise exception 'gabung gagal: %', r; end if;
  r := gabung_kelas('KAWUNG7'); if r->>'alasan' <> 'sudah-punya-kelas' then raise exception 'gabung ganda: %', r; end if;
end $$;
insert into jawaban (id, siswa_id, kelas_id, mode, simpul, templat_id, seed, teks_jawaban, status, detik)
  select gen_random_uuid(), auth.uid(), id, 'latihan', 'J07-01', 'T-J07-01-A', 1, '1/2', 'benar', 5 from kelas where kode = 'KAWUNG7';
insert into status_simpul (siswa_id, simpul, status, sumber) values (auth.uid(), 'J07-01', 'bolong', 'diagnostik');
commit;
begin; set local role authenticated; set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b2"}';
select gabung_kelas('KAWUNG7');
insert into jawaban (id, siswa_id, kelas_id, mode, simpul, templat_id, seed, teks_jawaban, status, detik)
  values ('11111111-1111-1111-1111-111111111111', auth.uid(), (select kelas_id from anggota where siswa_id = auth.uid()), 'latihan', 'J07-01', 'T-J07-01-A', 2, '2/5', 'pola', 7);
commit;

-- Siswa A: hanya melihat miliknya, tidak bisa jadi guru, tidak bisa buat kelas, tidak bisa menulis atas nama B
begin; set local role authenticated; set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b1"}';
do $$ declare n int; begin
  if (select count(*) from jawaban) <> 1 then raise exception 'A melihat jawaban siswa lain'; end if;
  if (select count(*) from profil) <> 1 then raise exception 'A melihat profil lain'; end if;
  if (select count(*) from status_simpul) <> 1 then raise exception 'A melihat status lain'; end if;
  if (select count(*) from kelas) <> 1 then raise exception 'A melihat kelas lain'; end if;
  update profil set peran = 'guru' where id = auth.uid();
  if (select peran from profil where id = auth.uid()) <> 'siswa' then raise exception 'A berhasil menjadi guru'; end if;
  begin
    insert into kelas (nama, kode, guru_id) values ('Palsu', 'QQQQQQ2', auth.uid());
    raise exception 'SEHARUSNYA GAGAL: siswa membuat kelas';
  exception when insufficient_privilege then null; end;
  begin
    insert into jawaban (id, siswa_id, kelas_id, mode, simpul, templat_id, seed, teks_jawaban, status, detik)
      select gen_random_uuid(), '00000000-0000-0000-0000-0000000000b2', id, 'latihan', 'J07-01', 'T', 1, 'x', 'benar', 1 from kelas;
    raise exception 'SEHARUSNYA GAGAL: menulis atas nama B';
  exception when insufficient_privilege then null; end;
  update jawaban set teks_jawaban = 'curang' where id = '11111111-1111-1111-1111-111111111111';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'A mengubah jawaban B'; end if;
  if (select count(*) from guru_diizinkan) <> 0 then raise exception 'A membaca daftar guru'; end if;
end $$;
commit;

-- Guru 1 melihat semua kelasnya; Guru 2 tidak melihat apa pun dari kelas guru 1
begin; set local role authenticated; set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1"}';
do $$ begin
  if (select count(*) from jawaban) <> 2 then raise exception 'guru1 tidak melihat 2 jawaban'; end if;
  if (select count(*) from profil where peran = 'siswa') <> 2 then raise exception 'guru1 tidak melihat 2 siswa'; end if;
  if (select count(*) from status_simpul) <> 1 then raise exception 'guru1 tidak melihat status'; end if;
  update kelas set aktif = false where kode = 'KAWUNG7';
end $$; commit;
begin; set local role authenticated; set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a2"}';
do $$ begin
  if (select count(*) from jawaban) <> 0 then raise exception 'guru2 melihat jawaban kelas lain'; end if;
  if (select count(*) from profil) <> 1 then raise exception 'guru2 melihat profil lain'; end if;
  update kelas set aktif = true where kode = 'KAWUNG7';
  if (select aktif from kelas where kode = 'PARANG3') is not true then raise exception 'kelas sendiri hilang'; end if;
end $$; commit;

-- Siswa C: kelas nonaktif ditolak (dan guru2 tidak berhasil membukanya)
begin; set local role authenticated; set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b3"}';
do $$ declare r jsonb; begin
  r := gabung_kelas('KAWUNG7'); if r->>'alasan' <> 'nonaktif' then raise exception 'kelas nonaktif: %', r; end if;
end $$; commit;

-- Pengunjung tanpa login
begin; set local role anon;
do $$ begin
  if (select count(*) from jawaban) <> 0 or (select count(*) from profil) <> 0 or (select count(*) from kelas) <> 0 then raise exception 'anon melihat data'; end if;
  begin
    perform public.gabung_kelas('KAWUNG7');
    raise exception 'SEHARUSNYA GAGAL: anon memanggil gabung_kelas';
  exception when insufficient_privilege then null; end;
end $$; commit;

do $$ begin raise notice 'RLS: LULUS'; end $$;
