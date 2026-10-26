# CRUD Produk — Next.js + MySQL (Aiven) + Vercel

Aplikasi CRUD produk dengan Next.js App Router dan database MySQL. Kategori
diisi langsung pada form produk; tidak ada halaman terpisah untuk mengelola
kategori.

## Struktur Project

```text
app/
  api/products/route.js         -> GET (list), POST (create)
  api/products/[id]/route.js    -> GET (detail), PUT (update), DELETE
  page.js                       -> Halaman utama (tabel + form)
  layout.js
  globals.css
lib/db.js                       -> Koneksi pool MySQL dengan SSL Aiven
migrations/002_remove_categories.sql -> Hapus tabel/kolom kategori lama
migrations/003_add_product_category.sql -> Tambah kategori pada tabel products
schema.sql                      -> Skema tabel products
.env.local.example              -> Contoh environment variables
```

## Menyiapkan Database MySQL

Di Aiven, buat service MySQL dan tunggu sampai statusnya **Running**. Dari
halaman **Overview**, salin host, port, user, password, dan nama database persis
seperti yang ditampilkan. Host yang dipakai harus hostname service Aiven, bukan
URL aplikasi atau alamat tebakan.

Untuk database baru, jalankan `schema.sql` melalui Aiven Query Editor atau
MySQL CLI:

```powershell
Get-Content .\schema.sql | mysql --host=<HOST> --port=<PORT> --user=<USER> --password --ssl-mode=REQUIRED --database=<DBNAME>
```

Jika database lama sudah memakai fitur kategori, jalankan migrasi ini satu kali
melalui Aiven Query Editor atau MySQL CLI:

```powershell
Get-Content .\migrations\002_remove_categories.sql | mysql --host=<HOST> --port=<PORT> --user=<USER> --password --ssl-mode=REQUIRED --database=<DBNAME>
```

Migrasi tersebut menghapus foreign key, kolom `products.category_id`, dan
tabel `categories`. Produk yang sudah ada tetap tersimpan. Setelah itu jalankan
migrasi `migrations/003_add_product_category.sql` untuk menambahkan kolom teks
`category` pada produk. Jika database baru dibuat dari `schema.sql`, kedua
migrasi tidak perlu dijalankan.

## Menjalankan Secara Lokal

Jalankan dari folder yang berisi `package.json`:

```powershell
npm install
Copy-Item .env.local.example .env.local
```

Isi `.env.local` dengan nilai dari Aiven:

```text
DB_HOST=<hostname dari Overview Aiven>
DB_PORT=<port dari Overview Aiven>
DB_USER=<user dari Overview Aiven>
DB_PASSWORD=<password dari Aiven>
DB_NAME=<nama database dari Aiven>
DB_CA_CERT=<isi sertifikat CA dalam format base64>
```

`DB_CA_CERT` berisi konten file CA certificate Aiven yang di-encode ke base64
dalam satu baris. Setelah memperbarui `.env.local`, restart server development:

```powershell
npm run dev
```

Buka alamat lokal yang ditampilkan di terminal. Jika muncul `getaddrinfo
ENOTFOUND`, hostname `DB_HOST` tidak dapat ditemukan oleh DNS. Salin ulang
hostname persis dari **Aiven → service MySQL → Overview**, pastikan servicenya
berstatus **Running**, lalu restart server.

## Deploy ke Vercel

Tambahkan `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, dan
`DB_CA_CERT` sebagai Environment Variables di project Vercel. Untuk database
yang sudah memakai kategori, jalankan migrasi `migrations/002_remove_categories.sql`
terlebih dahulu. Setelah itu deploy project.

## Fitur

- **Create**: tambah produk dengan nama, kategori, deskripsi, dan harga
- **Read**: daftar produk dimuat saat halaman dibuka
- **Update**: edit produk beserta kategorinya
- **Delete**: hapus produk dengan konfirmasi
