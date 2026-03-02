import React from 'react'
import { FiX } from 'react-icons/fi'
import AccessibleModal from './AccessibleModal'

export default function ProductModal({ product, isOpen, onClose, onAddToCart, cartItems, increaseQuantity, decreaseQuantity }) {
  if (!product) return null

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      className="modal-content product-modal-content"
      ariaLabelledBy="product-modal-title"
    >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close product details">
          <FiX size={24} />
        </button>

        <div className="product-modal-body">
          <div className="product-modal-image">
                    {product.image ? (
                      <img
                        src={`/products/${product.image}`}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{ display: product.image ? 'none' : 'flex' }}>
                      {product.icon || '📦'}
                    </div>
          </div>
          <div className="product-modal-info">
            <h2 id="product-modal-title">{product.name}</h2>
            <p className="product-modal-category">{product.category}</p>
            <p className="product-modal-description">{product.description}</p>
            <p className="product-modal-price">₹{product.price}</p>

            <div className="product-modal-actions">
              {(() => {
                       const cartItem = cartItems.find(item => item.product?._id === product._id)
                    return cartItem ? (
                   <div className="product-qty-controls">
  <button
    type="button"
    className="product-qty-btn"
    onClick={(e) => {
      e.stopPropagation()
      decreaseQuantity(product._id)
    }}
  >
    −
  </button>

  <span className="product-qty-value">{cartItem.quantity}</span>

  <button
    type="button"
    className="product-qty-btn"
    onClick={(e) => {
      e.stopPropagation()
      increaseQuantity(product._id)
    }}
  >
    +
  </button>
</div>

           ) : (
           <button
          type="button"
          className="add-to-cart-btn"
            onClick={(e) => {
           e.stopPropagation()
          onAddToCart(product)
             }}
           >
          Add to Cart
           </button>
             )
           })()}
            </div>
          </div>
        </div>
    </AccessibleModal>
  )
}
