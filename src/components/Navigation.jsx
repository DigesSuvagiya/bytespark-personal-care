import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun } from 'react-icons/fi'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'
import CartModal from './CartModal'
import OrderModal from './OrderModal'
import { CartContext } from '../context/CartContext'
import { FiMenu, FiX } from "react-icons/fi";


export default function Navigation() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  )
  const { cartItems } = useContext(CartContext)

  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("bytesparkToken");
  setIsLoggedIn(!!token);
}, []);

const handleLogout = () => {
  localStorage.removeItem("bytesparkToken");
  setIsLoggedIn(false);
};

const toggleTheme = () => {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', nextTheme)
  localStorage.setItem('bytesparkTheme', nextTheme)
  setTheme(nextTheme)
}

const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
          <Link to="/">Byte<span>spark</span> Personal Care</Link>
          </div>
          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
            <li className="navbar-menu-icons">
              <button
                className="icon-button cart-icon"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Cart with ${cartItemCount} items`}
                title="Shopping Cart"
              >
                <FiShoppingCart size={28} />
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </button>
              <button
                className="icon-button theme-icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                title={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
              >
                {theme === 'dark' ? <FiSun size={26} /> : <FiMoon size={26} />}
              </button>
              {isLoggedIn ? (
  <button className="icon-button login-icon" onClick={handleLogout} title="Logout">
    <FiLogOut size={28} />
  </button>
) : (
  <button className="icon-button login-icon" onClick={() => setIsLoginOpen(true)} title="Login">
    <FiUser size={28} />
  </button>
)}

            </li>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link></li>
            <li><button className="nav-link-button" onClick={() => { setIsOrderOpen(true); setIsMenuOpen(false) }}>Orders</button></li>
            <li><Link to="/learn-more" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
          </ul>
        </div>
      </nav>
      <LoginModal 
  isOpen={isLoginOpen} 
  onClose={() => setIsLoginOpen(false)} 
  onSignupClick={() => {
    setIsLoginOpen(false)
    setIsSignupOpen(true)
  }} 
  onLogin={() => setIsLoggedIn(true)} 
/>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)}  onLoginClick={()=> {
        setIsLoginOpen(true)
        setIsSignupOpen(false)
      }} />
      <CartModal 
  isOpen={isCartOpen} 
  onClose={() => setIsCartOpen(false)} 
  isLoggedIn={isLoggedIn} 
/>
      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
      />

    </> 
  )
}
