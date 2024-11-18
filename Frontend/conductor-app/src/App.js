// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import DeparturePage from './components/DeparturePage';
import LocationDropdown from './components/LocationDropdown';  // Import the LocationDropdown component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/departure" element={<DeparturePage />} />
        {/* You can add a Route to render the LocationDropdown */}
        <Route path="/locations" element={<LocationDropdown />} />
      </Routes>
    </Router>
  );
}

export default App;
