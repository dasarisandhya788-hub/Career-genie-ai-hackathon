import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { registerUser } from "../services/authService.js";
import { validateEmail, validatePassword } from "../utils/validators.js";

export default function Register() {
  const { refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser(email.trim(), password, name.trim());
      if (user) {
        await refreshProfile(user.uid);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Register Error:", err);
      let msg = err.message || "Failed to create account.";
      if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container bg-light py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div className="auth-card shadow-lg bg-white rounded-4 p-4" style={{ width: "100%", maxWidth: "440px" }}>
        <div className="text-center mb-4">
          <span className="fs-1">🧞‍♂️</span>
          <h3 className="fw-bold text-primary mt-2">CareerGeenieAI</h3>
          <p className="text-muted small">Create your account</p>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")}></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-person text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-envelope text-muted"></i>
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-lock text-muted"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-lock-fill text-muted"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-bold shadow-sm rounded-pill mt-2"
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-0">
            Already have an account? <Link to="/login" className="fw-bold text-primary text-decoration-none">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
