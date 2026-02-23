import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export default function OrderSuccess() {
  const location = useLocation()
  const order = location.state?.order

  return (
    <div className="app">
      <Navigation />
      <section className="orders-page">
        <div className="section-container">
          <div className="order-card order-success-card">
            <h1>Order Placed Successfully</h1>
            <p>Your order has been confirmed and is being processed.</p>
            <p>
              <strong>Order ID:</strong> {order?._id || 'Unavailable'}
            </p>
            <p>
              <strong>Total:</strong> Rs.{order?.totalPrice ?? 0}
            </p>
            <div className="orders-actions">
              <Link to="/orders" className="cta-button">View Order History</Link>
              <Link to="/products" className="secondary">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
