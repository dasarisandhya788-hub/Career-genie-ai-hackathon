import React from "react";

export default function RoadmapCard({ stepNumber, title, description, isCompleted, onToggle }) {
  return (
    <div className={`timeline-item ${isCompleted ? "completed" : ""}`}>
      <div className="form-check d-flex align-items-center">
        <input
          className="form-check-input me-3 step-checkbox"
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <label className="form-check-label flex-grow-1 cursor-pointer">
          <h5 className="mb-1 fw-bold">Step {stepNumber}</h5>
          <p className="mb-0 text-muted step-description">{description || title}</p>
        </label>
      </div>
    </div>
  );
}
