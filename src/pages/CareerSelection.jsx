import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { updateUserProfile } from "../services/authService.js";
import { POPULAR_CAREERS } from "../data/careers.js";

export default function CareerSelection() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const { setSelectedCareer } = useUser();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(
    userProfile?.dreamCareer || userProfile?.careerGoal || localStorage.getItem("career") || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const name = userProfile?.name || currentUser?.displayName || "Student";

  const handleContinue = async () => {
    if (!selected) {
      setError("Please select a career option before continuing.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      localStorage.setItem("career", selected);
      setSelectedCareer(selected);

      if (currentUser) {
        await updateUserProfile(currentUser.uid, {
          dreamCareer: selected,
          careerGoal: selected,
          careerStatus: "decided"
        });
        await refreshProfile(currentUser.uid);
      }

      navigate("/student");
    } catch (err) {
      console.error("Error saving dream career:", err);
      setError(err.message || "Failed to save selected career. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotSureYet = async () => {
    if (currentUser) {
      try {
        await updateUserProfile(currentUser.uid, {
          careerStatus: "exploring",
          dreamCareer: ""
        });
        await refreshProfile(currentUser.uid);
      } catch (err) {
        console.error("Error setting exploring status:", err);
      }
    }
    navigate("/student?notSure=true");
  };

  return (
    <div className="container py-5 my-3 d-flex flex-column align-items-center" style={{ minHeight: "80vh" }}>
      {/* Header */}
      <div className="text-center mb-4" style={{ maxWidth: "700px" }}>
        <span className="fs-1">🧞‍♂️</span>
        <h1 className="display-5 fw-bold text-primary mt-2">Welcome, {name} 👋</h1>
        <p className="lead text-muted">
          Choose your dream career to customize your student details and AI learning roadmap.
        </p>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")}></button>
          </div>
        )}
      </div>

      {/* SINGLE Prominent "Not sure yet" Callout Banner */}
      <div 
        className="w-100 mb-5 p-4 rounded-4 text-white shadow-lg d-flex flex-column flex-md-row align-items-center justify-content-between gap-3"
        style={{
          maxWidth: "1100px",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #d946ef 100%)",
          borderRadius: "24px"
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div 
            className="rounded-circle bg-white text-purple d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
            style={{ width: "64px", height: "64px", fontSize: "2rem", color: "#7c3aed" }}
          >
            🧭
          </div>
          <div>
            <h4 className="fw-bold mb-1">Not sure what your dream career is?</h4>
            <p className="mb-0 text-white-50 small" style={{ fontSize: "0.95rem" }}>
              Provide your details (interests, strengths, field of study & hobbies) and let AI Genie analyze and suggest matching dream careers for you!
            </p>
          </div>
        </div>
        <button
          onClick={handleNotSureYet}
          className="btn btn-light rounded-pill px-4 py-3 fw-bold text-purple flex-shrink-0 shadow-sm transition-all"
          style={{ color: "#6d28d9", fontSize: "1rem" }}
        >
          <i className="bi bi-magic me-2"></i>
          Not Sure Yet? Help Me Decide <i className="bi bi-arrow-right ms-1"></i>
        </button>
      </div>

      {/* Career Options Grid (ONLY Real Careers) */}
      <div className="row g-4 justify-content-center w-100 mb-5" style={{ maxWidth: "1100px" }}>
        {POPULAR_CAREERS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <div key={option.id} className="col-md-6 col-lg-4">
              <div
                onClick={() => {
                  setSelected(option.id);
                  setError("");
                }}
                className={`card h-100 border-2 cursor-pointer shadow-sm p-4 text-center transition-all ${
                  isSelected
                    ? "border-primary bg-primary bg-opacity-10 scale-102 shadow"
                    : "border-light bg-white hover-shadow scale-hover"
                }`}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  transition: "all 0.3s ease",
                  transform: isSelected ? "translateY(-5px)" : "none"
                }}
              >
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-${option.color || "primary"}`}
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "1.8rem",
                    backgroundColor: isSelected ? "rgba(13, 110, 253, 0.15)" : "rgba(240, 242, 245, 0.9)"
                  }}
                >
                  <i className={`bi ${option.icon}`}></i>
                </div>
                <h4 className="fw-bold fs-5 mb-2">{option.title}</h4>
                <p className="text-muted small mb-0">{option.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={!selected || isSaving}
          className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg transition-all"
          style={{ minWidth: "260px", fontSize: "1.1rem" }}
        >
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              Continue to Student Details <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
            </>
          )}
        </button>
      </div>

      <style>{`
        .scale-hover:hover {
          transform: translateY(-5px);
          border-color: rgba(13, 110, 253, 0.3) !important;
        }
        .scale-102 {
          transform: scale(1.02);
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
