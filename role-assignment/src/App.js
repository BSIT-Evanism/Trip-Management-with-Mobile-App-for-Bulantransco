import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ConductorsAndInspectors from './ConductorsAndInspectors'; // Import your new component
import Login from './Login'; // Correct path to Login
import MainMenu from './MainPage'; // Ensure the path and name are correct
import ParentComponent from './ParentComponent';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/main" element={isAuthenticated ? <MainMenu /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/conductors-and-inspectors" element={<ConductorsAndInspectors />} /> {/* Add a route for ConductorsAndInspectors */}
      </Routes>
    </Router>
  );
}

export default App;
