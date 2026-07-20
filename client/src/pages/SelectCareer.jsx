import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestoreService";

const defaultInitialOptions = [
  {
    id: "Not sure yet",
    title: "Not sure yet?",
    icon: "bi-magic",
    desc: "Let AI analyze your interests, strengths & hobbies to suggest matching dream careers.",
    color: "warning",
    isSpecial: true
  },
  {
    id: "Software Engineer",
    title: "Software Engineer",
    icon: "bi-code-slash",
    desc: "Technology • ₹5,00,000 - ₹25,00,000 per annum",
    color: "primary"
  },
  {
    id: "AI Engineer",
    title: "AI Engineer",
    icon: "bi-cpu",
    desc: "Technology • ₹6,50,000 - ₹28,00,000 per annum",
    color: "info"
  },
  {
    id: "Medical Doctor (MBBS)",
    title: "Medical Doctor (MBBS)",
    icon: "bi-hospital",
    desc: "Healthcare & Medicine • ₹7,00,000 - ₹30,00,000+ per annum",
    color: "danger"
  },
  {
    id: "Chartered Accountant (CA)",
    title: "Chartered Accountant (CA)",
    icon: "bi-calculator-fill",
    desc: "Business & Finance • ₹8,00,000 - ₹30,00,000+ per annum",
    color: "primary"
  }
];

export default function SelectCareer() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [careerOptions, setCareerOptions] = useState(defaultInitialOptions);

  const name = userProfile?.name || currentUser?.displayName || "Student";

  useEffect(() => {
    fetch("/data/careers.json")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((c) => ({
          id: c.name,
          title: c.name,
          icon: c.icon || "bi-briefcase",
          desc: `${c.category} • ${c.salary}`,
          color: c.color || "primary"
        }));
        
        // Add "Not sure yet" option at index 0
        formatted.unshift({
          id: "Not sure yet",
          title: "Not sure yet?",
          icon: "bi-magic",
          desc: "Let AI analyze your interests, strengths & hobbies to suggest matching dream careers.",
          color: "warning",
          isSpecial: true
        });

        setCareerOptions(formatted);
      })
      .catch((err) => {
        console.error("Error loading careers database:", err);
      });
  }, []);

  const handleContinue = async () => {
    if (!selectedCareer) {
      setError("Please select a career option before continuing.");
      return;
    }

    if (selectedCareer === "Not sure yet") {
      await updateUserProfile(currentUser.uid, {
        careerStatus: "exploring"
      });

      await refreshProfile(currentUser.uid);

      navigate("/student-profile");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
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
      {/* Top Banner */}
      <div className="text-center mb-4" style={{ maxWidth: "750px" }}>
        <span className="fs-1">🧞‍♂️</span>
        <h1 className="display-5 fw-bold text-primary mt-2">Welcome, {name} 👋</h1>
        <p className="lead text-muted">
          Select your dream career to create a personalized roadmap, or use AI Genie analysis if you're not sure yet.
        </p>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close"></button>
          </div>
        )}
      </div>

      {/* Prominent "Not sure yet" Callout Card */}
      <div 
        className="w-100 mb-5 p-4 rounded-4 text-white shadow-lg d-flex flex-column flex-md-row align-items-center justify-content-between gap-3"
        style={{
          maxWidth: "1000px",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #d946ef 100%)",
          borderRadius: "24px"
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div 
            className="rounded-circle bg-white text-purple d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "64px", height: "64px", fontSize: "2rem", color: "#7c3aed" }}
          >
            🧭
          </div>
          <div>
            <h4 className="fw-bold mb-1">Not sure what your dream career is?</h4>
            <p className="mb-0 text-white-50 small" style={{ fontSize: "0.95rem" }}>
              Fill out your student details (interests, strengths, field of study & hobbies) and let AI Genie analyze and suggest the best matching careers for you!
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/student-profile")}
          className="btn btn-light rounded-pill px-4 py-3 fw-bold text-purple flex-shrink-0 shadow-sm transition-all"
          style={{ color: "#6d28d9", fontSize: "1rem" }}
        >
          <i className="bi bi-magic me-2"></i>
          Not Sure Yet? Help Me Decide <i className="bi bi-arrow-right ms-1"></i>
        </button>
      </div>

      {/* Careers Options Grid */}
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
                className={`card h-100 border-2 cursor-pointer shadow-sm p-4 text-center transition-all ${
                  isSelected
                    ? "border-primary bg-primary bg-opacity-10 scale-102 shadow"
                    : option.isSpecial
                    ? "border-warning bg-warning bg-opacity-10 hover-shadow scale-hover"
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

      {/* Continue Action Button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={!selectedCareer || isSaving}
          className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg transition-all"
          style={{
            minWidth: "250px",
            fontSize: "1.1rem",
            letterSpacing: "0.5px"
          }}
        >
          {isSaving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : selectedCareer === "Not sure yet" ? (
            <>
              Analyze My Profile with AI <i className="bi bi-magic ms-1 fs-5"></i>
            </>
          ) : (
            <>
              Continue with {selectedCareer || "Selection"} <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
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
