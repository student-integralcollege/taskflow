import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PendingPage from './pages/PendingPage.jsx';
import CompletePage from './pages/CompletePage.jsx';
import Profile from './components/Profile.jsx';

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('currentuser');
    if (!token) return null;
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = Boolean(localStorage.getItem('token') && currentUser);

  useEffect(() => {
    if (currentUser && localStorage.getItem('token')) {
      localStorage.setItem('currentuser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentuser');
    }
  }, [currentUser]);

  const handleAuthSubmit = (data) => {
    const user = {
      name: data.name,
      email: data.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`,
    };
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    setCurrentUser(user);
    localStorage.setItem('currentuser', JSON.stringify(user));
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentuser');
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  const ProtectedLayout = () => {
    const token = localStorage.getItem('token');
    if (!token || !isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <Outlet />
      </Layout>
    );
  };

  const PublicAuthRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center bg-black">
              <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
            </div>
          </PublicAuthRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicAuthRoute>
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center bg-black">
              <Signup onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
            </div>
          </PublicAuthRoute>
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/complete" element={<CompletePage />} />
        <Route path="/profile" element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
      </Route>

      {/* Fallback for any unknown route */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
    </Routes>
  );
};

export default App;

