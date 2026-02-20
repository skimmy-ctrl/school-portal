import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { AdmissionsPage } from './pages/public/AdmissionsPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';

// Student Dashboard
import { StudentDashboard } from './pages/dashboard/student/Dashboard';
import { CoursesPage } from './pages/dashboard/student/CoursesPage';
import { AssignmentsPage } from './pages/dashboard/student/AssignmentsPage';
import { TimetablePage } from './pages/dashboard/student/TimetablePage';
import { GradesPage } from './pages/dashboard/student/GradesPage';

// Teacher Dashboard
import { TeacherDashboard } from './pages/dashboard/teacher/Dashboard';
import { TeacherClassesPage } from './pages/dashboard/teacher/ClassesPage';
import { TeacherAssignmentsPage } from './pages/dashboard/teacher/AssignmentsPage';
import { TeacherSubmissionsPage } from './pages/dashboard/teacher/SubmissionsPage';

// Admin Dashboard
import { AdminDashboard } from './pages/dashboard/admin/Dashboard';
import { StudentsPage } from './pages/dashboard/admin/StudentsPage';
import { TeachersPage } from './pages/dashboard/admin/TeachersPage';
import { ClassesPage } from './pages/dashboard/admin/ClassesPage';
import { AnnouncementsPage } from './pages/dashboard/admin/AnnouncementsPage';
import { AdminTimetable } from './pages/dashboard/admin/Timetable';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Student Dashboard Routes */}
          <Route
            path="/dashboard/student"
            element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/student/courses"
            element={<ProtectedRoute allowedRoles={['student']}><CoursesPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/student/assignments"
            element={<ProtectedRoute allowedRoles={['student']}><AssignmentsPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/student/timetable"
            element={<ProtectedRoute allowedRoles={['student']}><TimetablePage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/student/grades"
            element={<ProtectedRoute allowedRoles={['student']}><GradesPage /></ProtectedRoute>}
          />

          {/* Teacher Dashboard Routes */}
          <Route
            path="/dashboard/teacher"
            element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/teacher/classes"
            element={<ProtectedRoute allowedRoles={['teacher']}><TeacherClassesPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/teacher/assignments"
            element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAssignmentsPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/teacher/submissions"
            element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSubmissionsPage /></ProtectedRoute>}
          />

          {/* Admin Dashboard Routes */}
          <Route
            path="/dashboard/admin"
            element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/admin/students"
            element={<ProtectedRoute allowedRoles={['admin']}><StudentsPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/admin/teachers"
            element={<ProtectedRoute allowedRoles={['admin']}><TeachersPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/admin/classes"
            element={<ProtectedRoute allowedRoles={['admin']}><ClassesPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/admin/announcements"
            element={<ProtectedRoute allowedRoles={['admin']}><AnnouncementsPage /></ProtectedRoute>}
          />
          <Route 
            path="/dashboard/admin/timetable"
            element={<ProtectedRoute allowedRoles={['admin']}><AdminTimetable /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/admin/teachers"
            element={<ProtectedRoute allowedRoles={['admin']}><TeachersPage /></ProtectedRoute>}
          />

          {/* Fallback - redirect to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
