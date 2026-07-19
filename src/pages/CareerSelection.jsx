import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { updateUserProfile } from "../services/authService.js";
import { POPULAR_CAREERS } from "../data/careers.js";
import CareerCard from "../components/CareerCard.jsx";

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

      // Flow step: Choose Career Dream -> Student Details
      navigate("/student");
    } catch (err) {
      console.error("Error saving dream career:", err);
      setError(err.message || "Failed to save selected career. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-5 my-3 d-flex flex-column align-items-center" style={{ minHeight: "80vh" }}>
      <div className="text-center mb-5" style={{ maxWidth: "650px" }}>
        <span className="fs-1">🧞‍♂️</span>
        <h1 className="display-5 fw-bold text-primary mt-3">Welcome, {name} 👋</h1>
        <p className="lead text-muted">
          Choose your career dream to customize your student details and AI learning roadmap.
        </p>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")}></button>
          </div>
        )}
      </div>

      <div className="row g-4 justify-content-center w-100 mb-5" style={{ maxWidth: "1100px" }}>
        {POPULAR_CAREERS.map((option) => (
          <div key={option.id} className="col-md-6 col-lg-4">
            <CareerCard
              title={option.title}
              icon={option.icon}
              desc={option.desc}
              color={option.color}
              isSelected={selected === option.id}
              onClick={() => {
                setSelected(option.id);
                setError("");
              }}
            />
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={!selected || isSaving}
          className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg"
          style={{ minWidth: "240px", fontSize: "1.1rem" }}
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
    </div>
  );
}
