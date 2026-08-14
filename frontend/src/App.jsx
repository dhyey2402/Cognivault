import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import QuizManagement from './pages/admin/QuizManagement';
import QuizBuilder from './pages/admin/QuizBuilder';
import CategoryManagement from "./pages/admin/CategoryManagement";

import StudentLayout from "./components/StudentLayout";
import JoinQuiz from "./pages/student/JoinQuiz";
import StudentDashboard from './pages/student/Dashboard';
import QuizListing from './pages/student/QuizListing';
import QuizDetails from './pages/student/QuizDetails';
import ActiveQuiz from './pages/student/ActiveQuiz';
import QuizResult from './pages/student/QuizResult';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen text-slate-900 bg-[var(--color-background)]">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* General Protected Routes (Student & Admin) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<StudentLayout />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/quizzes" element={<QuizListing />} />
                <Route path="/quizzes/:quizId" element={<QuizDetails />} />
                <Route path="/quizzes/:quizId/attempt/:attemptId" element={<ActiveQuiz />} />
                <Route path="/join/:code" element={<JoinQuiz />} />
                <Route path="/results/:attemptId" element={<QuizResult />} />
              </Route>
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="quizzes" element={<QuizManagement />} />
                <Route path="quizzes/:quizId/builder" element={<QuizBuilder />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="analytics" element={<div className="p-6 text-slate-500">Analytics module is under construction.</div>} />
                <Route path="settings" element={<div className="p-6 text-slate-500">Settings module is under construction.</div>} />
              </Route>
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
