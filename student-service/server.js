// student-service/server.js

require('dotenv').config(); // Untuk menggunakan .env
const express = require('express');
const mysql = require('mysql2/promise'); // Menggunakan promise
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.json()); // Middleware untuk parsing JSON

// --- Konfigurasi Database ---
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// --- Endpoint API Siswa (Users) ---

// Inisialisasi koneksi MySQL
const pool = mysql.createPool(dbConfig);

// Endpoint GET /users (Contoh: Menampilkan semua siswa)
app.get('/users', async (req, res) => {
    try {
        // Query sederhana ke DB (Asumsi tabel 'students' sudah ada)
        const [rows] = await pool.query('SELECT student_id AS id, name, email FROM students');
        // Format data: JSON [cite: 14]
        res.status(200).json(rows); 
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint GET /users/:id (Contoh: Menampilkan siswa berdasarkan ID)
app.get('/users/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT student_id AS id, name, email FROM students WHERE student_id = ?', [studentId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint POST, PUT, DELETE juga perlu ditambahkan [cite: 16]

// --- Dokumentasi Swagger (OpenAPI) ---
// Muat file YAML (akan dibuat di langkah berikutnya)
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
//BENERIN INI app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); [cite: 39]

// --- Mulai Server ---
app.listen(PORT, () => {
    console.log(`Student Service berjalan di http://localhost:${PORT}`);
    console.log(`Dokumentasi Swagger tersedia di http://localhost:${PORT}/api-docs`);
});