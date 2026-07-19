import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SavedRoadmaps() {
  const { userProfile } = useAuth();
  const dreamCareer = userProfile?.dreamCareer || userProfile?.careerGoal || localStorage.getItem("career") || "Software Engineer";
  const progress = userProfile?.progress || 0;

  return (
    <div className="container mt-5 py-3">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Saved Roadmaps</h1>
        <p className="text-muted">Access all your active and saved learning paths.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-4 bg-white mb-3" style={{ borderRadius: "20px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0 text-dark">🚀 {dreamCareer} Roadmap</h4>
              <span className="badge bg-success px-3 py-2 fs-6 rounded-pill">{progress}% Completed</span>
            </div>
            <p className="text-muted small">AI-generated step-by-step personalized learning path.</p>
            <div className="progress mb-3" style={{ height: "15px" }}>
              <div className="progress-bar bg-success" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-end">
              <Link to="/roadmap" className="btn btn-primary btn-sm rounded-pill px-4 fw-bold">
                Continue Roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
