import { useQuery } from '@apollo/client';
import { GET_STUDENTS, GET_COURSES, GET_ENROLLMENTS } from '../graphql/queries';
import './Dashboard.css';

const Dashboard = () => {
  const { data: studentsData, loading: studentsLoading } = useQuery(GET_STUDENTS);
  const { data: coursesData, loading: coursesLoading } = useQuery(GET_COURSES);
  const { data: enrollmentsData, loading: enrollmentsLoading } = useQuery(GET_ENROLLMENTS);

  const students = studentsData?.students || [];
  const courses = coursesData?.courses || [];
  const enrollments = enrollmentsData?.enrollments || [];

  const isLoading = studentsLoading || coursesLoading || enrollmentsLoading;

  // Get recent enrollments (last 5)
  const recentEnrollments = [...enrollments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>
            Welcome to <span className="text-gradient">EduConnect</span>
          </h1>
          <p className="text-muted">Your modern education management platform</p>
        </div>

        {/* Summary Cards */}
        <div className="stats-grid">
          <div className="stat-card card card-students">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">
                {isLoading ? '...' : students.length}
              </div>
              <div className="stat-label">Total Students</div>
            </div>
          </div>

          <div className="stat-card card card-courses">
            <div className="stat-icon">📖</div>
            <div className="stat-content">
              <div className="stat-value">
                {isLoading ? '...' : courses.length}
              </div>
              <div className="stat-label">Total Courses</div>
            </div>
          </div>

          <div className="stat-card card card-enrollments">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">
                {isLoading ? '...' : enrollments.length}
              </div>
              <div className="stat-label">Total Enrollments</div>
            </div>
          </div>

          <div className="stat-card card card-average">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">
                {isLoading
                  ? '...'
                  : students.length > 0
                  ? (enrollments.length / students.length).toFixed(1)
                  : '0'}
              </div>
              <div className="stat-label">Avg Enrollments/Student</div>
            </div>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="dashboard-section">
          <h2>Recent Enrollments</h2>
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : recentEnrollments.length === 0 ? (
            <div className="card text-center text-muted">
              <p>No enrollments yet</p>
            </div>
          ) : (
            <div className="enrollments-list">
              {recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="enrollment-item card">
                  <div className="enrollment-info">
                    <div className="enrollment-student">
                      <span className="student-icon">👤</span>
                      <strong>{enrollment.student.name}</strong>
                    </div>
                    <div className="enrollment-course">
                      <span className="course-icon">📖</span>
                      {enrollment.course.title}
                    </div>
                  </div>
                  {enrollment.grade && (
                    <div className={`grade-badge badge-${getGradeColor(enrollment.grade)}`}>
                      {enrollment.grade}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Courses */}
        <div className="dashboard-section">
          <h2>All Courses</h2>
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="card text-center text-muted">
              <p>No courses available</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => {
                const enrollmentCount = enrollments.filter(
                  (e) => e.course.id === course.id
                ).length;
                return (
                  <div key={course.id} className="course-card card">
                    <div className="course-header">
                      <h3>{course.title}</h3>
                      <span className="badge badge-primary">{course.credits} Credits</span>
                    </div>
                    <div className="course-lecturer">
                      <span>👨‍🏫</span> {course.lecturer}
                    </div>
                    <div className="course-enrollment-count">
                      <span>👥</span> {enrollmentCount} students enrolled
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get grade color
const getGradeColor = (grade) => {
  if (!grade) return 'primary';
  const g = grade.toUpperCase();
  if (g.startsWith('A')) return 'success';
  if (g.startsWith('B')) return 'primary';
  if (g.startsWith('C')) return 'warning';
  return 'danger';
};

export default Dashboard;
