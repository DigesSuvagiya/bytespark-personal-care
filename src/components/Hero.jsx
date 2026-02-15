import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <h1>Skincare That's Naturally Clean</h1>
        <p className="hero-subtitle">
          Dermatologically tested, naturally formulated personal care products 
          designed for your daily wellness. Trusted by families, crafted with care.
        </p>
        <div className="hero-cta">
          <Link to="/products" className="cta-button">Our Products</Link>
          <Link to="/learn-more" className="secondary">Learn More</Link>
        </div>
        <div className="hero-images-container">
          <div className="hero-image-single">
            <img src="/products/home_image.jpg" alt="Product showcase" loading="lazy" />
          </div>
          <div className="hero-image-single">
            <img src="/products/home2.jpg" alt="Skincare products" loading="lazy" />
          </div>
          <div className="hero-image-single">
            <img src="/products/home3.jpg" alt="Natural care" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}
