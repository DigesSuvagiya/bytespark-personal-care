import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'
import CartModal from './CartModal'
import { CartContext } from '../context/CartContext'

export default function Navigation() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems, removeFromCart } = useContext(CartContext)

  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('bytesparkUser')
      if (raw) setUser(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to parse stored user', e)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('bytesparkUser')
    setUser(null)
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            Byte<span>spark</span> Personal Care
          </div>
          <ul className="navbar-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li>
              <button
                className="cart-link"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Cart with ${cartItemCount} items`}
                title="Shopping Cart"
              >
                <FiShoppingCart size={28} />
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </button>
            </li>
            <li>
              {user ? (
                <button className="login-link" onClick={handleLogout} title="Logout">
                  <FiLogOut size={28} />
                </button>
              ) : (
                <button className="login-link" onClick={() => setIsLoginOpen(true)} title="Login">
                  <FiUser size={28} />
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSignupClick={() => {
        setIsLoginOpen(false)
        setIsSignupOpen(true)
      }} onLogin={(userData) => setUser(userData)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)}  onLoginClick={()=> {
        setIsLoginOpen(true)
        setIsSignupOpen(false)
      }} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} removeFromCart={removeFromCart} user={user} />
    </> 
  )
}
