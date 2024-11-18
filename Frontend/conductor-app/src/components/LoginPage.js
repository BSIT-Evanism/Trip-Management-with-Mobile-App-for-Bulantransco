// src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/mobile.css';
import Logo from '../components/src/logo.jpg';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'conductor' && password === 'password') {
      navigate('/home');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-page-wrapper">
      <img src={Logo} alt="App Logo" className="app-logo" />
      <h1 className="app-title">Conductor App</h1>
      <div className="login-container">
        <h2 className="login-subtitle">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
};

export default LoginPage;
