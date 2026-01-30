
import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Navigation from '../components/Navigation'
import ProductModal from '../components/ProductModal'
import { CartContext } from '../context/CartContext'
import api from "../api/axios";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  // Mock products as fallback
  const mockProducts = [
    { _id: 1, name: 'Gentle Facial Cleanser', description: 'pH-balanced cleanser for sensitive skin', price: 499, category: 'Skincare', icon: '🧼' },
    { _id: 2, name: 'Hydrating Moisturizer', description: 'Lightweight hydration for all skin types', price: 599, category: 'Skincare', icon: '✨' },
    { _id: 3, name: 'Vitamin C Serum', description: 'Brightening serum with natural vitamin C', price: 799, category: 'Skincare', icon: '💫' },
    { _id: 4, name: 'Night Repair Cream', description: 'Rich overnight nourishment formula', price: 649, category: 'Skincare', icon: '🌙' },
    { _id: 5, name: 'Hair Care Shampoo', description: 'Sulfate-free formula for healthy hair', price: 379, category: 'Hair Care', icon: '💆' },
    { _id: 6, name: 'Deep Conditioner', description: 'Intensive moisture treatment for dry hair', price: 449, category: 'Hair Care', icon: '🌿' },
    { _id: 7, name: 'Hair Serum', description: 'Smooth and shine-enhancing serum', price: 399, category: 'Hair Care', icon: '💎' },
    { _id: 8, name: 'Hair Oil', description: 'Nourishing oil for scalp and strands', price: 299, category: 'Hair Care', icon: '🫗' },
    { _id: 9, name: 'Natural Body Lotion', description: 'Nourishing lotion with organic extracts', price: 449, category: 'Body Care', icon: '🧴' },
    { _id: 10, name: 'Body Wash', description: 'Gentle cleansing gel for all skin types', price: 349, category: 'Body Care', icon: '🛁' },
    { _id: 11, name: 'Body Scrub', description: 'Exfoliating scrub with natural ingredients', price: 399, category: 'Body Care', icon: '✨' },
    { _id: 12, name: 'Body Butter', description: 'Rich, luxurious body butter', price: 549, category: 'Body Care', icon: '🧈' },
    { _id: 13, name: 'Hand Sanitizer', description: 'Effective 70% alcohol hand sanitizer', price: 149, category: 'Hygiene', icon: '🧼' },
    { _id: 14, name: 'Antibacterial Soap', description: 'Safe antibacterial formula', price: 99, category: 'Hygiene', icon: '🧴' },
    { _id: 15, name: 'Wet Wipes', description: 'Gentle cleansing wipes for on-the-go', price: 199, category: 'Hygiene', icon: '📦' },
    { _id: 16, name: 'Disinfectant Spray', description: 'Surface disinfectant spray', price: 249, category: 'Hygiene', icon: '💨' },
  ]

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get("/products");
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
          setError(null);
        } else {
          // Use mock products if API returns empty
          setProducts(mockProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        // Use mock products as fallback
        setProducts(mockProducts);
        setError('Using demo products');
      }
    };

    getProducts();
  }, []);
  
  
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory)

  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0 
  })

  const categories = ['All', 'Skincare', 'Hair Care', 'Body Care', 'Hygiene']

  const [selectedProduct, setSelectedProduct] = useState(null)
  const closeModal = () => setSelectedProduct(null)
  const { addToCart } = useContext(CartContext)

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      icon: product.icon || '📦',
      description: product.description,
    })
  }

  return (
    <div className="app">
      <Navigation />
      
    
      <section className="products-header">
        <div className="section-container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>Products</span>
          </div>
          <h1>Our Products</h1>
          <p className="products-subtitle">Explore our range of safe and effective personal care products</p>
        </div>
      </section>

      
      <section className="products-controls">
        <div className="section-container">
          <div className="controls-wrapper">
            
            <div className="filter-section">
              <h3 className="filter-title">Categories</h3>
              <div className="filter-buttons">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

           
            <div className="sort-section">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

    
      <section className="products-section">
        <div className="section-container">
          {sortedProducts.length > 0 ? (
            <div className="products-grid">
              {sortedProducts.map(product => (
                <div
                  key={product._id}
                  className="product-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedProduct(product)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedProduct(product)
                  }}
                  aria-label={`View details for ${product.name}`}
                >
                  <div className="product-image">{product.icon}</div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">₹{product.price}</p>
                      <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <h3>No products available</h3>
              <p>No products found in this category. Try selecting a different category.</p>
            </div>
          )}
        </div>
      </section>

      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={closeModal} />
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
      />

      <Footer />
    </div>
  )
}
