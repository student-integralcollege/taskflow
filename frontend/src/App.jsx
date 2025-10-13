import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Layout from './components/Layout.jsx'


const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentuser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentuser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentuser');
    }
  }, [currentUser]);

  const handleAuthSubmit = data => {
    const user = {
      name: data.name,
      email: data.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
    }
    setCurrentUser(user);
    navigate('/', { replace: true });
  }

  const handleLogout = () => {
    localStorage.removeItem('currentuser');
    setCurrentUser(null);
    navigate('/login', { replace: true });
  }

  const protectedLayout = () => {
      <Layout user={currentUser} onLogout={handleLogout}>
        <Outlet />
      </Layout>
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<div className='fixed inset-0 bg-opacity-50 flex items-center justify-center bg-black'>
         <Login onsubmit={handleAuthSubmit} onSwitchMode={()=>navigate('/signup')} />
        </div>} />
        <Route path="/signup" element={<div className='fixed inset-0 bg-opacity-50 flex items-center justify-center bg-black'>
         <Signup onsubmit={handleAuthSubmit} onSwitchMode={()=>navigate('/login')} />
        </div>} />
        <Route path="/" element={<Layout user={currentUser} onLogout={handleLogout} />} />
        <Route path="/profile" element={<Layout user={currentUser} onLogout={handleLogout} />} />
      </Routes>
    </>
  )
}

export default App
