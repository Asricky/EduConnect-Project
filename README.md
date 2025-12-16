# EduConnect - Modern GraphQL Education Platform

🚀 **EduConnect** adalah platform manajemen pendidikan modern yang dibangun dengan **GraphQL**, **PostgreSQL**, **React**, dan **Docker**. Aplikasi ini menyediakan sistem CRUD lengkap untuk mengelola **Students**, **Courses**, dan **Enrollments** dengan antarmuka modern dan responsif.

## 📸 Screenshots

> Modern dark theme dengan gradient styling dan smooth animations

## 🏗️ Arsitektur

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   React     │─────▶│ Apollo       │─────▶│  PostgreSQL  │
│  Frontend   │      │  GraphQL     │      │   Database   │
│  (Port 5000)│◀─────│  Server      │◀─────│              │
└─────────────┘      │  (Port 4000) │      └──────────────┘
                     └──────────────┘
```

**Tech Stack:**

- **Frontend:** React 18 + Vite + Apollo Client
- **Backend:** Node.js + Apollo Server + Express
- **Database:** PostgreSQL 15
- **Orchestration:** Docker + Docker Compose

## ✨ Fitur Utama

### 🎓 Students Management

- CRUD lengkap untuk data mahasiswa
- Validasi email unique
- Avatar dengan initial nama
- Grid layout responsif

### 📚 Courses Management

- Manajemen mata kuliah
- Credits tracking
- Informasi dosen pengampu
- Course enrollment statistics

### ✅ Enrollments Management

- Hubungkan mahasiswa dengan mata kuliah
- Grade management (A, B+, A-, dll)
- Visual grade badges dengan warna
- Relasi data Student + Course

### 📊 Dashboard

- Summary cards dengan statistik real-time
- Recent enrollments list
- Popular courses grid
- Average enrollments per student

### 💅 Modern UI/UX

- Dark theme dengan gradient accents
- Smooth animations & transitions
- Glassmorphism effects
- Fully responsive design
- Toast notifications

## 🚀 Quick Start dengan Docker

### Prerequisites

- Docker Desktop installed
- Docker Compose installed
- Port 4000, 5000, dan 5432 available

### 1. Clone Repository

```bash
git clone https://github.com/Asricky/EduConnect-Project.git
cd EduConnect-Project
```

### 2. Start dengan Docker Compose

```bash
docker-compose up -d
```

### 3. Akses Aplikasi

- **Frontend:** http://localhost:5000
- **GraphQL Playground:** http://localhost:4000/graphql
- **Database:** localhost:5432

### 4. Stop Services

```bash
docker-compose down
```

## 🛠️ Development Setup (Tanpa Docker)

### 1. Install PostgreSQL

Download dan install PostgreSQL 15+

### 2. Setup Database

```bash
# Login ke psql
psql -U postgres

# Jalankan init script
\i database/init.sql
```

### 3. Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 4. Configure Environment

Edit `.env` file di root folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=educonnect
DB_PASSWORD=educonnect123
DB_NAME=educonnect_db
GRAPHQL_PORT=4000
FRONTEND_URL=http://localhost:5000
```

### 5. Start Services

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### 6. Akses Aplikasi

- Frontend: http://localhost:5000
- GraphQL: http://localhost:4000/graphql

## 📡 GraphQL API

### Schema Overview

```graphql
type Student {
  id: ID!
  name: String!
  email: String!
  createdAt: String
}

type Course {
  id: ID!
  title: String!
  credits: Int!
  lecturer: String!
  createdAt: String
}

type Enrollment {
  id: ID!
  student: Student!
  course: Course!
  grade: String
  createdAt: String
}
```

### Example Queries

**Get All Students:**

```graphql
query {
  students {
    id
    name
    email
  }
}
```

**Get Student Courses:**

```graphql
query {
  studentCourses(studentId: "1") {
    student {
      name
      email
    }
    courses {
      title
      credits
      grade
    }
  }
}
```

### Example Mutations

**Create Student:**

```graphql
mutation {
  createStudent(input: { name: "John Doe", email: "john@example.com" }) {
    id
    name
    email
  }
}
```

**Create Enrollment:**

```graphql
mutation {
  createEnrollment(input: { studentId: "1", courseId: "2", grade: "A" }) {
    id
    grade
  }
}
```

## 📁 Struktur Project

```
EduConnect-Project/
├── backend/                 # GraphQL Backend
│   ├── graphql/
│   │   ├── schema.graphql   # GraphQL Schema
│   │   └── resolvers/       # Query & Mutation Resolvers
│   ├── db/                  # PostgreSQL Connection
│   ├── server.js            # Apollo Server
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable Components
│   │   ├── pages/           # Dashboard, Students, Courses, Enrollments
│   │   ├── graphql/         # Queries & Mutations
│   │   └── styles/          # CSS dengan Modern Design
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── database/
│   └── init.sql             # PostgreSQL Schema & Seed Data
│
├── docker-compose.yml       # Multi-container Orchestration
├── .env                     # Environment Variables
└── README.md
```

## 🐳 Docker Services

### PostgreSQL (postgres)

- **Image:** postgres:15-alpine
- **Port:** 5432
- **Database:** educonnect_db
- **Auto-initialize:** Runs init.sql on startup

### Backend (backend)

- **Build:** ./backend/Dockerfile
- **Port:** 4000
- **Depends:** postgres (healthy)
- **GraphQL Endpoint:** /graphql

### Frontend (frontend)

- **Build:** ./frontend/Dockerfile
- **Port:** 5000 (nginx)
- **Depends:** backend
- **Serves:** Production build

## 🔧 Environment Variables

| Variable       | Description           | Default               |
| -------------- | --------------------- | --------------------- |
| `DB_HOST`      | PostgreSQL host       | postgres              |
| `DB_PORT`      | PostgreSQL port       | 5432                  |
| `DB_USER`      | Database user         | educonnect            |
| `DB_PASSWORD`  | Database password     | educonnect123         |
| `DB_NAME`      | Database name         | educonnect_db         |
| `GRAPHQL_PORT` | Backend port          | 4000                  |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5000 |

## 🧪 Testing

### Test GraphQL API dengan curl

```bash
# Get all students
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ students { id name email } }"}'

# Create student
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { createStudent(input: { name: \"Alice\", email: \"alice@test.com\" }) { id name } }"}'
```

### Test dengan GraphQL Playground

Buka http://localhost:4000/graphql dan gunakan interactive playground untuk testing.

## 📦 Production Deployment

### Build Docker Images

```bash
docker-compose build
```

### Push to Container Registry

```bash
docker tag educonnect-backend:latest your-registry/educonnect-backend
docker tag educonnect-frontend:latest your-registry/educonnect-frontend
docker push your-registry/educonnect-backend
docker push your-registry/educonnect-frontend
```

### Deploy Options

- **Railway:** Deploy PostgreSQL + Backend + Frontend
- **Heroku:** Use Heroku Postgres + Container deployment
- **AWS:** ECS/Fargate + RDS PostgreSQL
- **DigitalOcean:** App Platform + Managed Database

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Check running containers
docker ps

# Stop specific container
docker stop educonnect-backend

# Or stop all
docker-compose down
```

### Database Connection Failed

```bash
# Check postgres health
docker logs educonnect-postgres

# Restart postgres
docker-compose restart postgres
```

### Frontend Can't Connect to Backend

- Check CORS settings in backend/server.js
- Verify FRONTEND_URL environment variable
- Check Vite proxy configuration

### Clear All Data

```bash
# Stop and remove volumes
docker-compose down -v

# Restart fresh
docker-compose up -d
```

## 📚 Migration dari REST Version

File-file REST API lama telah di-archive di folder `old-rest-version/`:

- api-gateway/
- student-service/
- course-service/
- \*.html files
- styles.css
- database_seed.sql (MySQL)

Untuk kembali ke REST version:

```bash
git checkout <commit-before-graphql>
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Asricky**

- GitHub: [@Asricky](https://github.com/Asricky)
- Repository: [EduConnect-Project](https://github.com/Asricky/EduConnect-Project)

---

⭐ **Star this repo** if you find it helpful!

🐛 Found a bug? Open an issue!

💡 Have suggestions? Create a pull request!
