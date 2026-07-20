import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestoreService";

export default function SelectCareer() {
  console.log("SELECT CAREER COMPONENT LOADED");
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [careerOptions, setCareerOptions] = useState([]);

  const name = userProfile?.name || currentUser?.displayName || "Student";

  useEffect(() => {
    fetch("/data/careers.json")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((c) => ({
          id: c.name,
          title: c.name,
          icon: c.icon || "bi-briefcase",
          desc: c.description,
          color: c.color || "primary"
        }));

        // Place "Not sure yet" at the very front for immediate visibility
        formatted.unshift({
          id: "Not sure yet",
          title: "Not sure yet 🤔",
          icon: "bi-question-circle-fill",
          desc: "Explore potential careers, search AI-curated suggestions, and take a discovery quiz.",
          color: "warning"
        });

        setCareerOptions(formatted);
      })
      .catch((err) => {
        console.error("Error loading careers database:", err);
        setError("Failed to load career paths database.");
      });
  }, []);

  const handleContinue = async () => {
    if (!selectedCareer) {
      setError("Please select a career option before continuing.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      if (selectedCareer === "Not sure yet") {
        await updateUserProfile(currentUser.uid, {
          dreamCareer: "Not sure yet",
          careerGoal: "Not sure yet",
          careerStatus: "exploring"
        });
        await refreshProfile(currentUser.uid);
        navigate("/student-profile");
        return;
      }

      await updateUserProfile(currentUser.uid, {
        dreamCareer: selectedCareer,
        careerGoal: selectedCareer, // Keep in sync for compatibility
        careerStatus: "decided"
      });
      await refreshProfile(currentUser.uid);
      navigate("/dashboard");
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
          Choose your dream career to create your personalized roadmap and start learning.
        </p>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close"></button>
          </div>
        )}
      </div>

      <div className="row g-4 justify-content-center w-100 mb-5" style={{ maxWidth: "1000px" }}>
        {careerOptions.map((option) => {
          const isSelected = selectedCareer === option.id;
          return (
            <div key={option.id} className="col-md-6 col-lg-4">
              <div
                onClick={() => {
                  setSelectedCareer(option.id);
                  setError("");
                }}
                className={`card h-100 border-2 cursor-pointer shadow-sm p-4 text-center transition-all ${isSelected
                  ? "border-primary bg-primary bg-opacity-10 scale-102"
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
                  className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-${option.color}`}
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

      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={!selectedCareer || isSaving}
          className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg transition-all"
          style={{
            minWidth: "220px",
            fontSize: "1.1rem",
            letterSpacing: "0.5px"
          }}
        >
          {isSaving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Generating Roadmap...
            </>
          ) : (
            <>
              Continue <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
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
