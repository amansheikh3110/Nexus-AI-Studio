import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth }   from './context/AuthContext';
import { ThemeProvider }           from './context/ThemeContext';
import { ToastProvider }           from './context/ToastContext';
import ToastSystem                 from './components/ToastSystem';
import Login                       from './pages/Login';
import Dashboard                   from './pages/Dashboard';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastSystem />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}