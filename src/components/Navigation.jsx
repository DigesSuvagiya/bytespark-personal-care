import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiMoon, FiShoppingCart, FiSun, FiUser, FiX } from "react-icons/fi";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import CartModal from "./CartModal";
import OrderModal from "./OrderModal";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navigation() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/", { replace: true });
  };

  const handleLogin = ({ role }) => {
    setIsMenuOpen(false);
    if (role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("bytesparkTheme", nextTheme);
    setTheme(nextTheme);
  };

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
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
            <li className="navbar-menu-icons">
              {!isAdmin && (
                <button
                  className="icon-button cart-icon"
                  onClick={() => setIsCartOpen(true)}
                  aria-label={`Cart with ${cartItemCount} items`}
                  title="Shopping Cart"
                >
                  <FiShoppingCart size={28} />
                  {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                </button>
              )}
              <button
                className="icon-button theme-icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                title={theme === "dark" ? "Use light theme" : "Use dark theme"}
              >
                {theme === "dark" ? <FiSun size={26} /> : <FiMoon size={26} />}
              </button>
              {isAuthenticated ? (
                <button className="icon-button login-icon" onClick={handleLogout} title="Logout">
                  <FiLogOut size={28} />
                </button>
              ) : (
                <button
                  className="icon-button login-icon"
                  onClick={() => setIsLoginOpen(true)}
                  title="Login"
                >
                  <FiUser size={28} />
                </button>
              )}
            </li>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
            </li>
            {!isAdmin && (
              <li>
                <button
                  className="nav-link-button"
                  onClick={() => {
                    setIsOrderOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Orders
                </button>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              </li>
            )}
            <li>
              <Link to="/learn-more" onClick={() => setIsMenuOpen(false)}>
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignupClick={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
        onLogin={handleLogin}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onLoginClick={() => {
          setIsLoginOpen(true);
          setIsSignupOpen(false);
        }}
      />

      {!isAdmin && (
        <>
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            isLoggedIn={isAuthenticated}
          />
          <OrderModal
            isOpen={isOrderOpen}
            onClose={() => setIsOrderOpen(false)}
          />
        </>
      )}
    </>
  );
}
