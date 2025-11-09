// api-gateway/server.js
const express = require('express');
const axios = require('axios'); // Untuk melakukan HTTP request ke service lain
const cors = require('cors'); // Penting untuk frontend

const app = express();
const PORT = 4000;

// Izinkan permintaan dari frontend (misalnya di port 5000 jika menggunakan React)
app.use(cors({ origin: 'http://localhost:5000' })); 
app.use(express.json());

// --- Endpoint Gateway untuk Student Service ---
app.get('/gateway/users', async (req, res) => {
    try {
        // Panggil Student Service (Service 1)
        const response = await axios.get('http://localhost:3001/users'); 
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error calling Student Service:', error.message);
        res.status(500).json({ message: 'Gagal mengambil data siswa' });
    }
});

// --- Endpoint Gateway untuk Course Service ---
app.get('/gateway/courses', async (req, res) => {
    try {
        // Panggil Course Service (Service 2)
        const response = await axios.get('http://localhost:3002/courses'); 
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error calling Course Service:', error.message);
        res.status(500).json({ message: 'Gagal mengambil data kursus' });
    }
});

// --- Integrasi Antar Layanan (Course Service memanggil Student Service) ---
// Contoh: Mendapatkan daftar kursus yang diambil oleh seorang siswa (membutuhkan data siswa)
app.get('/gateway/user-courses/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        // 1. Panggil Student Service untuk mendapatkan data siswa (Contoh integrasi antar service)
        const userResponse = await axios.get(`http://localhost:3001/users/${userId}`);
        const userData = userResponse.data;

        // 2. Panggil Course Service untuk mendapatkan kursus yang diambil oleh siswa tersebut
        // (Asumsi ada endpoint /courses/by-user/:userId di Course Service)
        const courseResponse = await axios.get(`http://localhost:3002/courses/by-user/${userId}`);
        const courseData = courseResponse.data;

        // Gabungkan dan kirim data [cite: 21]
        res.status(200).json({
            student: userData,
            courses_enrolled: courseData
        });

    } catch (error) {
        console.error('Error during inter-service communication:', error.message);
        res.status(500).json({ message: 'Gagal memproses data terintegrasi' });
    }
});


app.listen(PORT, () => {
    console.log(`API Gateway berjalan di http://localhost:${PORT}`);
});