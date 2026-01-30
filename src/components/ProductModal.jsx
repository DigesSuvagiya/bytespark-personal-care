import React from 'react'

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content product-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close product details">×</button>

        <div className="product-modal-body">
          <div className="product-modal-image">
            <div className="product-image-large">{product.icon}</div>
          </div>
          <div className="product-modal-info">
            <h2 id="product-modal-title">{product.name}</h2>
            <p className="product-modal-category">{product.category}</p>
            <p className="product-modal-description">{product.description}</p>
            <p className="product-modal-price">₹{product.price}</p>

            <div className="product-modal-actions">
              <button
                className="add-to-cart-btn"
                onClick={() => {
                  onAddToCart?.(product)
                  onClose()
                }}
              >Add to Cart</button>
              <button className="modal-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
