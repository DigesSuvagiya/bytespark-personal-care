import React, { useState, useEffect } from 'react'

export default function CheckoutModal({ isOpen, onClose, cartItems, totalPrice, user, onSuccess }) {
  if (!isOpen) return null

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'cod'
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, email: user.email || prev.email, fullName: user.name || prev.fullName }))
    }
  }, [user])

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state.trim()) e.state = 'State is required'
    if (!form.zip.trim()) e.zip = 'ZIP/Postal code is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simulate order submission
    try {
      await new Promise(resolve => setTimeout(resolve, 900))
      const order = {
        id: 'ORDER-' + Date.now(),
        items: cartItems,
        total: totalPrice,
        shipping: 'Free',
        buyer: { ...form }
      }
      onSuccess?.(order)
    } catch (err) {
      console.error('Order failed', err)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-content checkout-modal-content" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close checkout">
          ×
        </button>

        <h2>Checkout</h2>

        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} />
            {errors.fullName && <small className="field-error">{errors.fullName}</small>}
          </div>
          <div className="form-row">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </div>
          <div className="form-row">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
            {errors.phone && <small className="field-error">{errors.phone}</small>}
          </div>
          <div className="form-row">
            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} />
            {errors.address && <small className="field-error">{errors.address}</small>}
          </div>
          <div className="form-row split">
            <div>
              <label>City</label>
              <input name="city" value={form.city} onChange={handleChange} />
              {errors.city && <small className="field-error">{errors.city}</small>}
            </div>
            <div>
              <label>State</label>
              <input name="state" value={form.state} onChange={handleChange} />
              {errors.state && <small className="field-error">{errors.state}</small>}
            </div>
          </div>
          <div className="form-row">
            <label>ZIP / Postal Code</label>
            <input name="zip" value={form.zip} onChange={handleChange} />
            {errors.zip && <small className="field-error">{errors.zip}</small>}
          </div>

          <div className="form-row">
            <label>Payment Method</label>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option value="cod">Cash on Delivery</option>
              <option value="card">Card (mock)</option>
            </select>
          </div>

          <div className="order-summary">
            <div>Items: {cartItems.length}</div>
            <div>Total: ₹{totalPrice}</div>
          </div>

          <div className="checkout-actions">
            <button type="submit" className="checkout-confirm-btn" disabled={loading}>{loading ? 'Placing order...' : 'Place Order'}</button>
            <button type="button" className="checkout-cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
