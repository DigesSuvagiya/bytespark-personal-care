import React, { useState } from 'react'
import { FiX, FiTrash2 } from 'react-icons/fi'
import CheckoutModal from './CheckoutModal'

export default function CartModal({ isOpen, onClose, cartItems, removeFromCart, user, clearCart }) {
  if (!isOpen) return null

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      alert('Please login first to proceed with checkout')
      return
    }
    setIsCheckoutOpen(true)
  }

  const handleOrderSuccess = (order) => {
    // Clear cart and notify user
    clearCart?.()
    alert(`Order placed successfully. Order id: ${order.id}`)
    setIsCheckoutOpen(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content cart-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close cart">
          <FiX size={24} />
        </button>

        <div className="cart-modal-header">
          <h2 id="cart-modal-title">Shopping Cart</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p className="empty-cart-text">Your cart is empty</p>
            <p className="empty-cart-hint">Start shopping to add items to your cart!</p>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-icon">
                    {item.image ? (
                      <img
                        src={`/products/${item.image}`}
                        alt={item.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{ display: item.image ? 'none' : 'flex' }}>
                      📦
                    </div>
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">₹{item.price}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <span className="qty-label">Qty: {item.quantity}</span>
                  </div>
                  <div className="cart-item-total">
                    <p className="item-total">₹{item.price * item.quantity}</p>
                  </div>
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    title="Remove item"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span className="shipping-free">Free</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <div className="cart-actions">
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <button className="continue-shopping-btn" onClick={onClose}>
                Continue Shopping
              </button>
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
            onSuccess={handleOrderSuccess}
          />
        )}
      </div>
    </div>
  )
}
