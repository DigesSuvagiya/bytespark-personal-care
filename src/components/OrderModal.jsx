import React, { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import api from '../api/axios'

export default function OrderModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return

    const fetchOrders = async () => {
      const token = localStorage.getItem('bytesparkToken')
      if (!token) {
        setOrders([])
        setError('Please login to view your orders.')
        return
      }

      setLoading(true)
      setError('')

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
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content order-modal-content"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close orders">
          <FiX size={24} />
        </button>

        <div className="orders-header-row">
          <h2>My Orders</h2>
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
    </div>
  )
}
