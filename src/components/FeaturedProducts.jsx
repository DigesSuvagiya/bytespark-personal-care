import React from 'react'

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: 'Gentle Facial Cleanser',
      description: 'pH-balanced cleanser for sensitive skin',
      price: '₹499',
      icon: '🧼'
    },
    {
      id: 2,
      name: 'Hydrating Moisturizer',
      description: 'Lightweight hydration for all skin types',
      price: '₹599',
      icon: '✨'
    },
    {
      id: 3,
      name: 'Natural Body Lotion',
      description: 'Nourishing lotion with organic extracts',
      price: '₹449',
      icon: '🌿'
    },
    {
      id: 4,
      name: 'Hair Care Shampoo',
      description: 'Sulfate-free formula for healthy hair',
      price: '₹379',
      icon: '💆'
    }
  ]

  return (
    <section className="featured-products" id="products">
      <div className="section-container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Our most-loved personal care essentials</p>
        </div>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.icon}</div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price}</p>
                <button>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
