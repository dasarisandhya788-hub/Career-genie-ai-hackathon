import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestoreService";

export default function StudentProfile() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("Select");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedStrengths, setSelectedStrengths] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  // System states
  const [careersList, setCareersList] = useState([]);
  const [viewState, setViewState] = useState("form"); // "form" or "suggestions"
  const [selectedCareer, setSelectedCareer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Load careers database on mount
  useEffect(() => {
    fetch("/data/careers.json")
      .then((res) => res.json())
      .then((data) => {
        setCareersList(data);
      })
      .catch((err) => {
        console.error("Error loading careers database in StudentProfile:", err);
        setError("Failed to load careers database.");
      });
  }, []);

  // Sync state with userProfile when it loads
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      if (userProfile.age) setAge(userProfile.age);
      if (userProfile.education && userProfile.education !== "Select") {
        setEducation(userProfile.education);
      }
      if (userProfile.interests) setSelectedInterests(userProfile.interests);
      if (userProfile.strengths) setSelectedStrengths(userProfile.strengths);
      if (userProfile.additionalInfo) setAdditionalInfo(userProfile.additionalInfo);
    }
  }, [userProfile]);

  const interestsList = [
    { id: "Coding", label: "Coding & Programming", icon: "bi-code-slash", color: "primary" },
    { id: "AI", label: "AI & Machine Learning", icon: "bi-cpu", color: "info" },
    { id: "Data", label: "Data Science & Statistics", icon: "bi-graph-up-arrow", color: "success" },
    { id: "Design", label: "UX/UI & Creative Design", icon: "bi-palette", color: "warning" },
    { id: "Security", label: "Cybersecurity & Hacking", icon: "bi-danger", color: "danger" },
    { id: "Cloud", label: "Cloud & Systems Architect", icon: "bi-cloud", color: "dark" },
    { id: "Research", label: "Scientific Research", icon: "bi-journal-text", color: "secondary" }
  ];

  const strengthsList = [
    { id: "Problem Solving", label: "Analytical Problem Solving", icon: "bi-lightbulb" },
    { id: "Creativity", label: "Artistic & Tech Creativity", icon: "bi-brush" },
    { id: "Mathematics", label: "Logical & Math Reasoning", icon: "bi-calculator" },
    { id: "Communication", label: "Communication & Teams", icon: "bi-chat-dots" },
    { id: "Leadership", label: "Project Leadership", icon: "bi-people" },
    { id: "Attention", label: "Detail & Security Mindset", icon: "bi-zoom-in" }
  ];

  const educationOptions = [
    "Class 10",
    "Class 12",
    "College 1st Year",
    "College 2nd Year",
    "College 3rd Year",
    "College 4th Year",
    "Graduate",
    "Post Graduate",
    "Working Professional"
  ];

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

  // Compute dynamic career recommendations from the database
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
    let recommended = Object.keys(scores)
      .map((key) => {
        const c = careersList.find((item) => item.name === key);
        const maxScorePossible = 10;
        const percent = Math.min(Math.round((scores[key] / maxScorePossible) * 100), 100);
        return {
          career: key,
          score: scores[key],
          matchPercent: percent,
          description: c?.description || "",
          icon: c?.icon || "bi-briefcase",
          color: c?.color || "primary",
          category: c?.category || ""
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    // Fallback in case there are no direct scoring careers
    if (recommended.length === 0) {
      recommended = careersList.slice(0, 4).map((c) => ({
        career: c.name,
        score: 0,
        matchPercent: 50,
        description: c.description || "",
        icon: c.icon || "bi-briefcase",
        color: c.color || "primary",
        category: c.category || ""
      }));
    }

    return recommended;
  };

  const handleAnalyzeProfile = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!age || Number(age) < 5 || Number(age) > 100) {
      setError("Please enter a valid age between 5 and 100.");
      return;
    }
    if (education === "Select") {
      setError("Please select your current education status.");
      return;
    }
    if (selectedInterests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }
    if (selectedStrengths.length === 0) {
      setError("Please select at least one strength.");
      return;
    }

    // Set suggestions view
    setViewState("suggestions");
  };

  const handleGenerateRoadmap = async () => {
    if (!selectedCareer) {
      setError("Please select one career path from the recommendations.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // Map the user profile education compatibility
      let compatEducation = education;
      if (education.includes("Class 10")) {
        compatEducation = "10th";
      } else if (education.includes("Class 12")) {
        compatEducation = "Intermediate";
      } else if (education.includes("College") || education.includes("Graduate") || education.includes("Working")) {
        // Fallback or general degree selection
        compatEducation = "Degree";
      }

      await updateUserProfile(currentUser.uid, {
        name: name.trim(),
        age: Number(age),
        education: compatEducation,
        educationStatus: education, // Store exact select value
        interests: selectedInterests,
        strengths: selectedStrengths,
        additionalInfo: additionalInfo.trim(),
        dreamCareer: selectedCareer,
        careerGoal: selectedCareer,
        careerStatus: "decided",
        progress: 0,
        completedTasks: []
      });

      await refreshProfile(currentUser.uid);
      navigate("/roadmap");
    } catch (err) {
      console.error("Error setting custom roadmap:", err);
      setError("Failed to save profile details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const recommendations = getRecommendations();

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 p-5 mx-auto bg-white" style={{ maxWidth: "800px", borderRadius: "24px" }}>
        {/* Header */}
        <div className="text-center mb-5">
          <span className="fs-1">🧭</span>
          <h1 className="display-6 fw-bold text-primary mt-2">
            {viewState === "form" ? "Complete Your Student Profile" : "AI Career Suggestions"}
          </h1>
          <p className="text-muted">
            {viewState === "form"
              ? "Let Career Genie AI understand your strengths and preferences to recommend matching paths."
              : "Here are the top career paths matching your profile. Choose one to generate your roadmap."}
          </p>
          {error && (
            <div className="alert alert-danger alert-dismissible fade show mt-3 text-start" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close"></button>
            </div>
          )}
        </div>

        {viewState === "form" ? (
          <form onSubmit={handleAnalyzeProfile}>
            {/* Full Name & Age */}
            <div className="row g-3 mb-4">
              <div className="col-md-8">
                <label className="form-label fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg bg-light border-0 px-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  style={{ borderRadius: "12px" }}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Age</label>
                <input
                  type="number"
                  className="form-control form-control-lg bg-light border-0 px-3"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  min="5"
                  max="100"
                  style={{ borderRadius: "12px" }}
                  required
                />
              </div>
            </div>

            {/* Education Status */}
            <div className="mb-4">
              <label className="form-label fw-bold">Current Education Status</label>
              <select
                className="form-select form-select-lg bg-light border-0 px-3"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                style={{ borderRadius: "12px" }}
                required
              >
                <option value="Select">Select Education Status</option>
                {educationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests Section */}
            <div className="mb-4">
              <label className="form-label fw-bold d-block mb-3">Select Your Interests</label>
              <div className="d-flex flex-wrap gap-2">
                {interestsList.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`btn px-3 py-2 rounded-pill border-2 d-flex align-items-center gap-2 fw-semibold transition-all ${
                        isSelected
                          ? `btn-${interest.color} border-${interest.color}`
                          : "btn-outline-secondary border-muted text-muted bg-white"
                      }`}
                      style={{ fontSize: "0.95rem" }}
                    >
                      <i className={`bi ${interest.icon}`}></i>
                      {interest.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strengths Section */}
            <div className="mb-4">
              <label className="form-label fw-bold d-block mb-3">Select Your Strengths</label>
              <div className="d-flex flex-wrap gap-2">
                {strengthsList.map((strength) => {
                  const isSelected = selectedStrengths.includes(strength.id);
                  return (
                    <button
                      key={strength.id}
                      type="button"
                      onClick={() => handleStrengthToggle(strength.id)}
                      className={`btn px-3 py-2 rounded-pill border-2 d-flex align-items-center gap-2 fw-semibold transition-all ${
                        isSelected
                          ? "btn-secondary border-secondary text-white"
                          : "btn-outline-secondary border-muted text-muted bg-white"
                      }`}
                      style={{ fontSize: "0.95rem" }}
                    >
                      <i className={`bi ${strength.icon}`}></i>
                      {strength.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mb-5">
              <label className="form-label fw-bold">Additional Relevant Info (Optional)</label>
              <textarea
                className="form-control bg-light border-0 px-3 py-2"
                rows="3"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Mention any specific fields, hobbies, or careers you feel excited about..."
                style={{ borderRadius: "12px" }}
              ></textarea>
            </div>

            {/* Next Step Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg"
                style={{ minWidth: "250px" }}
              >
                Analyze Profile & Suggest Careers <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="row g-3 mb-5">
              {recommendations.map((rec) => {
                const isSelected = selectedCareer === rec.career;
                return (
                  <div key={rec.career} className="col-md-6">
                    <div
                      onClick={() => setSelectedCareer(rec.career)}
                      className={`card h-100 border-2 cursor-pointer shadow-sm p-4 transition-all ${
                        isSelected
                          ? `border-${rec.color} bg-${rec.color} bg-opacity-10 scale-102`
                          : "border-light bg-white hover-shadow scale-hover"
                      }`}
                      style={{
                        cursor: "pointer",
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                        transform: isSelected ? "translateY(-5px)" : "none"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center text-${rec.color}`}
                          style={{
                            width: "50px",
                            height: "50px",
                            fontSize: "1.5rem",
                            backgroundColor: isSelected
                              ? "rgba(13, 110, 253, 0.15)"
                              : "rgba(240, 242, 245, 0.9)"
                          }}
                        >
                          <i className={`bi ${rec.icon}`}></i>
                        </div>
                        <span className={`badge rounded-pill bg-${rec.color} px-3 py-2 fw-bold`}>
                          {rec.matchPercent}% Match
                        </span>
                      </div>
                      <h4 className="fw-bold fs-5 mb-2">{rec.career}</h4>
                      <p className="text-muted small mb-0">{rec.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between gap-3">
              <button
                type="button"
                onClick={() => setViewState("form")}
                className="btn btn-outline-secondary btn-lg rounded-pill px-4 fw-bold"
              >
                Back to Profile
              </button>
              <button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={!selectedCareer || isSaving}
                className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-lg"
                style={{ minWidth: "250px" }}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    Generate Roadmap <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
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
