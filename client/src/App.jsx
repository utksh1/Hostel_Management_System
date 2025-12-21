import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Placeholder components for other routes
const Rooms = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-secondary-900">Rooms Management</h2>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const Students = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-secondary-900">Students Management</h2>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const Payments = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-secondary-900">Payments</h2>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const Reports = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-secondary-900">Reports</h2>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

const Settings = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-secondary-900">Settings</h2>
    <p className="text-secondary-600 mt-2">Coming soon...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <Rooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;