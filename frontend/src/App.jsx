import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Enrollments from './pages/Enrollments';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <AnimatedBackground />
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/enrollments" element={<Enrollments />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
