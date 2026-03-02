import { CartContext } from "../context/CartContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FiX } from 'react-icons/fi'
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AccessibleModal from "./AccessibleModal";


export default function LoginModal({ isOpen, onClose, onSignupClick, onLogin  }) {
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mobileInputRef = useRef(null);

  const { refreshCart } = useContext(CartContext);
  const { login } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setFormError("");
  }, [isOpen]);

  const validateField = (fieldName, value) => {
    const trimmed = value.trim();

    if (fieldName === "mobileNo") {
      if (!trimmed) return "Mobile number is required";
      if (!/^[6-9]\d{9}$/.test(trimmed)) {
        return "Enter a valid 10-digit mobile number starting with 6-9";
      }
    }

    if (fieldName === "password" && !trimmed) {
      return "Password is required";
    }

    return "";
  };

  const validateForm = () => {
    const nextErrors = {
      mobileNo: validateField("mobileNo", mobileNo),
      password: validateField("password", password),
    };

    Object.keys(nextErrors).forEach((key) => {
      if (!nextErrors[key]) delete nextErrors[key];
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleMobileChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNo(numericValue);
    setFormError("");

    if (errors.mobileNo) {
      const message = validateField("mobileNo", numericValue);
      setErrors((prev) => ({ ...prev, mobileNo: message }));
    }
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    setFormError("");

    if (errors.password) {
      const message = validateField("password", value);
      setErrors((prev) => ({ ...prev, password: message }));
    }
  };

  const handleFieldBlur = (fieldName, value) => {
    const message = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: message }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", {
        number: mobileNo,
        password,
      });

      const role = res.data.role || "user";
      login({
        token: res.data.token,
        role,
      });

      if (role !== "admin") {
        await refreshCart();
      }

      onLogin?.({ ...res.data, role })

      onClose();

    } catch (error) {
      setFormError(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      className="modal-content"
      ariaLabelledBy="login-modal-title"
      initialFocusRef={mobileInputRef}
    >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close login modal">
          <FiX size={24} />
        </button>
        
        <div className="modal-header">
          <h2 id="login-modal-title">Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-mobile">Mobile Number</label>
            <input
              type="tel"
              id="login-mobile"
              ref={mobileInputRef}
              placeholder="Enter your mobile number"
              value={mobileNo}
              onChange={handleMobileChange}
              onBlur={() => handleFieldBlur("mobileNo", mobileNo)}
              aria-invalid={Boolean(errors.mobileNo)}
              aria-describedby={errors.mobileNo ? "login-mobile-error" : undefined}
              required
            />
            {errors.mobileNo && (
              <small id="login-mobile-error" className="field-error">
                {errors.mobileNo}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleFieldBlur("password", password)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              required
            />
            {errors.password && (
              <small id="login-password-error" className="field-error">
                {errors.password}
              </small>
            )}
          </div>

          {formError && (
            <p className="form-feedback form-feedback-error" role="alert">
              {formError}
            </p>
          )}

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            Don't have an account?{' '}
            <button type="button" onClick={onSignupClick} className="signup-link-btn">
              Sign up here
            </button>
          </p>
        </div>
    </AccessibleModal>
  )
}
