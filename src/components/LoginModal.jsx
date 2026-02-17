import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import api from "../api/axios";


export default function LoginModal({ isOpen, onClose, onSignupClick, onLogin  }) {
  const [mobileNo, setMobileNo] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
  e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        number: mobileNo,  
        password,
      });

      alert("Login successful");

    

      localStorage.setItem("bytesparkToken", res.data.token);


      onLogin?.(res.data)

      onClose();

  } catch (error) {
    alert(
      error.response?.data?.message || "Login failed. Try again."
    );
  }
};

  if (!isOpen) return null

  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close login modal">
          <FiX size={24} />
        </button>
        
        <div className="modal-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="modal-footer">
          <p>
            Don't have an account?{' '}
            <button onClick={onSignupClick} className="signup-link-btn">Sign up here</button>
          </p>
        </div>
      </div>
    </div>
  )
}
