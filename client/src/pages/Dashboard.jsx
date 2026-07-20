import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../firebase/authService";

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const name = userProfile?.name || currentUser?.displayName || "Student";
  const email = userProfile?.email || currentUser?.email || "";
  const dreamCareer = userProfile?.dreamCareer || userProfile?.careerGoal || "";
  const careerStatus = userProfile?.careerStatus || "";
  const education = userProfile?.education || "Not specified";
  const currentYear = userProfile?.currentYear || "Not specified";
  const college = userProfile?.college || "Not specified";
  const studyHours = userProfile?.studyHours || "Not specified";
  const progress = userProfile?.progress || 0;
  const completedCount = userProfile?.completedTasks?.length || 0;

  // Format date of registration
  let joinDate = "Recently";
  if (userProfile?.createdAt) {
    try {
      if (userProfile.createdAt.seconds) {
        joinDate = new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } else if (userProfile.createdAt.toDate) {
        joinDate = userProfile.createdAt.toDate().toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } else {
        joinDate = new Date(userProfile.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch (e) {
      console.error("Error formatting join date:", e);
      joinDate = "Recently";
    }
  }

  return (
    <div className="container mt-5">
      {/* Welcome Header */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          <h1 className="display-5 fw-bold mb-2 text-primary" style={{ marginTop: "0" }}>
            Welcome back, {name}! 👋
          </h1>
          <p className="lead text-muted mb-0">Track your progress and follow your AI career roadmap.</p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
          <Link to="/profile" className="btn btn-outline-primary rounded-pill px-4 fw-bold">
            <i className="bi bi-person-fill me-2"></i>Profile
          </Link>
          <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-4 fw-bold">
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* Profile Overview Card */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 h-100 bg-white" style={{ borderRadius: "20px" }}>
            <div className="text-center mb-3">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                style={{ width: "80px", height: "80px", fontSize: "2rem", fontWeight: "bold" }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
              <h4 className="fw-bold mb-1">{name}</h4>
              <p className="text-muted small mb-2">{email}</p>
              <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">
                Member since: {joinDate}
              </span>
            </div>
            <hr />
            <div className="mt-2">
              <p className="mb-2 text-secondary">
                <i className="bi bi-person-fill me-2 text-primary"></i>
                <strong>User Name:</strong> {name}
              </p>
              <p className="mb-2 text-secondary">
                <i className="bi bi-star-fill me-2 text-warning"></i>
                <strong>Career Selected:</strong>{" "}
                <span className="badge bg-primary bg-opacity-10 text-primary fw-bold">
                  {dreamCareer || "Not selected yet"}
                </span>
              </p>
              <p className="mb-2 text-secondary">
                <i className="bi bi-mortarboard-fill me-2 text-info"></i>
                <strong>Education:</strong> {education} {currentYear !== "Not specified" ? `(${currentYear})` : ""}
              </p>
              <p className="mb-2 text-secondary">
                <i className="bi bi-building me-2 text-secondary"></i>
                <strong>College:</strong> {college}
              </p>
              <p className="mb-2 text-secondary">
                <i className="bi bi-clock-fill me-2 text-danger"></i>
                <strong>Study Hours:</strong> {studyHours} {studyHours !== "Not specified" ? "hrs/day" : ""}
              </p>
              <p className="mb-0 text-secondary">
                <i className="bi bi-check-circle-fill me-2 text-success"></i>
                <strong>Tasks Completed:</strong> {completedCount}
              </p>
            </div>
          </div>
        </div>

        {/* Career Roadmap Banner & Actions */}
        <div className="col-md-8">
          {!dreamCareer && careerStatus !== "exploring" ? (
            <div className="card shadow-sm border-0 p-5 text-center h-100 bg-white d-flex flex-column justify-content-center align-items-center" style={{ borderRadius: "20px" }}>
              <span className="fs-1 mb-3">🧭</span>
              <h3 className="fw-bold mb-3">Choose Your Career Dream</h3>
              <p className="text-muted mb-4" style={{ maxWidth: "500px" }}>
                You haven't selected a career path yet. Select your target career dream to generate your personalized AI roadmap.
              </p>
              <Link to="/select-career" className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-sm">
                <i className="bi bi-rocket-takeoff me-2"></i>Choose Career Dream
              </Link>
            </div>
          ) : (
            <div className="card shadow-sm border-0 p-4 h-100 bg-white d-flex flex-column justify-content-between" style={{ borderRadius: "20px" }}>
              <div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                  <div>
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-2">
                      Active Career Path
                    </span>
                    <h3 className="fw-bold mb-0 text-dark">
                      {dreamCareer}
                    </h3>
                  </div>
                  <Link to="/select-career" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                    <i className="bi bi-pencil me-1"></i>Change Career Dream
                  </Link>
                </div>

                {/* Progress bar */}
                <div className="mb-4 bg-light p-4 rounded-4 border">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold text-dark">Roadmap Completion Progress</span>
                    <span className="fw-bold text-success fs-5">{progress}%</span>
                  </div>
                  <div className="progress" style={{ height: "22px", borderRadius: "12px" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-success fw-bold"
                      role="progressbar"
                      style={{ width: `${progress}%` }}
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {progress}%
                    </div>
                  </div>
                </div>

                <div className="alert alert-primary border-0 bg-primary bg-opacity-10 text-primary d-flex align-items-center py-3 px-4 mb-4 rounded-4" role="alert">
                  <span className="fs-2 me-3">🚀</span>
                  <div>
                    <h6 className="fw-bold mb-1">Stay Focused & Consistent!</h6>
                    <small>You have completed {completedCount} steps on your path to becoming a {dreamCareer}.</small>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="row g-3 mt-3">
                <div className="col-sm-6">
                  <Link to="/roadmap" className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm">
                    <i className="bi bi-map-fill me-2"></i>Continue Roadmap
                  </Link>
                </div>
                <div className="col-sm-6">
                  <Link to="/profile" className="btn btn-outline-secondary w-100 py-3 fw-bold rounded-pill">
                    <i className="bi bi-person-circle me-2"></i>Profile
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
