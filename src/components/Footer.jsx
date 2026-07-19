import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container text-center">
        <div className="mb-2">
          <span className="fw-bold fs-5 text-primary">CareerGeenieAI</span>
        </div>
        <p className="text-white-50 small mb-0">
          © {new Date().getFullYear()} CareerGeenieAI. Empowering students with personalized AI career roadmaps.
        </p>
      </div>
    </footer>
  );
}
