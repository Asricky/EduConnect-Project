# 🐳 Panduan Menjalankan EduConnect dengan Docker Desktop

Panduan lengkap step-by-step untuk menjalankan aplikasi EduConnect menggunakan Docker Desktop.

---

## 📋 Prasyarat

### 1. Install Docker Desktop

**Download:**

- Windows: https://docs.docker.com/desktop/install/windows-install/
- Mac: https://docs.docker.com/desktop/install/mac-install/

**Verifikasi instalasi:**

```bash
docker --version
docker-compose --version
```

**Output yang diharapkan:**

```
Docker version 24.x.x
Docker Compose version v2.x.x
```

### 2. Pastikan Docker Desktop Running

- Buka Docker Desktop
- Tunggu hingga status di taskbar menunjukkan "Docker Desktop is running"
- Ikon whale harus berwarna (bukan abu-abu)

---

## 🚀 Langkah-Langkah Menjalankan Aplikasi

### **Step 1: Clone atau Buka Project**

```bash
cd c:\github\EduConnect-Project
```

### **Step 2: Pastikan File Docker Ada**

Cek apakah file-file ini ada:

```bash
dir
```

Harus ada:

- ✅ `docker-compose.yml`
- ✅ `backend\Dockerfile`
- ✅ `frontend\Dockerfile`
- ✅ `database\init.sql`
- ✅ `.env`

### **Step 3: Stop Service yang Menggunakan Port**

Pastikan port 4000, 5000, dan 5432 tidak digunakan:

**Cek port yang terpakai:**

```powershell
netstat -ano | findstr :4000
netstat -ano | findstr :5000
netstat -ano | findstr :5432
```

**Jika ada yang terpakai, stop prosesnya:**

```powershell
# Ganti <PID> dengan Process ID yang muncul
taskkill /PID <PID> /F
```

### **Step 4: Build dan Start Containers**

```bash
docker-compose up -d
```

**Penjelasan flag:**

- `up`: Membuat dan menjalankan containers
- `-d`: Detached mode (background)

**Output yang diharapkan:**

```
[+] Running 4/4
 ✔ Network educonnect-project_educonnect-network  Created
 ✔ Container educonnect-postgres                  Started
 ✔ Container educonnect-backend                   Started
 ✔ Container educonnect-frontend                  Started
```

**⏱️ Waktu build pertama kali: ~3-5 menit**

### **Step 5: Monitor Startup Progress**

**Lihat logs semua services:**

```bash
docker-compose logs -f
```

**Atau lihat per service:**

```bash
# Backend
docker-compose logs -f backend

# Frontend
docker-compose logs -f frontend

# Database
docker-compose logs -f postgres
```

**Tekan `Ctrl+C` untuk keluar dari logs**

### **Step 6: Cek Status Containers**

```bash
docker-compose ps
```

**Output yang diharapkan:**

```
NAME                     STATUS         PORTS
educonnect-backend       Up 2 minutes   0.0.0.0:4000->4000/tcp
educonnect-frontend      Up 2 minutes   0.0.0.0:5000->80/tcp
educonnect-postgres      Up 2 minutes   0.0.0.0:5432->5432/tcp
```

**✅ Semua harus status "Up"**

### **Step 7: Verifikasi Database Initialized**

```bash
docker exec -it educonnect-postgres psql -U educonnect -d educonnect_db -c "\dt"
```

**Output yang diharapkan:**

```
             List of relations
 Schema |    Name     | Type  |   Owner
--------+-------------+-------+------------
 public | students    | table | educonnect
 public | courses     | table | educonnect
 public | enrollments | table | educonnect
```

**Cek seed data:**

```bash
docker exec -it educonnect-postgres psql -U educonnect -d educonnect_db -c "SELECT COUNT(*) FROM students;"
```

**Harus ada 3 students**

### **Step 8: Test Backend GraphQL**

**Buka browser:** http://localhost:4000/graphql

**Test query:**

```graphql
{
  students {
    id
    name
    email
  }
}
```

**Klik tombol ▶️ (Play)**

**Response yang diharapkan:**

```json
{
  "data": {
    "students": [
      {
        "id": "1",
        "name": "Alya Pratama",
        "email": "alya.pratama@educonnect.id"
      },
      ...
    ]
  }
}
```

### **Step 9: Akses Frontend**

**Buka browser:** http://localhost:5000

**Yang harus muncul:**

- ✅ Navbar dengan gradient ungu
- ✅ Dashboard dengan 4 summary cards
- ✅ Recent enrollments list
- ✅ Courses grid

### **Step 10: Test CRUD Operations**

**1. Test Create Student:**

- Klik menu "Students"
- Klik tombol "➕ Add Student"
- Isi form:
  - Name: Test Student
  - Email: test@educonnect.id
- Klik "Create"
- ✅ Toast notification "Student created successfully!"
- ✅ Card baru muncul di grid

**2. Test Edit Student:**

- Klik "✏️ Edit" pada student
- Ubah nama
- Klik "Update"
- ✅ Data terupdate

**3. Test Delete Student:**

- Klik "🗑️ Delete"
- Konfirmasi
- ✅ Card hilang dari grid

**4. Test Courses & Enrollments:**

- Ulangi langkah yang sama untuk Courses dan Enrollments

---

## 🛠️ Docker Desktop UI Guide

### Cara Menggunakan Docker Desktop

**1. Buka Docker Desktop:**

- Klik icon Docker di taskbar

**2. Tab "Containers":**

- Lihat semua running containers
- Klik nama container untuk melihat:
  - Logs
  - Stats (CPU, Memory)
  - Files
  - Exec (terminal)

**3. Actions per Container:**

- ▶️ **Start**: Jalankan container
- ⏸️ **Pause**: Pause container
- ⏹️ **Stop**: Stop container
- 🔄 **Restart**: Restart container
- 🗑️ **Delete**: Hapus container

**4. Tab "Images":**

- Lihat semua Docker images
- Hapus images yang tidak terpakai

**5. Tab "Volumes":**

- Lihat data volumes
- `educonnect-project_postgres-data` → Database persistence

---

## 🔧 Command Reference

### Manajemen Containers

```bash
# Start containers
docker-compose up -d

# Stop containers (data tetap ada)
docker-compose down

# Stop dan hapus volumes (data hilang)
docker-compose down -v

# Restart semua containers
docker-compose restart

# Restart satu container
docker-compose restart backend

# Stop semua
docker-compose stop

# Lihat status
docker-compose ps

# Lihat logs
docker-compose logs -f

# Rebuild containers (jika ada perubahan code)
docker-compose up -d --build
```

### Debug & Troubleshooting

```bash
# Masuk ke container backend
docker exec -it educonnect-backend sh

# Masuk ke container frontend
docker exec -it educonnect-frontend sh

# Masuk ke PostgreSQL
docker exec -it educonnect-postgres psql -U educonnect -d educonnect_db

# Lihat resource usage
docker stats

# Inspect container
docker inspect educonnect-backend

# Lihat network
docker network ls
docker network inspect educonnect-project_educonnect-network
```

---

## ❌ Troubleshooting

### Problem 1: Port Already in Use

**Error:**

```
Error: bind: address already in use
```

**Solusi:**

```powershell
# Cek proses yang menggunakan port
netstat -ano | findstr :5000

# Kill process (ganti <PID>)
taskkill /PID <PID> /F

# Atau stop semua containers dulu
docker-compose down

# Lalu start lagi
docker-compose up -d
```

### Problem 2: Backend Can't Connect to Database

**Error di logs:**

```
Error: connect ECONNREFUSED postgres:5432
```

**Solusi:**

```bash
# Cek postgres health
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres

# Tunggu postgres ready, lalu restart backend
docker-compose restart backend
```

### Problem 3: Frontend Shows Blank Page

**Solusi:**

```bash
# Cek logs frontend
docker-compose logs frontend

# Cek logs backend
docker-compose logs backend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Problem 4: Database Tables Not Created

**Solusi:**

```bash
# Stop everything dan hapus volume
docker-compose down -v

# Start fresh (akan run init.sql lagi)
docker-compose up -d

# Tunggu 10-15 detik, lalu cek tables
docker exec -it educonnect-postgres psql -U educonnect -d educonnect_db -c "\dt"
```

### Problem 5: Docker Desktop Not Starting

**Solusi:**

1. Restart Docker Desktop
2. Jika masih error, restart komputer
3. Check Windows Updates (Docker butuh WSL2 update)
4. Reinstall Docker Desktop

### Problem 6: Build Failed - No Space Left

**Error:**

```
no space left on device
```

**Solusi:**

```bash
# Clean up unused containers
docker container prune

# Clean up unused images
docker image prune -a

# Clean up volumes (HATI-HATI: data hilang)
docker volume prune

# Clean up everything
docker system prune -a --volumes
```

---

## 🧹 Cleanup Commands

### Hapus Semua (Fresh Start)

```bash
# Stop semua containers
docker-compose down -v

# Hapus images project
docker rmi educonnect-project-backend
docker rmi educonnect-project-frontend

# Atau hapus semua images
docker image prune -a

# Start fresh
docker-compose up -d --build
```

### Hapus Data Database Saja

```bash
# Stop containers
docker-compose down

# Hapus volume postgres saja
docker volume rm educonnect-project_postgres-data

# Start lagi (database fresh dengan seed data)
docker-compose up -d
```

---

## 📊 Monitoring & Logs

### Lihat Resource Usage Real-time

```bash
docker stats
```

**Output:**

```
CONTAINER           CPU %   MEM USAGE / LIMIT     MEM %
educonnect-backend  0.05%   52MiB / 7.8GiB       0.65%
educonnect-frontend 0.00%   23MiB / 7.8GiB       0.29%
educonnect-postgres 0.01%   45MiB / 7.8GiB       0.56%
```

### Export Logs ke File

```bash
# All logs
docker-compose logs > logs.txt

# Backend only
docker-compose logs backend > backend-logs.txt

# Last 100 lines
docker-compose logs --tail=100 > recent-logs.txt
```

---

## 🔄 Development Workflow

### Setelah Edit Code

**Backend changes:**

```bash
# Rebuild dan restart backend
docker-compose up -d --build backend
```

**Frontend changes:**

```bash
# Rebuild dan restart frontend
docker-compose up -d --build frontend
```

**Database schema changes:**

```bash
# Edit database/init.sql
# Lalu recreate database
docker-compose down -v
docker-compose up -d
```

### Hot Reload (Optional - Development Mode)

Untuk development dengan hot reload, lebih baik run local:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## ✅ Success Checklist

Setelah `docker-compose up -d`, pastikan semua ini ✅:

- [ ] Docker Desktop running
- [ ] 3 containers status "Up" di `docker-compose ps`
- [ ] GraphQL Playground buka di http://localhost:4000/graphql
- [ ] Frontend buka di http://localhost:5000
- [ ] Dashboard menampilkan data
- [ ] Create student berhasil
- [ ] Update student berhasil
- [ ] Delete student berhasil
- [ ] Courses CRUD works
- [ ] Enrollments CRUD works

---

## 🎓 Tips & Best Practices

1. **Always check logs first** jika ada error
2. **Use `docker-compose down -v`** untuk fresh start
3. **Stop containers** saat tidak digunakan (hemat resource)
4. **Backup database** sebelum `down -v`:
   ```bash
   docker exec educonnect-postgres pg_dump -U educonnect educonnect_db > backup.sql
   ```
5. **Monitor resource usage** dengan `docker stats`

---

## 🚀 Quick Commands Summary

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Status
docker-compose ps

# Rebuild
docker-compose up -d --build

# Fresh start
docker-compose down -v && docker-compose up -d

# Clean all
docker system prune -a --volumes
```

---

## 🆘 Need Help?

Jika masih ada masalah:

1. Check logs: `docker-compose logs`
2. Check status: `docker-compose ps`
3. Restart: `docker-compose restart`
4. Fresh start: `docker-compose down -v && docker-compose up -d`
5. Check README.md untuk troubleshooting tambahan

**Selamat menggunakan EduConnect! 🎉**
