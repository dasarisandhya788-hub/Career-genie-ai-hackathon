import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../firebase/authService";

export default function Auth({ defaultTab }) {
  const { refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Set initial active tab from props or URL parameter (?tab=register or ?tab=login)
  const tabFromUrl = searchParams.get("tab");
  const initialTab = defaultTab || (tabFromUrl === "register" ? "register" : "login");
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    } else if (tabFromUrl === "register" || tabFromUrl === "login") {
      setActiveTab(tabFromUrl);
    }
  }, [defaultTab, tabFromUrl]);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Form States
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  // UI States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginEmail.trim() || !loginPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(loginEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const user = await loginUser(loginEmail.trim(), loginPassword);

      if (user) {
        await refreshProfile(user.uid);
      }

      // Redirect directly to Dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      let errorMsg = err.message || "Invalid email or password.";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        errorMsg = "Invalid email or password.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Please enter a valid email address.";
      } else if (err.code === "auth/user-disabled") {
        errorMsg = "This account has been disabled.";
      } else if (err.code) {
        errorMsg = `${err.code}: ${err.message}`;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Empty fields validation
    if (
      !registerName.trim() ||
      !registerEmail.trim() ||
      !registerPassword ||
      !registerConfirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Email validation
    if (!validateEmail(registerEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password length validation (min 8 characters)
    if (registerPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Password match validation
    if (registerPassword !== registerConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser(
        registerEmail.trim(),
        registerPassword,
        registerName.trim()
      );

      if (user) {
        await refreshProfile(user.uid);
      }

      // Redirect directly to Dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration Error:", err);
      let errorMsg = err.message || "Failed to create an account.";
      if (err.code === "auth/email-already-in-use") {
        errorMsg = "This email is already in use.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Please enter a valid email address.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "The password is too weak.";
      } else if (err.code) {
        errorMsg = `${err.code}: ${err.message}`;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container bg-light py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div className="auth-card shadow-lg bg-white rounded-4 p-4" style={{ width: "100%", maxWidth: "480px" }}>
        {/* Tab Headers */}
        <div className="auth-tabs-header d-flex border-bottom mb-4">
          <button
            onClick={() => handleTabChange("login")}
            className={`btn flex-fill py-3 fw-bold rounded-0 border-0 border-bottom border-3 ${
              activeTab === "login"
                ? "btn-light text-primary border-primary"
                : "btn-white text-muted border-transparent"
            }`}
            type="button"
          >
            Login
          </button>
          <button
            onClick={() => handleTabChange("register")}
            className={`btn flex-fill py-3 fw-bold rounded-0 border-0 border-bottom border-3 ${
              activeTab === "register"
                ? "btn-light text-primary border-primary"
                : "btn-white text-muted border-transparent"
            }`}
            type="button"
          >
            Register
          </button>
        </div>

        {/* Tab Forms Body */}
        <div className="auth-form-container px-2">
          <div className="text-center mb-4">
            <span className="fs-1">🧞‍♂️</span>
            <h3 className="fw-bold text-primary mt-2">CareerGeenieAI</h3>
            <p className="text-muted small">
              {activeTab === "login"
                ? "Sign in to access your customized dashboard"
                : "Register to build your personalized AI career roadmap"}
            </p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
                aria-label="Close"
              ></button>
            </div>
          )}

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} key="login-form" className="auth-form">
              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-bold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label fw-bold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-3 fw-bold shadow-sm rounded-pill mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} key="register-form" className="auth-form">
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-person text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-bold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-bold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="form-label fw-bold">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock-fill text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-3 fw-bold shadow-sm rounded-pill mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
