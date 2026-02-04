import React from 'react'
import { FiX } from 'react-icons/fi'

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
        <button className="modal-close" onClick={onClose} aria-label="Close product details">
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
              <button
                className="add-to-cart-btn"
                onClick={() => {
                  onAddToCart?.(product)
                  onClose()
                }}
              >Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
