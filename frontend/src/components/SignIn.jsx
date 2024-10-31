// src/components/SignIn.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../styles/SignIn.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('api/v1/auth/login', { email, password });
      if (response?.data?.success) {
        localStorage.setItem('auth', JSON.stringify(response.data));
        setIsAuthenticated(true);  // Set authentication status to true
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">Sign In</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SignIn;
