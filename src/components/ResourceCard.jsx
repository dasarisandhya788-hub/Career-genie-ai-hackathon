import React from "react";

export default function ResourceCard({ title, icon, color, items, renderItem }) {
  return (
    <div className="card h-100 border-0 bg-light p-3 rounded-4">
      <h6 className={`fw-bold text-${color || "primary"} mb-3 d-flex align-items-center gap-2`}>
        <i className={`bi ${icon || "bi-book"} fs-5`}></i> {title}
      </h6>
      <div className="d-flex flex-column gap-2">
        {items && items.map((item, index) => renderItem(item, index))}
      </div>
    </div>
  );
}
