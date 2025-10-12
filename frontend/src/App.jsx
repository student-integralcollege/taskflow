import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import { Routes, Route, useNavigate } from 'react-router-dom'

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
  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
