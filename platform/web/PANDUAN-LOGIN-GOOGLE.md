# Panduan: menyalakan "Masuk dengan Google" (± 10 menit)

Login Google butuh "kunci" (OAuth Client) dari akun Google **kamu sendiri**. Claude tidak bisa membuatnya.
Siapkan dua tab: **Google Cloud Console** dan **dasbor Supabase** proyek UDcation.

## A. Ambil alamat callback dari Supabase
1. Buka dasbor Supabase → proyek UDcation → **Authentication** → **Sign In / Providers** (atau *Providers*) → **Google**.
2. Salin **Callback URL**, bentuknya `https://<kode-proyek>.supabase.co/auth/v1/callback`.

## B. Buat OAuth Client di Google Cloud
1. Buka <https://console.cloud.google.com/> → pilih/buat proyek baru, mis. **UDcation**.
2. Menu **Google Auth Platform** (di versi lama: *APIs & Services → OAuth consent screen*):
   - **Branding**: nama aplikasi `UDcation`, email dukungan = email kamu, logo boleh dilewati.
   - **Audience**: pilih **External**. Selama status *Testing*, hanya akun yang kamu daftarkan sebagai *Test users*
     yang bisa login (maks. 100) — cocok untuk uji coba satu–dua kelas: masukkan email siswa di sini.
     Untuk dibuka ke semua orang, klik **Publish app** (nama, email & logo saja tidak butuh verifikasi panjang).
3. **Clients** (versi lama: *Credentials → Create credentials → OAuth client ID*):
   - Application type: **Web application**, nama: `UDcation Web`.
   - **Authorized JavaScript origins**: alamat web UDcation (dari Vercel), mis. `https://udcation.vercel.app`.
   - **Authorized redirect URIs**: tempel **Callback URL** dari langkah A.
   - Klik **Create** → salin **Client ID** dan **Client secret**.

## C. Tempel di Supabase
1. Kembali ke Supabase → **Google** provider → nyalakan **Enable**.
2. Tempel **Client ID** dan **Client Secret** → **Save**.
3. **Authentication → URL Configuration**:
   - **Site URL**: alamat web UDcation (Vercel).
   - **Redirect URLs**: tambahkan alamat yang sama (dan `http://localhost:5173` bila ingin mencoba di laptop).

## D. Coba
Buka web UDcation → **Masuk dengan Google**. Akun dengan email yang terdaftar di tabel `guru_diizinkan`
otomatis menjadi **guru**; akun lain menjadi **siswa**.

> Email guru ditambahkan lewat SQL: `insert into guru_diizinkan values ('email@contoh.id');`
> Bila akun itu sudah pernah login sebagai siswa: `update profil set peran = 'guru' where email = 'email@contoh.id';`
