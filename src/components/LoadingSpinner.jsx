import React from "react";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: "50vh" }}>
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">{text}</span>
      </div>
      <p className="mt-3 text-muted fw-semibold">{text}</p>
    </div>
  );
}
