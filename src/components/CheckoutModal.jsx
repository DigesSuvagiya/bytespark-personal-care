import React, { useContext, useEffect, useRef, useState } from "react";
import { FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { CartContext } from '../context/CartContext'
import AccessibleModal from "./AccessibleModal";

export default function CheckoutModal({ isOpen, onClose, cartItems, totalPrice, onOrderPlaced }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'cod',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [loading, setLoading] = useState(false)
  const fullNameInputRef = useRef(null)

  const navigate = useNavigate()
  const { clearCart } = useContext(CartContext)

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setSubmitError("");
  }, [isOpen]);

  const validateField = (fieldName, value) => {
    const trimmed = String(value || "").trim();

    if (fieldName === "fullName") {
      if (!trimmed) return "Full name is required";
      if (trimmed.length < 2) return "Enter a valid full name";
    }

    if (fieldName === "email") {
      if (!trimmed) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address";
    }

    if (fieldName === "phone") {
      const digitsOnly = trimmed.replace(/\D/g, "");
      if (!digitsOnly) return "Phone number is required";
      if (digitsOnly.length !== 10) return "Enter a valid 10-digit phone number";
    }

    if (fieldName === "address") {
      if (!trimmed) return "Address is required";
      if (trimmed.length < 5) return "Address is too short";
    }

    if (fieldName === "city" && !trimmed) return "City is required";
    if (fieldName === "state" && !trimmed) return "State is required";

    if (fieldName === "zip") {
      if (!trimmed) return "ZIP/Postal code is required";
      if (!/^[A-Za-z0-9 -]{4,10}$/.test(trimmed)) return "Enter a valid ZIP/Postal code";
    }

    return "";
  };

  const validate = () => {
    const nextErrors = {
      fullName: validateField("fullName", form.fullName),
      email: validateField("email", form.email),
      phone: validateField("phone", form.phone),
      address: validateField("address", form.address),
      city: validateField("city", form.city),
      state: validateField("state", form.state),
      zip: validateField("zip", form.zip),
    };

    Object.keys(nextErrors).forEach((key) => {
      if (!nextErrors[key]) delete nextErrors[key];
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  }

  const handleBlur = (name, value) => {
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError("");

    if (!validate()) return

    if (!cartItems?.length) {
      setSubmitError("Your cart is empty.");
      return
    }

    setLoading(true)

    try {
      const payload = {
        shipping: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
        },
        paymentMethod: form.paymentMethod,
      }

      const res = await api.post('/orders', payload)
      await clearCart()

      onOrderPlaced?.(res.data)
      navigate('/order-success', { state: { order: res.data } })
    } catch (err) {
      console.error('Order failed', err)
      setSubmitError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false)
    }
  }

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      className="modal-content checkout-modal-content"
      ariaLabelledBy="checkout-modal-title"
      initialFocusRef={fullNameInputRef}
    >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close checkout">
          <FiX size={20} />
        </button>

        <div className="modal-header">
          <h2 id="checkout-modal-title">Secure Checkout</h2>
          <p>Complete your order - fast, simple and secure</p>
        </div>

        <form className="signup-form checkout-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="checkout-full-name">Full Name</label>
            <input
              type="text"
              id="checkout-full-name"
              ref={fullNameInputRef}
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              onBlur={(e) => handleBlur("fullName", e.target.value)}
              className={errors.fullName ? "error" : ""}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "checkout-full-name-error" : undefined}
            />
            {errors.fullName && (
              <small id="checkout-full-name-error" className="field-error">
                {errors.fullName}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-email">Email</label>
            <input
              type="email"
              id="checkout-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={(e) => handleBlur("email", e.target.value)}
              className={errors.email ? "error" : ""}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "checkout-email-error" : undefined}
            />
            {errors.email && (
              <small id="checkout-email-error" className="field-error">
                {errors.email}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-phone">Phone</label>
            <input
              type="tel"
              id="checkout-phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={(e) => handleBlur("phone", e.target.value)}
              className={errors.phone ? "error" : ""}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
            />
            {errors.phone && (
              <small id="checkout-phone-error" className="field-error">
                {errors.phone}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-address">Address</label>
            <input
              type="text"
              id="checkout-address"
              name="address"
              value={form.address}
              onChange={handleChange}
              onBlur={(e) => handleBlur("address", e.target.value)}
              className={errors.address ? "error" : ""}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "checkout-address-error" : undefined}
            />
            {errors.address && (
              <small id="checkout-address-error" className="field-error">
                {errors.address}
              </small>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="checkout-city">City</label>
              <input
                type="text"
                id="checkout-city"
                name="city"
                value={form.city}
                onChange={handleChange}
                onBlur={(e) => handleBlur("city", e.target.value)}
                className={errors.city ? "error" : ""}
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? "checkout-city-error" : undefined}
              />
              {errors.city && (
                <small id="checkout-city-error" className="field-error">
                  {errors.city}
                </small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="checkout-state">State</label>
              <input
                type="text"
                id="checkout-state"
                name="state"
                value={form.state}
                onChange={handleChange}
                onBlur={(e) => handleBlur("state", e.target.value)}
                className={errors.state ? "error" : ""}
                aria-invalid={Boolean(errors.state)}
                aria-describedby={errors.state ? "checkout-state-error" : undefined}
              />
              {errors.state && (
                <small id="checkout-state-error" className="field-error">
                  {errors.state}
                </small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="checkout-zip">ZIP / Postal Code</label>
            <input
              type="text"
              id="checkout-zip"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              onBlur={(e) => handleBlur("zip", e.target.value)}
              className={errors.zip ? "error" : ""}
              aria-invalid={Boolean(errors.zip)}
              aria-describedby={errors.zip ? "checkout-zip-error" : undefined}
            />
            {errors.zip && (
              <small id="checkout-zip-error" className="field-error">
                {errors.zip}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-payment">Payment Method</label>
            <select
              id="checkout-payment"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="cod">Cash on Delivery</option>
              <option value="card">Card</option>
            </select>
          </div>
          {submitError && (
            <p className="form-feedback form-feedback-error" role="alert">
              {submitError}
            </p>
          )}

          <div className="order-summary themed-summary">
            <div>Items: {cartItems.length}</div>
            <div className="summary-amount">Rs.{totalPrice}</div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? 'Placing order...' : 'Place Order'}
            </button>
          </div>
        </form>
    </AccessibleModal>
  )
}
