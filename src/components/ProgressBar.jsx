import React from "react";

export default function ProgressBar({ percentage, completedCount, totalSteps }) {
  return (
    <div className="card shadow-sm border-0 p-4 mb-4 bg-white" style={{ borderRadius: "20px" }}>
      <h4 className="mb-3 text-primary fw-bold">🎯 Your Learning Progress</h4>
      <div className="progress mb-3" style={{ height: "25px", borderRadius: "12px" }}>
        <div
          className="progress-bar progress-bar-striped progress-bar-animated bg-success fw-bold"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {percentage}%
        </div>
      </div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <span className="fw-bold text-secondary">
          Progress: {completedCount} of {totalSteps} steps completed
        </span>
        {percentage === 100 && (
          <span className="text-success fw-bold fs-5">
            🎉 Congratulations! You completed your roadmap!
          </span>
        )}
      </div>
    </div>
  );
}
