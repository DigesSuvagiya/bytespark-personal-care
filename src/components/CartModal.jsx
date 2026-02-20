import React, { useState, useContext } from 'react'
import { FiX, FiTrash2 } from 'react-icons/fi'
import CheckoutModal from './CheckoutModal'
import { CartContext } from '../context/CartContext'

export default function CartModal({ isOpen, onClose, isLoggedIn }) {
  if (!isOpen) return null

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext)

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )

  const handleCheckout = () => {
    const token = localStorage.getItem("bytesparkToken");
    if (!isLoggedIn || !token) {
      alert("Please login first to proceed with checkout");
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content cart-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2>Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <div
                  key={item.product?._id || `cart-item-${index}`}   // ✅ FIXED KEY
                  className="cart-item"
                >
                  <div className="cart-item-icon">
                    {item.product?.image ? (
                      <img
                        src={`/products/${item.product.image}`}
                        alt={item.product.name}
                      />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.product?.name}</h4>
                    <p className="cart-item-category">{item.product?.category}</p>
                    <p className="cart-item-unit-price">₹{item.product?.price}</p>
                  </div>

                  <div className="cart-qty-controls">
                    <button
                      className="cart-qty-btn"
                      onClick={() => decreaseQuantity(item.product?._id)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => increaseQuantity(item.product?._id)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    ₹{(item.product?.price || 0) * item.quantity}
                  </div>

                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item.product?._id)}
                    aria-label="Remove from cart"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <p><strong>Total:</strong> ₹{totalPrice}</p>
            </div>

            <div className="cart-actions">
              <button onClick={handleCheckout}>Proceed to Checkout</button>
              <button onClick={onClose}>Continue Shopping</button>
            </div>
          </>
        )}

        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cartItems}
            totalPrice={totalPrice}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  )
}