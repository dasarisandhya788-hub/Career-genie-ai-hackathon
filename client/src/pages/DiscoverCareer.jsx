import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestoreService";

export default function DiscoverCareer() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Selection states
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedStrengths, setSelectedStrengths] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [careersList, setCareersList] = useState([]);

  const name = userProfile?.name || currentUser?.displayName || "Student";

  useEffect(() => {
    fetch("/data/careers.json")
      .then((res) => res.json())
      .then((data) => {
        setCareersList(data);
      })
      .catch((err) => {
        console.error("Error loading careers database in Discover:", err);
        setError("Failed to load career paths database.");
      });
  }, []);

  const interestsList = [
    { id: "Coding", label: "Coding & Software", icon: "bi-code-slash", color: "primary" },
    { id: "AI", label: "AI & Machine Learning", icon: "bi-cpu", color: "info" },
    { id: "Data", label: "Data Science & Stats", icon: "bi-graph-up-arrow", color: "success" },
    { id: "Healthcare", label: "Healthcare & Medicine", icon: "bi-hospital", color: "danger" },
    { id: "Finance", label: "Finance & Markets", icon: "bi-currency-dollar", color: "success" },
    { id: "Design", label: "UX/UI & Creative Arts", icon: "bi-palette", color: "warning" },
    { id: "Writing", label: "Writing & Journalism", icon: "bi-pencil-square", color: "primary" },
    { id: "Law", label: "Law & Public Policy", icon: "bi-bank", color: "dark" },
    { id: "Research", label: "Scientific Research", icon: "bi-journal-text", color: "secondary" },
    { id: "Security", label: "Cybersecurity & Defence", icon: "bi-shield-lock", color: "danger" },
    { id: "Business", label: "Business & Startups", icon: "bi-briefcase", color: "warning" },
    { id: "Helping People", label: "Helping People", icon: "bi-heart", color: "danger" }
  ];

  const strengthsList = [
    { id: "Problem Solving", label: "Analytical Problem Solving", icon: "bi-lightbulb" },
    { id: "Mathematics", label: "Logical & Math Reasoning", icon: "bi-calculator" },
    { id: "Creativity", label: "Artistic & Visual Creativity", icon: "bi-brush" },
    { id: "Communication", label: "Communication & Leadership", icon: "bi-chat-dots" },
    { id: "Leadership", label: "Project Leadership", icon: "bi-people" },
    { id: "Detail Orientation", label: "Attention to Detail", icon: "bi-zoom-in" },
    { id: "Technical Aptitude", label: "Technical Aptitude", icon: "bi-tools" },
    { id: "Empathy", label: "Empathy & Patient Care", icon: "bi-emoji-smile" }
  ];

  // Compute trending dynamically from list (first 3 technology/popular careers)
  const trendingCareers = careersList.slice(0, 3).map((c) => ({
    name: c.name,
    icon: c.icon || "bi-code-slash"
  }));

  // Group and map categories dynamically from careersList
  const categoryMeta = {
    "Technology": { icon: "bi-cpu-fill", color: "primary" },
    "Healthcare & Medicine": { icon: "bi-hospital-fill", color: "danger" },
    "Business & Finance": { icon: "bi-currency-dollar", color: "success" },
    "Creative Arts & Design": { icon: "bi-palette-fill", color: "warning" },
    "Law & Governance": { icon: "bi-bank", color: "dark" },
    "Government & Defence": { icon: "bi-shield-shaded", color: "danger" },
    "Sciences & Environment": { icon: "bi-tree-fill", color: "info" }
  };

  const careerCategories = Object.keys(categoryMeta).map((cat) => {
    const meta = categoryMeta[cat];
    return {
      name: cat,
      icon: meta.icon,
      color: meta.color,
      careers: careersList.filter((c) => c.category === cat).map((c) => c.name)
    };
  });

  // Scoring algorithm to compute matching paths dynamically from database
  const getRecommendations = () => {
    if (careersList.length === 0) return [];
    
    const scores = {};
    careersList.forEach((c) => {
      scores[c.name] = 0;
      if (c.matchingInterests) {
        selectedInterests.forEach((interest) => {
          if (c.matchingInterests[interest]) {
            scores[c.name] += c.matchingInterests[interest];
          }
        });
      }
      if (c.matchingStrengths) {
        selectedStrengths.forEach((strength) => {
          if (c.matchingStrengths[strength]) {
            scores[c.name] += c.matchingStrengths[strength];
          }
        });
      }
    });

    // Convert scores to list of objects
    return Object.keys(scores)
      .map((key) => {
        const maxScorePossible = 10;
        const percent = Math.min(Math.round((scores[key] / maxScorePossible) * 100), 100);
        return { career: key, score: scores[key], matchPercent: percent };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  };

  const recommendations = getRecommendations();

  const handleInterestToggle = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStrengthToggle = (id) => {
    setSelectedStrengths((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleLockIn = async () => {
    if (!selectedCareer) {
      setError("Please select a career path to lock in.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await updateUserProfile(currentUser.uid, {
        dreamCareer: selectedCareer,
        careerGoal: selectedCareer,
        careerStatus: "decided"
      });
      await refreshProfile(currentUser.uid);
      navigate("/roadmap");
    } catch (err) {
      console.error("Error saving dream career from discover:", err);
      setError("Failed to save your career selection. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5" style={{ maxWidth: "750px", margin: "0 auto" }}>
        <span className="fs-1">🧞‍♂️</span>
        <h1 className="display-6 fw-bold text-primary mt-3">Career Discovery Guide</h1>
        <p className="lead text-muted">
          Welcome, {name}! Explore careers across all fields of study or filter by interests & strengths.
        </p>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close"></button>
          </div>
        )}
      </div>

      <div className="row g-4">
        {/* Left column: selections */}
        <div className="col-lg-6">
          {/* Interests */}
          <div className="card shadow-sm border-0 p-4 mb-4 bg-white" style={{ borderRadius: "20px" }}>
            <h4 className="fw-bold text-dark mb-3">
              <i className="bi bi-heart-fill text-danger me-2"></i>1. Select Your Interests
            </h4>
            <p className="text-muted small">What topics or fields excite you most?</p>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {interestsList.map((interest) => {
                const isActive = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => handleInterestToggle(interest.id)}
                    type="button"
                    className={`btn rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 border transition-all ${
                      isActive
                        ? `btn-${interest.color} text-white`
                        : "btn-outline-secondary bg-light text-secondary border-light"
                    }`}
                    style={{ fontSize: "0.9rem" }}
                  >
                    <i className={`bi ${interest.icon}`}></i>
                    {interest.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strengths */}
          <div className="card shadow-sm border-0 p-4 mb-4 bg-white" style={{ borderRadius: "20px" }}>
            <h4 className="fw-bold text-dark mb-3">
              <i className="bi bi-star-fill text-warning me-2"></i>2. Identify Your Strengths
            </h4>
            <p className="text-muted small">What skills or ways of thinking come naturally to you?</p>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {strengthsList.map((strength) => {
                const isActive = selectedStrengths.includes(strength.id);
                return (
                  <button
                    key={strength.id}
                    onClick={() => handleStrengthToggle(strength.id)}
                    type="button"
                    className={`btn rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 border transition-all ${
                      isActive
                        ? "btn-primary text-white border-primary"
                        : "btn-outline-secondary bg-light text-secondary border-light"
                    }`}
                    style={{ fontSize: "0.9rem" }}
                  >
                    <i className={`bi ${strength.icon}`}></i>
                    {strength.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trending paths */}
          <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: "20px" }}>
            <h4 className="fw-bold text-dark mb-3">
              <i className="bi bi-fire text-warning me-2"></i>Featured Popular Careers
            </h4>
            <p className="text-muted small">Quickly select a high-demand career path:</p>
            <div className="row g-2 mt-2">
              {trendingCareers.map((item) => (
                <div key={item.name} className="col-sm-4">
                  <button
                    onClick={() => {
                      setSelectedCareer(item.name);
                      setError("");
                    }}
                    type="button"
                    className={`btn w-100 py-3 rounded-4 border fw-bold d-flex flex-column align-items-center gap-1 ${
                      selectedCareer === item.name
                        ? "btn-primary text-white border-primary"
                        : "btn-light border-light text-secondary"
                    }`}
                    style={{ fontSize: "0.85rem" }}
                  >
                    <i className={`bi ${item.icon} fs-4 mb-1`}></i>
                    {item.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: categories & recommendations */}
        <div className="col-lg-6">
          {/* Career Categories */}
          <div className="card shadow-sm border-0 p-4 mb-4 bg-white" style={{ borderRadius: "20px" }}>
            <h4 className="fw-bold text-dark mb-3">
              <i className="bi bi-grid-fill text-primary me-2"></i>3. Browse 30+ Careers by Field
            </h4>
            <p className="text-muted small">Explore options across every major domain of study:</p>
            <div className="d-flex flex-column gap-3 mt-2" style={{ maxHeight: "480px", overflowY: "auto" }}>
              {careerCategories.map((category) => (
                <div key={category.name} className="p-3 border rounded-4 bg-light bg-opacity-50">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className={`bi ${category.icon} text-${category.color} fs-5`}></i>
                    <h6 className="fw-bold mb-0 text-secondary">{category.name}</h6>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {category.careers.map((careerName) => {
                      const isSelected = selectedCareer === careerName;
                      return (
                        <button
                          key={careerName}
                          onClick={() => {
                            setSelectedCareer(careerName);
                            setError("");
                          }}
                          type="button"
                          className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${
                            isSelected
                              ? "btn-primary text-white border-primary shadow-sm"
                              : "btn-outline-secondary bg-white text-secondary border-light"
                          }`}
                        >
                          {careerName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Match Results */}
          <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: "20px" }}>
            <div>
              <h4 className="fw-bold text-dark mb-4">
                <i className="bi bi-lightbulb-fill text-success me-2"></i>Dynamic Filter Results
              </h4>

              {recommendations.length === 0 ? (
                <div className="text-center py-4">
                  <span className="fs-2 text-muted">🧞‍♂️</span>
                  <p className="text-muted small mt-2">
                    Check your interests and strengths on the left, and matching careers will appear here dynamically!
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {recommendations.slice(0, 5).map((item) => {
                    const isSelected = selectedCareer === item.career;
                    return (
                      <div
                        key={item.career}
                        onClick={() => {
                          setSelectedCareer(item.career);
                          setError("");
                        }}
                        className={`card p-3 border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary bg-opacity-10"
                            : "border-light hover-light border-2"
                        }`}
                        style={{ cursor: "pointer", borderRadius: "16px", transition: "all 0.2s" }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="fw-bold mb-0">{item.career}</h5>
                          <span className={`badge ${isSelected ? "bg-primary" : "bg-light text-secondary"} rounded-pill px-3 py-2`}>
                            {item.matchPercent}% Match
                          </span>
                        </div>
                        <div className="progress" style={{ height: "6px", borderRadius: "3px" }}>
                          <div
                            className="progress-bar bg-success progress-bar-striped"
                            role="progressbar"
                            style={{ width: `${item.matchPercent}%` }}
                            aria-valuenow={item.matchPercent}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-top">
              {selectedCareer && (
                <div className="alert alert-info border-0 shadow-sm d-flex align-items-center py-2 px-3 mb-4 rounded-3">
                  <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                  <div>
                    Selected Career: <strong>{selectedCareer}</strong>
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                <Link to="/dashboard" className="btn btn-light rounded-pill px-4 py-2 border w-50 fw-semibold text-secondary">
                  Back to Dashboard
                </Link>
                <button
                  onClick={handleLockIn}
                  disabled={!selectedCareer || isSaving}
                  className="btn btn-primary rounded-pill px-4 py-2 w-50 fw-bold shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    "Generate Roadmap"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-light:hover {
          background-color: rgba(248, 249, 250, 0.9);
          border-color: rgba(13, 110, 253, 0.2) !important;
        }
      `}</style>
    </div>
  );
}
