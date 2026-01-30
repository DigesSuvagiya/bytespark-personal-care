
import React, { useState, useEffect, useContext } from 'react'
import Footer from '../components/Footer'
import Navigation from '../components/Navigation'
import ProductModal from '../components/ProductModal'
import { CartContext } from '../context/CartContext'
import api from "../api/axios";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState([])

useEffect(() => {
  const getProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  getProducts();
}, []);
  
  
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory)

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0 // featured (original order)
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
      
      {/* Page Header */}
      <section className="products-header">
        <div className="section-container">
          <div className="breadcrumb">
            <a href="/">Home</a> / <span>Products</span>
          </div>
          <h1>Our Products</h1>
          <p className="products-subtitle">Explore our range of safe and effective personal care products</p>
        </div>
      </section>

      {/* Filter & Sort Section */}
      <section className="products-controls">
        <div className="section-container">
          <div className="controls-wrapper">
            {/* Category Filters */}
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

            {/* Sort Dropdown */}
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

      {/* Products Grid */}
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
