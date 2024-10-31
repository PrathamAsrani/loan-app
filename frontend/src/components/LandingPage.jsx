// src/components/LandingPage.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';
import '../styles/LandingPage.css';

function LandingPage() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [loanAmount, setLoanAmount] = useState('');
  const [term, setTerm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    setMessage('');
  
    try {
      const data = JSON.parse(localStorage.getItem('auth'));
      console.log(data)
      const token = data?.token;
      const user_id = data?.user?.id; // Assume user_id is saved in localStorage
      const startDate = new Date().toISOString().split('T')[0]; // Current date in "YYYY-MM-DD" format
      console.log(loanAmount, term, user_id, startDate);
      const response = await axios.post(
        '/api/v1/loans/create-loan',
        {
          amount: loanAmount,
          terms: term,
          user_id,
          startDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        setMessage('Loan created successfully!');
      } else {
        setMessage(response.data.message || 'Loan creation failed.');
      }
    } catch (error) {
      console.error('Error creating loan:', error);
      setMessage('An error occurred during loan creation.');
    }
  };
  

  return (
    <div className="container">
      <h1>Welcome to AuthApp</h1>
      {isAuthenticated ? (
        <div>
          <h2>Loan Creation</h2>
          <p>Fill out the fields below to create a loan:</p>
          <form onSubmit={handleCreateLoan}>
            <input
              type="number"
              placeholder="Loan Amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Term (in months)"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
            />
            <button type="submit" className="submit-button">Create Loan</button>
          </form>
          {message && <p className="message">{message}</p>}
          <button onClick={handleSignOut} className="signout-button">Sign Out</button>
        </div>
      ) : (
        <div>
          <p>Sign in or Sign up to get started</p>
          <div className="button-container">
            <Link to="/signin" className="button">Sign In</Link>
            <Link to="/signup" className="button">Sign Up</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
