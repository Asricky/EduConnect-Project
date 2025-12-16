// Enrollment Resolvers
const pool = require('../../db');

const enrollmentResolvers = {
  Query: {
    // Get all enrollments
    enrollments: async () => {
      try {
        const result = await pool.query(
          'SELECT enrollment_id AS id, student_id, course_id, grade, created_at FROM enrollments ORDER BY enrollment_id'
        );
        return result.rows;
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        throw new Error('Failed to fetch enrollments');
      }
    },

    // Get single enrollment by ID
    enrollment: async (_, { id }) => {
      try {
        const result = await pool.query(
          'SELECT enrollment_id AS id, student_id, course_id, grade, created_at FROM enrollments WHERE enrollment_id = $1',
          [id]
        );
        if (result.rows.length === 0) {
          throw new Error('Enrollment not found');
        }
        return result.rows[0];
      } catch (error) {
        console.error('Error fetching enrollment:', error);
        throw error;
      }
    },

    // Get student with their enrolled courses (Integration Query)
    studentCourses: async (_, { studentId }) => {
      try {
        // Get student data
        const studentResult = await pool.query(
          'SELECT student_id AS id, name, email, created_at FROM students WHERE student_id = $1',
          [studentId]
        );
        
        if (studentResult.rows.length === 0) {
          throw new Error('Student not found');
        }

        // Get enrolled courses with grades
        const coursesResult = await pool.query(
          `SELECT c.title, c.credits, e.grade 
           FROM enrollments e
           JOIN courses c ON e.course_id = c.course_id
           WHERE e.student_id = $1
           ORDER BY c.title`,
          [studentId]
        );

        return {
          student: studentResult.rows[0],
          courses: coursesResult.rows,
        };
      } catch (error) {
        console.error('Error fetching student courses:', error);
        throw error;
      }
    },
  },

  Mutation: {
    // Create new enrollment
    createEnrollment: async (_, { input }) => {
      const { studentId, courseId, grade } = input;
      try {
        const result = await pool.query(
          'INSERT INTO enrollments (student_id, course_id, grade) VALUES ($1, $2, $3) RETURNING enrollment_id AS id, student_id, course_id, grade, created_at',
          [studentId, courseId, grade || null]
        );
        return result.rows[0];
      } catch (error) {
        console.error('Error creating enrollment:', error);
        if (error.code === '23503') { // Foreign key violation
          throw new Error('Student or Course does not exist');
        }
        throw new Error('Failed to create enrollment');
      }
    },

    // Update enrollment (grade)
    updateEnrollment: async (_, { id, input }) => {
      const { grade } = input;
      try {
        const result = await pool.query(
          'UPDATE enrollments SET grade = $1 WHERE enrollment_id = $2 RETURNING enrollment_id AS id, student_id, course_id, grade, created_at',
          [grade, id]
        );
        if (result.rows.length === 0) {
          throw new Error('Enrollment not found');
        }
        return result.rows[0];
      } catch (error) {
        console.error('Error updating enrollment:', error);
        throw new Error('Failed to update enrollment');
      }
    },

    // Delete enrollment
    deleteEnrollment: async (_, { id }) => {
      try {
        const result = await pool.query(
          'DELETE FROM enrollments WHERE enrollment_id = $1',
          [id]
        );
        if (result.rowCount === 0) {
          throw new Error('Enrollment not found');
        }
        return true;
      } catch (error) {
        console.error('Error deleting enrollment:', error);
        throw new Error('Failed to delete enrollment');
      }
    },
  },

  // Field resolvers for Enrollment type
  Enrollment: {
    student: async (parent) => {
      try {
        const result = await pool.query(
          'SELECT student_id AS id, name, email, created_at FROM students WHERE student_id = $1',
          [parent.student_id]
        );
        return result.rows[0];
      } catch (error) {
        console.error('Error fetching student for enrollment:', error);
        return null;
      }
    },

    course: async (parent) => {
      try {
        const result = await pool.query(
          'SELECT course_id AS id, title, credits, lecturer, created_at FROM courses WHERE course_id = $1',
          [parent.course_id]
        );
        return result.rows[0];
      } catch (error) {
        console.error('Error fetching course for enrollment:', error);
        return null;
      }
    },
  },
};

module.exports = enrollmentResolvers;
