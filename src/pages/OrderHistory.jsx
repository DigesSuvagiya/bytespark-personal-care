import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import api from '../api/axios'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('bytesparkToken')
      if (!token) {
        setError('Please login to view your orders.')
        setLoading(false)
        return
      }

      try {
        const res = await api.get('/orders/my-orders')
        setOrders(res.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="app">
      <Navigation />
      <section className="orders-page">
        <div className="section-container">
          <div className="orders-header-row">
            <h1>My Orders</h1>
            <Link to="/products" className="secondary">Shop More</Link>
          </div>

          {loading && <p>Loading orders...</p>}
          {!loading && error && <p className="orders-error">{error}</p>}

          {!loading && !error && orders.length === 0 && (
            <div className="order-card">
              <h3>No orders yet</h3>
              <p>You have not placed any order yet.</p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-meta">
                    <span><strong>Order ID:</strong> {order._id}</span>
                    <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</span>
                    <span><strong>Status:</strong> {order.status || order.orderStatus}</span>
                    <span><strong>Total:</strong> Rs.{order.totalPrice}</span>
                  </div>

                  <div className="order-items">
                    {(order.items || order.orderItems || []).map((item) => (
                      <div key={`${order._id}-${item.product}-${item.name}`} className="order-item-row">
                        <span>{item.name}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>Rs.{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
