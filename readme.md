# Sistem Tabungan API

REST API sederhana untuk mengelola akun tabungan, saldo, target tabungan, dan riwayat transaksi. API dibuat dengan Node.js, Express, dan MongoDB. Pengguna dapat mendaftar dan masuk, lalu memakai token JWT untuk melihat profil serta menambah atau menarik saldo.

## Fitur

- Pendaftaran dan login pengguna.
- Penyimpanan kata sandi dalam bentuk hash menggunakan bcrypt.
- Autentikasi endpoint dengan JWT. Token akses berlaku selama 15 menit.
- Penambahan saldo dan penarikan saldo dengan pemeriksaan saldo yang tersedia.
- Riwayat transaksi dengan filter jenis transaksi.
- Profil pengguna yang menampilkan saldo, target, dan persentase target tabungan.
- delete akun (pastikan saldo akun sudah 0)
- update target tabungan jika ingin mengubah target dari akunya

## Teknologi

- Node.js dengan ES modules
- Express 5
- MongoDB dan Mongoose
- JSON Web Token (JWT)
- bcrypt

## Persiapan

Pastikan Node.js, npm, dan MongoDB sudah tersedia. Dari direktori proyek, pasang dependensi:

```bash
npm install
```


Jalankan server dalam mode pengembangan:

```bash
npm run dev
```

Server memakai port `4000` secara bawaan. Jika variabel `PORT` diatur, server akan memakai port tersebut. URL dasar API:

```text
http://localhost:4000
```

## Endpoint API



```http
Authorization: Bearer <token>
```

| Metode | Endpoint | Autentikasi | Keterangan |
| --- | --- | --- | --- |
| `POST` | `/api/users/register` | Tidak | Membuat akun pengguna |
| `POST` | `/api/users/login` | Tidak | Login dan mendapatkan token akses |
| `GET` | `/api/users/profile/me` | Ya | Mendapatkan profil pengguna yang sedang login |
| `POST` | `/api/transactions/tambah-saldo` | Ya | Menambahkan saldo |
| `POST` | `/api/transactions/tarik-saldo` | Ya | Menarik saldo |
| `GET` | `/api/transactions/log` | Ya | Melihat riwayat transaksi, jika ingin hanya riwayat tarik-saldo tambahkan ?type=tarik-saldo |
| `PATCH` | `/api/users/profile/ubah-targe` | Ya | ubah target tabungan akun|
| `DELETE` | `/api/users/profile/delete` | Ya | hapus akun (pastikan saldo sudah 0)|

### Contoh request

Daftarkan akun dengan `username`, `password`, dan `targetTabungan`:

```json
{
    "username": "pengguna1",
    "password": "kata_sandi",
    "targetTabungan": 1000000
}
```

Login menggunakan username dan kata sandi yang sama. Simpan nilai `token` dari respons untuk digunakan pada endpoint yang memerlukan autentikasi.

```json
{
    "username": "pengguna1",
    "password": "kata_sandi"
}
```

Untuk menambah atau menarik saldo, kirim `amount` sebagai bilangan bulat positif. `keterangan` bersifat opsional.

```json
{
    "amount": 50000,
    "keterangan": "Setoran bulanan"
}
```

Riwayat transaksi dapat difilter memakai parameter `type` berikut:

```text
GET /api/transactions/log?type=tambah-saldo
GET /api/transactions/log?type=tarik-saldo
GET /api/transactions/log?type=semua
```

Jika `type` tidak dikirim, API menampilkan semua transaksi milik pengguna tersebut. Riwayat diurutkan dari yang terbaru.

## Struktur Proyek

```text
.
├── config/          # Koneksi database
├── controllers/     # Logika untuk menangani request API
├── middleware/      # Middleware autentikasi JWT
├── models/          # Model pengguna dan transaksi MongoDB
├── postman/         # Contoh request API
├── routes/          # Definisi endpoint
├── services/        # Proses pencatatan transaksi dan saldo
├── app.js           # Konfigurasi Express dan pemasangan route
└── index.js         # Konfigurasi environment dan pemulai server
```

## Catatan
penarikan saldo akan ditolak jika saldo tidak mencukupi
