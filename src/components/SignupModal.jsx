import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import api from "../api/axios";


export default function SignupModal({ isOpen, onClose , onLoginClick }) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)

  const handleSubmit = async (e) => {
  e.preventDefault();

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(mobileNo)) {
    alert("Please enter a valid 10-digit mobile number starting with 6-9.")
    return;

  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    alert("Password must be at least 8 characters long and contain both letters and numbers.")
    return;
  }

  if (password !== confirmPassword) {
    setPasswordMatch(false);
    return;
  }

  setPasswordMatch(true);

  try {
    await api.post("/auth/signup", {
      name,
      age,
      number: mobileNo, 
      password,
    });

    alert("Signup successful. Please login.");

  
    setName('');
    setAge('');
    setMobileNo('');
    setPassword('');
    setConfirmPassword('');

    
    onClose();
    onLoginClick();

  } catch (error) {
    alert(
      error.response?.data?.message || "Signup failed. Try again."
    );
  }
};


  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value)
    if (password && value !== password) {
      setPasswordMatch(false)
    } else {
      setPasswordMatch(true)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content signup-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close signup modal">
          <FiX size={24} />
        </button>
        
        <div className="modal-header">
          <h2>Create Account</h2>
          <p>Join Bytespark Personal Care community</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="18"
                max="120"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              placeholder="Enter your mobile number"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              className={!passwordMatch ? 'error' : ''}
              required
            />
            {!passwordMatch && (
              <span className="error-text">Passwords do not match</span>
            )}
          </div>

          <button type="submit" className="signup-btn">Create Account</button>
        </form>

        <div className="modal-footer">
          <p>
            Already have an account?
            <button onClick={onLoginClick} className="signup-link-btn">Sign in here</button>
          </p>
        </div>
      </div>
    </div>
  )
}
