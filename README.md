# EduConnect

EduConnect adalah proyek microservice sederhana untuk mendemokan integrasi data akademik antara layanan manajemen siswa, manajemen mata kuliah, dan sebuah API Gateway yang menjadi pintu masuk frontend. Repository ini juga menyertakan halaman dashboard statis yang memvisualisasikan data melalui Gateway tersebut.

## Komponen Utama

| Layanan / Modul | Port | Deskripsi Singkat | Berkas Utama |
| --- | --- | --- | --- |
| Student Service | 3001 | CRUD data siswa + dokumentasi Swagger | `student-service/server.js` |
| Course Service | 3002 | CRUD data mata kuliah + endpoint integrasi `courses/by-user/:id` | `course-service/server.js` |
| API Gateway | 4000 | Proxy request dari frontend ke kedua service, termasuk agregasi user-courses | `api-gateway/server.js` |
| Frontend statis | 5000 (opsional) | `index.html`, `dashboard.html`, `student.html`, `course.html` yang melakukan fetch ke Gateway | akar repo & masing-masing folder service |

Semua service berbagi satu database MySQL (`educonnect_db`) dengan tiga tabel utama: `students`, `courses`, dan `enrollments`. Koneksi database dikonfigurasi melalui berkas `.env` di root repo dan otomatis dibaca oleh tiap service.

## Persyaratan Sistem

- **Node.js 18+** dan **npm** (untuk menjalankan service berbasis Express).  
- **MySQL 8.x** atau kompatibel (mis. MariaDB) dengan akses untuk membuat database baru.  
- **Git** (opsional) untuk cloning repository.  
- **Alat impor SQL**: MySQL CLI atau GUI seperti MySQL Workbench tergantung preferensi.  
- **Static file server** seperti VS Code Live Server atau `npx http-server` jika ingin menjalankan dashboard pada `http://localhost:5000` (dibutuhkan agar lolos konfigurasi CORS API Gateway).

## Struktur Folder Singkat

```
EduConnect-Project/
|- api-gateway/
|- course-service/
|- student-service/
|- database_seed.sql
|- .env
|- index.html, dashboard.html, styles.css
|- package.json
```

## Langkah Setup Lokal (dari Database hingga Berhasil Berjalan)

### 1. Siapkan Database MySQL
1. Pastikan server MySQL aktif dan Anda mengetahui user/password yang akan dipakai (contoh: `root` tanpa password).  
2. Buka terminal MySQL (CLI) atau MySQL Workbench.  
3. Jalankan skrip seed yang tersedia agar database, tabel, dan data contoh otomatis dibuat:
   ```sql
   SOURCE /path/ke/EduConnect-Project/database_seed.sql;
   ```
   - Contoh Windows (PowerShell): `mysql -u root -p < database_seed.sql`.  
   - Contoh Linux/macOS: `mysql -u root -p < database_seed.sql`.  
4. Verifikasi hasilnya:
   ```sql
   USE educonnect_db;
   SHOW TABLES;
   SELECT COUNT(*) FROM students;
   ```
   Anda seharusnya melihat data contoh untuk `students`, `courses`, dan `enrollments`.  
5. Jika menggunakan kredensial selain default, pastikan user tersebut memiliki hak akses (SELECT/INSERT/UPDATE/DELETE) ke `educonnect_db`.

### 2. Konfigurasi Variabel Lingkungan
1. Di root repo sudah tersedia berkas `.env`. Jika belum, buat berdasarkan contoh berikut:
   ```ini
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=educonnect_db
   DB_PORT=3306
   ```
2. Nilai ini akan otomatis dibaca oleh Student Service dan Course Service (mereka mencari `.env` di folder layanan, lalu fallback ke root). Pastikan kredensialnya sesuai dengan setup MySQL Anda.

### 3. Instalasi Dependensi Node.js
Lakukan instalasi di setiap folder yang memiliki `package.json`:
```bash
# Opsional: dependency global di root (untuk alat umum)
npm install

cd student-service
npm install

cd ../course-service
npm install

cd ../api-gateway
npm install
```
> Gunakan terminal terpisah atau jalankan perintah di atas satu per satu. Pastikan tidak ada error sebelum lanjut.

### 4. Jalankan Seluruh Layanan Backend
Jalankan masing-masing service di terminal terpisah agar log mudah dipantau.

1. **Student Service (port 3001)**
   ```bash
   cd student-service
   npm start  # atau: node server.js
   ```
   - Swagger tersedia di `http://localhost:3001/api-docs`.

2. **Course Service (port 3002)**
   ```bash
   cd course-service
   npm start
   ```
   - Swagger tersedia di `http://localhost:3002/api-docs`.
   - Endpoint integrasi `GET /courses/by-user/:userId` akan dipakai oleh Gateway.

3. **API Gateway (port 4000)**
   ```bash
   cd api-gateway
   npm start
   ```
   - Pastikan kedua service di atas sudah hidup sebelum Gateway dijalankan untuk menghindari error proxy.
   - Gateway akan menerima request frontend dan meneruskannya ke service terkait.

### 5. Jalankan Antarmuka Web (Opsional tapi Disarankan)
Frontend statis berada di root (`index.html`, `dashboard.html`) dan masing-masing service memiliki halaman khusus (`student-service/student.html`, `course-service/course.html`).  
Karena API Gateway hanya mengizinkan origin `http://localhost:5000`, jalankan static server pada port tersebut, misalnya dengan `http-server`:

```bash
cd EduConnect-Project
npx http-server . -p 5000
# atau gunakan VS Code Live Server dan set port ke 5000
```

Setelah server statis aktif:
- `http://localhost:5000/index.html`: Landing page.  
- `http://localhost:5000/dashboard.html`: Menampilkan ringkasan data siswa/kursus.  
- `http://localhost:5000/student-service/student.html`: CRUD siswa via API Gateway.  
- `http://localhost:5000/course-service/course.html`: CRUD mata kuliah via API Gateway.

### 6. Verifikasi API di Lokal
Gunakan cURL/Postman untuk memastikan service menjawab dengan benar via Gateway:
```bash
# Cek daftar siswa
curl http://localhost:4000/gateway/users

# Tambah siswa baru
curl -X POST http://localhost:4000/gateway/users ^
     -H "Content-Type: application/json" ^
     -d "{\"name\": \"Dina Rahma\", \"email\": \"dina.rahma@educonnect.id\"}"

# Ambil daftar kursus
curl http://localhost:4000/gateway/courses

# Lihat kursus yang diambil siswa ID 1
curl http://localhost:4000/gateway/user-courses/1
```
Jika response berhasil, dashboard dan halaman detail akan dapat memuat data yang sama.

### 7. Dokumentasi Swagger
- `http://localhost:3001/api-docs`: Dokumentasi Student Service (`student-service/swagger.yaml`).  
- `http://localhost:3002/api-docs`: Dokumentasi Course Service (`course-service/swagger.yaml`).  
Swagger memudahkan pengujian manual per endpoint sebelum mengintegrasikannya ke Gateway.

### 8. Troubleshooting Umum
- **Koneksi database gagal**: cek kembali isi `.env`, pastikan `DB_HOST` dapat diakses dan user MySQL memiliki izin.  
- **Port sudah terpakai**: hentikan aplikasi lain atau ubah konstanta `PORT` di tiap `server.js` (pastikan Gateway ikut diperbarui).  
- **CORS error di browser**: dashboard harus dilayani dari `http://localhost:5000`. Jika memakai port berbeda, ubah konfigurasi `cors({ origin: 'http://localhost:5000' })` di `api-gateway/server.js`.  
- **Gateway tidak mengembalikan data**: periksa log terminal Student/Course Service; biasanya error kredensial DB atau service mati akan terlihat di sana.  
- **Data preview kosong**: jalankan ulang skrip `database_seed.sql` atau tambah data melalui halaman CRUD/Swagger.

---
Dengan mengikuti langkah-langkah di atas, Anda dapat menyiapkan database, menjalankan ketiga service, serta mengakses dashboard EduConnect sepenuhnya di lingkungan lokal Anda. Selamat mencoba!
