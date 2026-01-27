import React, { useState } from 'react'
import Footer from '../components/Footer'
import Navigation from '../components/Navigation'

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  const products = [
    // Skincare
    { id: 1, name: 'Gentle Facial Cleanser', description: 'pH-balanced cleanser for sensitive skin', price: 499, category: 'Skincare', icon: '🧼' },
    { id: 2, name: 'Hydrating Moisturizer', description: 'Lightweight hydration for all skin types', price: 599, category: 'Skincare', icon: '✨' },
    { id: 3, name: 'Vitamin C Serum', description: 'Brightening serum with natural vitamin C', price: 799, category: 'Skincare', icon: '💫' },
    { id: 4, name: 'Night Repair Cream', description: 'Rich overnight nourishment formula', price: 649, category: 'Skincare', icon: '🌙' },
    
    // Hair Care
    { id: 5, name: 'Hair Care Shampoo', description: 'Sulfate-free formula for healthy hair', price: 379, category: 'Hair Care', icon: '💆' },
    { id: 6, name: 'Deep Conditioner', description: 'Intensive moisture treatment for dry hair', price: 449, category: 'Hair Care', icon: '🌿' },
    { id: 7, name: 'Hair Serum', description: 'Smooth and shine-enhancing serum', price: 399, category: 'Hair Care', icon: '💎' },
    { id: 8, name: 'Hair Oil', description: 'Nourishing oil for scalp and strands', price: 299, category: 'Hair Care', icon: '🫗' },
    
    // Body Care
    { id: 9, name: 'Natural Body Lotion', description: 'Nourishing lotion with organic extracts', price: 449, category: 'Body Care', icon: '🧴' },
    { id: 10, name: 'Body Wash', description: 'Gentle cleansing gel for all skin types', price: 349, category: 'Body Care', icon: '🛁' },
    { id: 11, name: 'Body Scrub', description: 'Exfoliating scrub with natural ingredients', price: 399, category: 'Body Care', icon: '✨' },
    { id: 12, name: 'Body Butter', description: 'Rich, luxurious body butter', price: 549, category: 'Body Care', icon: '🧈' },
    
    // Hygiene
    { id: 13, name: 'Hand Sanitizer', description: 'Effective 70% alcohol hand sanitizer', price: 149, category: 'Hygiene', icon: '🧼' },
    { id: 14, name: 'Antibacterial Soap', description: 'Safe antibacterial formula', price: 99, category: 'Hygiene', icon: '🧴' },
    { id: 15, name: 'Wet Wipes', description: 'Gentle cleansing wipes for on-the-go', price: 199, category: 'Hygiene', icon: '📦' },
    { id: 16, name: 'Disinfectant Spray', description: 'Surface disinfectant spray', price: 249, category: 'Hygiene', icon: '💨' },
  ]

  
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
                <div key={product.id} className="product-card">
                  <div className="product-image">{product.icon}</div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">₹{product.price}</p>
                    <button className="add-to-cart-btn">Add to Cart</button>
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

      <Footer />
    </div>
  )
}
