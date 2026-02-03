import React, { useState, useEffect, useContext } from 'react'
import { CartContext } from '../context/CartContext'
import ProductModal from './ProductModal'
import api from '../api/axios'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useContext(CartContext)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products')
        setProducts(res.data.slice(0, 4))
      } catch (err) {
        console.error('Failed to fetch featured products:', err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || '📦',
      description: product.description,
    })
  }

  return (
    <section className="featured-products" id="products">
      <div className="section-container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Our most-loved personal care essentials</p>
        </div>
        <div className="products-grid">
          {loading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>
              Loading featured products...
            </p>
          ) : products.length > 0 ? (
            products.map(product => (
              <div 
                key={product._id || product.id} 
                className="product-card"
                onClick={() => {
                  setSelectedProduct(product)
                  setIsModalOpen(true)
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSelectedProduct(product)
                    setIsModalOpen(true)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image">
                  {product.image ? (
                    <img
                      src={`/products/${product.image}`}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : null}
                  <div style={{ display: product.image ? 'none' : 'flex' }}>
                    {product.icon || "something went wrong"}
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">₹{product.price}</p>
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>
              No products available
            </p>
          )}
        </div>
      </div>
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        onAddToCart={handleAddToCart}
      />
    </section>
  )
}
