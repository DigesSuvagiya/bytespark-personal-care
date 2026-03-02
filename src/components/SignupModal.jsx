import React, { useEffect, useRef, useState } from "react";
import { FiX } from 'react-icons/fi'
import api from "../api/axios";
import AccessibleModal from "./AccessibleModal";


export default function SignupModal({ isOpen, onClose , onLoginClick }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef(null);
  const redirectTimerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setFormError("");
    setFormSuccess("");
  }, [isOpen]);

  useEffect(
    () => () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    },
    []
  );

  const validateField = (fieldName, value) => {
    const trimmed = String(value || "").trim();

    if (fieldName === "name") {
      if (!trimmed) return "Full name is required";
      if (trimmed.length < 2) return "Full name must be at least 2 characters";
    }

    if (fieldName === "age") {
      if (!trimmed) return "Age is required";
      const ageNumber = Number(trimmed);
      if (!Number.isFinite(ageNumber) || ageNumber < 18 || ageNumber > 120) {
        return "Enter an age between 18 and 120";
      }
    }

    if (fieldName === "mobileNo") {
      if (!trimmed) return "Mobile number is required";
      if (!/^[6-9]\d{9}$/.test(trimmed)) {
        return "Enter a valid 10-digit mobile number starting with 6-9";
      }
    }

    if (fieldName === "password") {
      if (!trimmed) return "Password is required";
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(trimmed)) {
        return "Password must be at least 8 characters with letters and numbers";
      }
    }

    if (fieldName === "confirmPassword") {
      if (!trimmed) return "Confirm password is required";
      if (trimmed !== password) return "Passwords do not match";
    }

    return "";
  };

  const validateForm = () => {
    const nextErrors = {
      name: validateField("name", name),
      age: validateField("age", age),
      mobileNo: validateField("mobileNo", mobileNo),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };

    Object.keys(nextErrors).forEach((key) => {
      if (!nextErrors[key]) delete nextErrors[key];
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFieldBlur = (fieldName, value) => {
    const message = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: message }));
  };

  const handleMobileChange = (value) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 10);
    setMobileNo(numericValue);
    setFormError("");

    if (errors.mobileNo) {
      setErrors((prev) => ({ ...prev, mobileNo: validateField("mobileNo", numericValue) }));
    }
  };

  const handleAgeChange = (value) => {
    const numericValue = value.replace(/[^\d]/g, "").slice(0, 3);
    setAge(numericValue);
    setFormError("");

    if (errors.age) {
      setErrors((prev) => ({ ...prev, age: validateField("age", numericValue) }));
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setFormError("");

    const nextErrors = {};
    if (errors.password) {
      nextErrors.password = validateField("password", value);
    }
    if (confirmPassword) {
      nextErrors.confirmPassword = validateField("confirmPassword", confirmPassword);
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    setFormError("");

    if (errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField("confirmPassword", value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await api.post("/auth/signup", {
        name: name.trim(),
        age,
        number: mobileNo,
        password,
      });

      setFormSuccess("Signup successful. Redirecting to login...");

      setName("");
      setAge("");
      setMobileNo("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      redirectTimerRef.current = setTimeout(() => {
        onClose();
        onLoginClick?.();
      }, 800);
    } catch (error) {
      setFormError(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      className="modal-content signup-modal"
      ariaLabelledBy="signup-modal-title"
      initialFocusRef={nameInputRef}
    >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close signup modal">
          <FiX size={24} />
        </button>
        
        <div className="modal-header">
          <h2 id="signup-modal-title">Create Account</h2>
          <p>Join Bytespark Personal Care community</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <input
                type="text"
                id="signup-name"
                ref={nameInputRef}
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleFieldBlur("name", name)}
                className={errors.name ? "error" : ""}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "signup-name-error" : undefined}
                required
              />
              {errors.name && (
                <small id="signup-name-error" className="field-error">
                  {errors.name}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="signup-age">Age</label>
              <input
                type="text"
                id="signup-age"
                inputMode="numeric"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => handleAgeChange(e.target.value)}
                onBlur={() => handleFieldBlur("age", age)}
                className={errors.age ? "error" : ""}
                aria-invalid={Boolean(errors.age)}
                aria-describedby={errors.age ? "signup-age-error" : undefined}
                required
              />
              {errors.age && (
                <small id="signup-age-error" className="field-error">
                  {errors.age}
                </small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-mobile">Mobile Number</label>
            <input
              type="tel"
              id="signup-mobile"
              placeholder="Enter your mobile number"
              value={mobileNo}
              onChange={(e) => handleMobileChange(e.target.value)}
              onBlur={() => handleFieldBlur("mobileNo", mobileNo)}
              className={errors.mobileNo ? "error" : ""}
              aria-invalid={Boolean(errors.mobileNo)}
              aria-describedby={errors.mobileNo ? "signup-mobile-error" : undefined}
              required
            />
            {errors.mobileNo && (
              <small id="signup-mobile-error" className="field-error">
                {errors.mobileNo}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => handleFieldBlur("password", password)}
              className={errors.password ? "error" : ""}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "signup-password-error" : undefined}
              required
            />
            {errors.password && (
              <small id="signup-password-error" className="field-error">
                {errors.password}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <input
              type="password"
              id="signup-confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              onBlur={() => handleFieldBlur("confirmPassword", confirmPassword)}
              className={errors.confirmPassword ? "error" : ""}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : undefined}
              required
            />
            {errors.confirmPassword && (
              <small id="signup-confirm-password-error" className="field-error">
                {errors.confirmPassword}
              </small>
            )}
          </div>

          {formError && (
            <p className="form-feedback form-feedback-error" role="alert">
              {formError}
            </p>
          )}
          {formSuccess && (
            <p className="form-feedback form-feedback-success" role="status">
              {formSuccess}
            </p>
          )}

          <button type="submit" className="signup-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            Already have an account?
            <button type="button" onClick={onLoginClick} className="signup-link-btn">
              Sign in here
            </button>
          </p>
        </div>
    </AccessibleModal>
  )
}
