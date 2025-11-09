// course-service/server.js

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const PORT = 3002; // PORT yang berbeda dari Student Service (3001)

app.use(express.json());

// --- Konfigurasi Database ---
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
const pool = mysql.createPool(dbConfig);


// --- Endpoint API Kursus ---

// Endpoint GET /courses (Menampilkan semua kursus)
app.get('/courses', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT course_id AS id, title, credits, lecturer FROM courses');
        res.status(200).json(rows); 
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint GET /courses/:id (Menampilkan kursus berdasarkan ID)
app.get('/courses/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT course_id AS id, title, credits, lecturer FROM courses WHERE course_id = ?', [courseId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint Integrasi: Mendapatkan Kursus yang Diambil oleh Siswa (Dipanggil oleh API Gateway)
app.get('/courses/by-user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const query = `
            SELECT 
                c.title, c.credits, e.grade
            FROM 
                enrollments e
            JOIN 
                courses c ON e.course_id = c.course_id
            WHERE 
                e.student_id = ?`;
        const [rows] = await pool.query(query, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching courses by user:', error);
        res.status(500).json({ message: 'Internal Server Error on Course Integration' });
    }
});

// --- Dokumentasi Swagger (OpenAPI) ---
// (Asumsi file swagger.yaml sudah dibuat di folder course-service/)
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Mulai Server ---
app.listen(PORT, () => {
    console.log(`Course Service berjalan di http://localhost:${PORT}`);
    console.log(`Dokumentasi Swagger tersedia di http://localhost:${PORT}/api-docs`);
});