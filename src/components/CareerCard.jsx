import React from "react";

export default function CareerCard({ title, icon, desc, color, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card h-100 border-2 cursor-pointer shadow-sm p-4 text-center transition-all ${
        isSelected ? "border-primary bg-primary bg-opacity-10" : "border-light bg-white"
      }`}
      style={{
        cursor: "pointer",
        borderRadius: "20px",
        transition: "all 0.3s ease",
        transform: isSelected ? "translateY(-5px)" : "none"
      }}
    >
      <div
        className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-${color || "primary"}`}
        style={{
          width: "60px",
          height: "60px",
          fontSize: "1.8rem",
          backgroundColor: isSelected ? "rgba(13, 110, 253, 0.15)" : "rgba(240, 242, 245, 0.9)"
        }}
      >
        <i className={`bi ${icon || "bi-briefcase-fill"}`}></i>
      </div>
      <h4 className="fw-bold fs-5 mb-2">{title}</h4>
      <p className="text-muted small mb-0">{desc}</p>
    </div>
  );
}
