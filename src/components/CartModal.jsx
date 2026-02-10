import React, { useState, useContext } from 'react'
import { FiX, FiTrash2 } from 'react-icons/fi'
import CheckoutModal from './CheckoutModal'
import { CartContext } from '../context/CartContext'

export default function CartModal({ isOpen, onClose, user }) {
  if (!isOpen) return null

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext)

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleCheckout = () => {
    if (!user) {
      alert('Please login first to proceed with checkout')
      return
    }
    setIsCheckoutOpen(true)
  }

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
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-icon">
                    {item.image ? (
                      <img src={`/products/${item.image}`} alt={item.name} />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>{item.category}</p>

                    <div className="cart-qty-controls">
                      <button
                       className="cart-qty-btn"
                       onClick={() => decreaseQuantity(item.id)}
                      >
                      −
                   </button>

                   <span className="cart-qty-value">{item.quantity}</span>

                  <button
                  className="cart-qty-btn"
                 onClick={() => increaseQuantity(item.id)}
                  >
                   +
                 </button>
                  </div>


                    <p>₹{item.price}</p>
                  </div>

                  <div className="cart-item-total">
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item.id)}
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
            user={user}
          />
        )}
      </div>
    </div>
  )
}
