import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Psikotes from './pages/Psikotes';
import Compass from './pages/Compass';
import Journal from './pages/Journal';
import SkillPathway from './pages/SkillPathway';
import SkillChallenge from './pages/SkillChallenge';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Manifesto from './pages/Manifesto';
import Help from './pages/Help';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/help" element={<Help />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/psikotes" element={
            <ProtectedRoute>
              <Psikotes />
            </ProtectedRoute>
          } />
          <Route path="/compass" element={
            <ProtectedRoute>
              <Compass />
            </ProtectedRoute>
          } />
          <Route path="/journal" element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          } />
          <Route path="/skill-pathway" element={
            <ProtectedRoute>
              <SkillPathway />
            </ProtectedRoute>
          } />
          <Route path="/skills" element={
            <ProtectedRoute>
              <SkillPathway />
            </ProtectedRoute>
          } />
          <Route path="/skills/:skillId" element={
            <ProtectedRoute>
              <SkillChallenge />
            </ProtectedRoute>
          } />
          <Route path="/skill-challenge" element={
            <ProtectedRoute>
              <SkillChallenge />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
