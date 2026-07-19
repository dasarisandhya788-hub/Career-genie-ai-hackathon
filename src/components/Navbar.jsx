import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { logoutUser } from "../services/authService.js";

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout Error in Navbar:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 text-primary d-flex align-items-center gap-2" to={currentUser ? "/dashboard" : "/"}>
          <span>🧞‍♂️</span> CareerGeenieAI
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
          aria-controls="menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto align-items-center">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-semibold" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-semibold" to="/select-career">
                    Career
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-semibold" to="/roadmap">
                    Roadmap
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-semibold" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 fw-bold"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-semibold" to="/">
                    Landing Page
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-semibold" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-semibold" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-primary btn-sm rounded-pill px-4 py-2 fw-bold" to="/login">
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
