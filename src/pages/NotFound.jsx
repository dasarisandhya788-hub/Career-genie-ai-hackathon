import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container text-center py-5 my-5">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h2 className="fw-bold mb-3">Page Not Found</h2>
      <p className="lead text-muted mb-4">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary rounded-pill px-5 py-3 fw-bold">
        Back to Landing Page
      </Link>
    </div>
  );
}
