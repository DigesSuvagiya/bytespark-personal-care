import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export default function LearnMore() {
  return (
    <div className="app">
      <Navigation />

      {/* Hero Section */}
      <section className="learn-more-hero">
        <div className="section-container">
          <h1>About <span>Bytespark</span> Personal Care</h1>
          <p className="subtitle">Naturally Clean. Dermatologically Tested. Trusted by Families.</p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="brand-story">
        <div className="section-container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Bytespark Personal Care was founded on a simple belief: skincare should be both effective and natural. 
                We understand that your skin is unique, which is why we've dedicated ourselves to creating products that 
                work with your skin, not against it.
              </p>
              <p>
                Every product in our collection is carefully formulated with dermatological testing and natural ingredients. 
                We believe in transparency, quality, and the power of nature combined with science.
              </p>
              <p>
                From families to professionals, our products have become a trusted part of daily wellness routines across the country.
              </p>
            </div>
            <div className="story-image">
              <img src="/products/home_background.jpg" alt="Brand story" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="our-values">
        <div className="section-container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Natural Ingredients</h3>
              <p>We source only the finest natural ingredients, free from harmful chemicals and cruelty-free.</p>
            </div>
            <div className="value-card">
              <h3>Dermatologically Tested</h3>
              <p>Every product undergoes rigorous dermatological testing to ensure safety and efficacy for all skin types.</p>
            </div>
            <div className="value-card">
              <h3>Quality First</h3>
              <p>We never compromise on quality. Each batch is carefully crafted with attention to detail.</p>
            </div>
            <div className="value-card">
              <h3>Trusted by Families</h3>
              <p>Used by thousands of families every day, our products have earned trust through consistent results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="product-categories-info">
        <div className="section-container">
          <h2>Our Product Categories</h2>
          <div className="categories-detail">
            <div className="category-item">
              <h3>Skincare</h3>
              <p>
                Our skincare range includes gentle cleansers, hydrating moisturizers, and powerful serums designed 
                to address various skin concerns. Each formula is pH-balanced and suitable for sensitive skin.
              </p>
            </div>
            <div className="category-item">
              <h3>Hair Care</h3>
              <p>
                Sulfate-free shampoos and nourishing conditioners that strengthen hair from root to tip. Our formulas 
                provide deep moisture without weighing hair down.
              </p>
            </div>
            <div className="category-item">
              <h3>Body Care</h3>
              <p>
                Luxurious body washes, lotions, and butters enriched with organic extracts. Perfect for daily nourishment 
                and pampering your entire body.
              </p>
            </div>
            <div className="category-item">
              <h3>Hygiene</h3>
              <p>
                Effective hygiene solutions including antibacterial soaps, hand sanitizers, and disinfectant products 
                that keep you and your family safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="section-container">
          <h2>Why Choose Bytespark?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-number">1</div>
              <h4>Scientifically Formulated</h4>
              <p>Backed by research and dermatological expertise</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">2</div>
              <h4>Natural Ingredients</h4>
              <p>No harmful chemicals, preservatives, or parabens</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">3</div>
              <h4>Cruelty-Free</h4>
              <p>Never tested on animals, always ethical</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">4</div>
              <h4>Affordable</h4>
              <p>Premium quality at accessible prices</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">5</div>
              <h4>Fast Shipping</h4>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">6</div>
              <h4>Customer Support</h4>
              <p>24/7 support to help with your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Are your products suitable for sensitive skin?</h4>
              <p>
                Yes! All our products are dermatologically tested and formulated to be gentle on sensitive skin. 
                If you have specific concerns, please consult the product details or contact our support team.
              </p>
            </div>
            <div className="faq-item">
              <h4>Are your products eco-friendly?</h4>
              <p>
                We're committed to sustainability. Our packaging is recyclable, and we use natural, 
                biodegradable ingredients wherever possible.
              </p>
            </div>
            <div className="faq-item">
              <h4>How long does shipping take?</h4>
              <p>
                Standard shipping typically takes 3-5 business days. We also offer express shipping options 
                for faster delivery.
              </p>
            </div>
            <div className="faq-item">
              <h4>Can I return products if I'm not satisfied?</h4>
              <p>
                Absolutely! We offer a 30-day money-back guarantee on all products. Your satisfaction is our priority.
              </p>
            </div>
            <div className="faq-item">
              <h4>Do you offer samples?</h4>
              <p>
                Yes! We provide sample packs so you can try our products before committing to full-size versions.
              </p>
            </div>
            <div className="faq-item">
              <h4>Are your products vegan?</h4>
              <p>
                Most of our products are vegan. Check individual product pages for specific ingredient information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="learn-more-cta">
        <div className="section-container">
          <h2>Ready to Transform Your Skincare Routine?</h2>
          <p>Explore our full range of naturally clean, dermatologically tested products.</p>
          <Link to="/products" className="cta-button">Shop Now</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
