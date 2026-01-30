import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <h1>Skincare That's <span>Naturally Clean</span></h1>
        <p className="hero-subtitle">
          Dermatologically tested, naturally formulated personal care products 
          designed for your daily wellness. Trusted by families, crafted with care.
        </p>
        <div className="hero-cta">
          <Link to="/products" className="cta-button">Our Products</Link>
          <button className="secondary">Learn More</button>
        </div>
        <div className="hero-image">
          🧴
        </div>
      </div>
    </section>
  )
}
