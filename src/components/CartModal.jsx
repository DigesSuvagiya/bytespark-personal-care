import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiX, FiTrash2 } from 'react-icons/fi'
import CheckoutModal from './CheckoutModal'
import OrderModal from './OrderModal'
import { CartContext } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import AccessibleModal from './AccessibleModal'

export default function CartModal({ isOpen, onClose, isLoggedIn }) {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext)

  const navigate = useNavigate()
  const { token } = useAuth()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isOrderOpen, setIsOrderOpen] = useState(false)

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )

  const handleCheckout = () => {
    if (!isLoggedIn || !token) {
      alert('Please login first to proceed with checkout')
      return
    }
    setIsCheckoutOpen(true)
  }

  const handleShopNow = () => {
    onClose()
    navigate('/products')
  }

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      className="modal-content cart-modal-content"
      ariaLabelledBy="cart-modal-title"
    >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close cart modal">
          <FiX size={24} />
        </button>

        <h2 id="cart-modal-title">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <>
            <p>Your cart is empty</p>
            <div className="cart-actions">
              <button type="button" onClick={() => setIsOrderOpen(true)}>Your Orders</button>
              <button type="button" onClick={handleShopNow}>Shop Now</button>
            </div>
          </>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <div
                  key={item.product?._id || `cart-item-${index}`}
                  className="cart-item"
                >
                  <div className="cart-item-icon">
                    {item.product?.image ? (
                      <img
                        src={`/products/${item.product.image}`}
                        alt={item.product.name}
                      />
                    ) : (
                      <span>??</span>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.product?.name}</h4>
                    <p className="cart-item-category">{item.product?.category}</p>
                    <p className="cart-item-unit-price">Rs.{item.product?.price}</p>
                  </div>

                  <div className="cart-qty-controls">
                    <button
                      type="button"
                      className="cart-qty-btn"
                      onClick={() => decreaseQuantity(item.product?._id)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      type="button"
                      className="cart-qty-btn"
                      onClick={() => increaseQuantity(item.product?._id)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    Rs.{(item.product?.price || 0) * item.quantity}
                  </div>

                  <button
                    type="button"
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
              <p><strong>Total:</strong> Rs.{totalPrice}</p>
            </div>

            <div className="cart-actions">
              <button type="button" onClick={handleCheckout}>Proceed to Checkout</button>
              <button type="button" onClick={onClose}>Continue Shopping</button>
            </div>
          </>
        )}

        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cartItems}
            totalPrice={totalPrice}
            onOrderPlaced={() => {
              setIsCheckoutOpen(false)
              onClose()
            }}
          />
        )}

        <OrderModal
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
        />
    </AccessibleModal>
  )
}
