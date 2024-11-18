import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './components/Login.css';
import logo from './components/src/logo.jpg'; // Ensure this path is correct

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      onLogin(); // Call to update authentication status
      navigate('/main'); // Redirect to main menu
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="squircle">
        <img src={logo} alt="Logo" className="logo" />
        <form onSubmit={handleLogin}>
          <input
            className="input-field"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
