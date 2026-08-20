import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
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
import AttemptReview from './pages/admin/AttemptReview';
import QuizMonitor from './pages/admin/QuizMonitor';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

import StudentLayout from "./components/StudentLayout";
import JoinQuiz from "./pages/student/JoinQuiz";
import StudentDashboard from './pages/student/Dashboard';
import QuizListing from './pages/student/QuizListing';
import QuizDetails from './pages/student/QuizDetails';
import ActiveQuiz from './pages/student/ActiveQuiz';
import QuizResult from './pages/student/QuizResult';
import Leaderboard from './pages/student/Leaderboard';
import StudentSettings from './pages/student/StudentSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen text-slate-900">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Landing />} />
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
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/settings" element={<StudentSettings />} />
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
                <Route path="attempts/:attemptId" element={<AttemptReview />} />
                <Route path="quizzes/:quizId/monitor" element={<QuizMonitor />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
