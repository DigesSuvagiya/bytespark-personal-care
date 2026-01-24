import React, { useState } from 'react'
import LoginModal from './LoginModal'

export default function Navigation() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            Byte<span>spark</span> Personal Care
          </div>
          <ul className="navbar-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#cart">Cart</a></li>
            <li>
              <button 
                className="login-link"
                onClick={() => setIsLoginOpen(true)}
              >
                👤 Login
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
