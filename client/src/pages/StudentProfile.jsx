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
  const [fieldOfStudy, setFieldOfStudy] = useState("General / Not Decided Yet");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedStrengths, setSelectedStrengths] = useState([]);
  const [selectedWorkPref, setSelectedWorkPref] = useState([]);
  const [hobbies, setHobbies] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // System & View states
  const [careersList, setCareersList] = useState([]);
  const [viewState, setViewState] = useState("form"); // "form" | "analyzing" | "suggestions"
  const [analyzingText, setAnalyzingText] = useState("Initializing AI Genie...");
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
      setName(userProfile.name || currentUser?.displayName || "");
      if (userProfile.age) setAge(userProfile.age);
      if (userProfile.education && userProfile.education !== "Select") {
        setEducation(userProfile.education);
      }
      if (userProfile.fieldOfStudy) setFieldOfStudy(userProfile.fieldOfStudy);
      if (userProfile.interests) setSelectedInterests(userProfile.interests);
      if (userProfile.strengths) setSelectedStrengths(userProfile.strengths);
      if (userProfile.workPreferences) setSelectedWorkPref(userProfile.workPreferences);
      if (userProfile.hobbies) setHobbies(userProfile.hobbies);
      if (userProfile.additionalInfo) setAdditionalInfo(userProfile.additionalInfo);
    }
  }, [userProfile, currentUser]);

  const fieldsOfStudy = [
    "General / Not Decided Yet",
    "Engineering & Technology",
    "Medicine & Healthcare",
    "Business, Management & Finance",
    "Creative Arts, Design & Media",
    "Law, Public Policy & Civil Services",
    "Government, Civil Services & Defence",
    "Sciences, Mathematics & Environment"
  ];

  const educationOptions = [
    "Class 10",
    "Class 12 (Intermediate)",
    "Diploma",
    "College 1st Year",
    "College 2nd Year",
    "College 3rd Year",
    "College 4th Year",
    "Graduate",
    "Post Graduate",
    "Working Professional"
  ];

  const interestsList = [
    { id: "Coding", label: "Coding & Software", icon: "bi-code-slash", color: "primary" },
    { id: "AI", label: "AI & Machine Learning", icon: "bi-cpu", color: "info" },
    { id: "Data", label: "Data Science & Statistics", icon: "bi-graph-up-arrow", color: "success" },
    { id: "Healthcare", label: "Healthcare & Medicine", icon: "bi-hospital", color: "danger" },
    { id: "Finance", label: "Finance & Money Markets", icon: "bi-currency-dollar", color: "success" },
    { id: "Design", label: "UX/UI & Creative Design", icon: "bi-palette", color: "warning" },
    { id: "Writing", label: "Writing, Media & Journalism", icon: "bi-pencil-square", color: "primary" },
    { id: "Law", label: "Law & Public Governance", icon: "bi-bank", color: "dark" },
    { id: "Research", label: "Scientific & Space Research", icon: "bi-journal-text", color: "secondary" },
    { id: "Security", label: "Cybersecurity & Defence", icon: "bi-shield-lock", color: "danger" },
    { id: "Business", label: "Business & Entrepreneurship", icon: "bi-briefcase", color: "warning" },
    { id: "Cloud", label: "Cloud Systems & DevOps", icon: "bi-cloud", color: "info" },
    { id: "Helping People", label: "Helping People & Counseling", icon: "bi-heart", color: "danger" }
  ];

  const strengthsList = [
    { id: "Problem Solving", label: "Analytical Problem Solving", icon: "bi-lightbulb", color: "primary" },
    { id: "Mathematics", label: "Logical & Math Reasoning", icon: "bi-calculator", color: "info" },
    { id: "Creativity", label: "Artistic & Visual Creativity", icon: "bi-brush", color: "warning" },
    { id: "Communication", label: "Public Speaking & Writing", icon: "bi-chat-dots", color: "success" },
    { id: "Leadership", label: "Team Leadership & Strategy", icon: "bi-people", color: "danger" },
    { id: "Detail Orientation", label: "Attention to Detail & Auditing", icon: "bi-zoom-in", color: "dark" },
    { id: "Technical Aptitude", label: "Hardware & Tech Building", icon: "bi-tools", color: "primary" },
    { id: "Empathy", label: "Empathy & Patient Care", icon: "bi-emoji-smile", color: "danger" }
  ];

  const workPrefList = [
    { id: "Computers", label: "Working with Computers & Code" },
    { id: "Hospitals", label: "Working in Healthcare & Patient Care" },
    { id: "Finance", label: "Managing Capital, Investments & Audits" },
    { id: "Creative", label: "Designing Visuals, Media & Experiences" },
    { id: "Leadership", label: "Managing Teams, Startups & Operations" },
    { id: "Research", label: "Conducting Scientific Lab Experiments" },
    { id: "Public", label: "Public Service, Law & Governance" },
    { id: "Field", label: "Outdoor Fieldwork & Tactical Defence" }
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

  const handleWorkPrefToggle = (id) => {
    setSelectedWorkPref((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  // Advanced AI Recommendation Engine
  const getAIRecommendations = () => {
    if (careersList.length === 0) return [];

    const scored = careersList.map((c) => {
      let score = 0;
      let reasons = [];

      // 1. Field of study match (+30 pts)
      if (fieldOfStudy !== "General / Not Decided Yet" && c.fieldOfStudy === fieldOfStudy) {
        score += 30;
        reasons.push(`Direct alignment with your chosen field of study (${c.fieldOfStudy})`);
      }

      // 2. Matching interests (+35 max pts)
      if (c.matchingInterests) {
        let interestMatches = [];
        selectedInterests.forEach((interest) => {
          if (c.matchingInterests[interest]) {
            score += c.matchingInterests[interest] * 4;
            interestMatches.push(interest);
          }
        });
        if (interestMatches.length > 0) {
          reasons.push(`Matches your strong interest in ${interestMatches.join(", ")}`);
        }
      }

      // 3. Matching strengths (+25 max pts)
      if (c.matchingStrengths) {
        let strengthMatches = [];
        selectedStrengths.forEach((strength) => {
          if (c.matchingStrengths[strength]) {
            score += c.matchingStrengths[strength] * 3.5;
            strengthMatches.push(strength);
          }
        });
        if (strengthMatches.length > 0) {
          reasons.push(`Capitalizes on your key strengths: ${strengthMatches.join(", ")}`);
        }
      }

      // 4. Work preference match (+10 pts)
      if (selectedWorkPref.length > 0) {
        let prefMatch = false;
        if (selectedWorkPref.includes("Computers") && c.category === "Technology") prefMatch = true;
        if (selectedWorkPref.includes("Hospitals") && c.category === "Healthcare & Medicine") prefMatch = true;
        if (selectedWorkPref.includes("Finance") && c.category === "Business & Finance") prefMatch = true;
        if (selectedWorkPref.includes("Creative") && c.category === "Creative Arts & Design") prefMatch = true;
        if (selectedWorkPref.includes("Public") && c.category === "Law & Governance") prefMatch = true;
        if (selectedWorkPref.includes("Field") && c.category === "Government & Defence") prefMatch = true;
        if (selectedWorkPref.includes("Research") && c.category === "Sciences & Environment") prefMatch = true;

        if (prefMatch) {
          score += 15;
          reasons.push("Fits your ideal day-to-day work environment preference");
        }
      }

      // 5. Hobbies / Additional info keyword boost (+10 pts)
      const textToSearch = `${hobbies} ${additionalInfo}`.toLowerCase();
      if (textToSearch.length > 3) {
        const keywords = c.name.toLowerCase().split(" ").concat(c.requiredSkills.map(s => s.toLowerCase()));
        const found = keywords.some(k => k.length > 3 && textToSearch.includes(k));
        if (found) {
          score += 10;
          reasons.push("Reflects your personal hobbies and mentioned passions");
        }
      }

      // Calculate match percentage capped between 65% and 98%
      const maxPossible = 95;
      let matchPercent = Math.min(Math.max(Math.round((score / maxPossible) * 100), 65), 98);

      // Default reason fallback
      if (reasons.length === 0) {
        reasons.push(`Matches career opportunities suitable for ${education}`);
      }

      return {
        ...c,
        career: c.name,
        score,
        matchPercent,
        aiReason: `AI Rationale: ${reasons.join(". ")}.`
      };
    });

    // Sort by highest score & match percentage
    scored.sort((a, b) => b.score - a.score || b.matchPercent - a.matchPercent);

    return scored.slice(0, 6);
  };

  const handleAnalyzeProfile = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!age || Number(age) < 5 || Number(age) > 100) {
      setError("Please enter a valid age.");
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

    // Trigger AI Loading State
    setViewState("analyzing");
    const steps = [
      "Connecting to Career Genie AI Engine...",
      "Evaluating your strengths, interests & field of study...",
      "Matching profile against 30+ global career fields...",
      "Calculating personalized match percentages & career roadmaps...",
      "Finalizing AI dream career recommendations..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setAnalyzingText(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setViewState("suggestions");
      }
    }, 600);
  };

  const handleGenerateRoadmap = async () => {
    if (!selectedCareer) {
      setError("Please click and select one career path from the recommendations below.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      let compatEducation = education;
      if (education.includes("Class 10")) compatEducation = "10th";
      else if (education.includes("Class 12")) compatEducation = "Intermediate";
      else compatEducation = "Degree";

      await updateUserProfile(currentUser.uid, {
        name: name.trim(),
        age: Number(age),
        education: compatEducation,
        educationStatus: education,
        fieldOfStudy,
        interests: selectedInterests,
        strengths: selectedStrengths,
        workPreferences: selectedWorkPref,
        hobbies: hobbies.trim(),
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

  const recommendations = getAIRecommendations();

  return (
    <div className="container py-5">
      <div 
        className="card shadow-lg border-0 p-4 p-md-5 mx-auto bg-white" 
        style={{ maxWidth: "900px", borderRadius: "24px" }}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <span className="fs-1">🧞‍♂️</span>
          <h1 className="display-6 fw-bold text-primary mt-2">
            {viewState === "form" && "Student Details & AI Career Discovery"}
            {viewState === "analyzing" && "AI Genie is Analyzing Your Profile..."}
            {viewState === "suggestions" && "AI Recommended Dream Careers"}
          </h1>
          <p className="text-muted lead" style={{ fontSize: "1.05rem" }}>
            {viewState === "form" && "Tell us about your interests, strengths, field of study & hobbies to let AI determine your dream career."}
            {viewState === "analyzing" && "Our multi-factor AI algorithm is cross-referencing your attributes across 30+ career domains."}
            {viewState === "suggestions" && "Based on your unique profile, here are the top matching dream careers for you. Select one to generate your roadmap!"}
          </p>
          {error && (
            <div className="alert alert-danger alert-dismissible fade show mt-3 text-start" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close"></button>
            </div>
          )}
        </div>

        {/* VIEW 1: FORM INPUTS */}
        {viewState === "form" && (
          <form onSubmit={handleAnalyzeProfile}>
            {/* 1. Basic Info */}
            <div className="row g-3 mb-4">
              <div className="col-md-7">
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
              <div className="col-md-5">
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

            {/* 2. Education & Field of Study */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">Education Status</label>
                <select
                  className="form-select form-select-lg bg-light border-0 px-3"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  style={{ borderRadius: "12px" }}
                  required
                >
                  <option value="Select">Select Education</option>
                  {educationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Field of Study / Stream</label>
                <select
                  className="form-select form-select-lg bg-light border-0 px-3"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  style={{ borderRadius: "12px" }}
                  required
                >
                  {fieldsOfStudy.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Interests Section */}
            <div className="mb-4 p-4 rounded-4 border bg-light bg-opacity-50">
              <label className="form-label fw-bold d-block mb-3 fs-5 text-dark">
                <i className="bi bi-heart-fill text-danger me-2"></i>Select Your Primary Interests
              </label>
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
                          ? `btn-${interest.color} text-white`
                          : "btn-outline-secondary border-muted text-secondary bg-white"
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

            {/* 4. Strengths Section */}
            <div className="mb-4 p-4 rounded-4 border bg-light bg-opacity-50">
              <label className="form-label fw-bold d-block mb-3 fs-5 text-dark">
                <i className="bi bi-star-fill text-warning me-2"></i>Identify Your Core Strengths
              </label>
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
                          ? `btn-${strength.color} text-white`
                          : "btn-outline-secondary border-muted text-secondary bg-white"
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

            {/* 5. Work Environment Preferences */}
            <div className="mb-4 p-4 rounded-4 border bg-light bg-opacity-50">
              <label className="form-label fw-bold d-block mb-3 fs-5 text-dark">
                <i className="bi bi-building-gear text-primary me-2"></i>Work Environment Preferences
              </label>
              <div className="d-flex flex-wrap gap-2">
                {workPrefList.map((w) => {
                  const isSelected = selectedWorkPref.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleWorkPrefToggle(w.id)}
                      className={`btn px-3 py-2 rounded-pill border d-flex align-items-center gap-2 fw-semibold transition-all ${
                        isSelected
                          ? "btn-dark text-white"
                          : "btn-outline-secondary border-muted text-secondary bg-white"
                      }`}
                      style={{ fontSize: "0.88rem" }}
                    >
                      {w.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Hobbies & Passions */}
            <div className="mb-4">
              <label className="form-label fw-bold">Hobbies & Passions</label>
              <input
                type="text"
                className="form-control form-control-lg bg-light border-0 px-3"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                placeholder="e.g. Gaming, sketching, playing chess, reading science fiction, blogging..."
                style={{ borderRadius: "12px" }}
              />
            </div>

            {/* 7. Additional Info */}
            <div className="mb-5">
              <label className="form-label fw-bold">Additional Specific Goals / Preferences (Optional)</label>
              <textarea
                className="form-control bg-light border-0 px-3 py-2"
                rows="3"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Mention any specific dream projects, idol figures, or subjects you feel passionate about..."
                style={{ borderRadius: "12px" }}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg transition-all"
                style={{ minWidth: "280px", fontSize: "1.1rem" }}
              >
                <i className="bi bi-magic me-2"></i> Analyze Profile & Discover Dream Career
              </button>
            </div>
          </form>
        )}

        {/* VIEW 2: AI ANALYZING ANIMATION */}
        {viewState === "analyzing" && (
          <div className="text-center py-5">
            <div className="spinner-grow text-primary mb-4" style={{ width: "4rem", height: "4rem" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="fw-bold text-dark mb-3">🧞‍♂️ Genie AI Analysis in Progress</h3>
            <p className="lead text-primary fw-semibold">{analyzingText}</p>
            <div className="progress mx-auto mt-4" style={{ maxWidth: "450px", height: "8px" }}>
              <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary w-100"></div>
            </div>
          </div>
        )}

        {/* VIEW 3: AI SUGGESTED DREAM CAREERS */}
        {viewState === "suggestions" && (
          <div>
            <div className="row g-4 mb-5">
              {recommendations.map((rec) => {
                const isSelected = selectedCareer === rec.name;
                return (
                  <div key={rec.id || rec.name} className="col-md-6">
                    <div
                      onClick={() => {
                        setSelectedCareer(rec.name);
                        setError("");
                      }}
                      className={`card h-100 border-2 cursor-pointer shadow-sm p-4 transition-all ${
                        isSelected
                          ? `border-${rec.color || "primary"} bg-${rec.color || "primary"} bg-opacity-10 scale-102`
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
                          className={`rounded-circle d-flex align-items-center justify-content-center text-${rec.color || "primary"}`}
                          style={{
                            width: "55px",
                            height: "55px",
                            fontSize: "1.6rem",
                            backgroundColor: isSelected
                              ? "rgba(13, 110, 253, 0.2)"
                              : "rgba(240, 242, 245, 0.9)"
                          }}
                        >
                          <i className={`bi ${rec.icon || "bi-briefcase"}`}></i>
                        </div>
                        <span className={`badge rounded-pill bg-${rec.color || "primary"} px-3 py-2 fw-bold fs-6`}>
                          {rec.matchPercent}% Match
                        </span>
                      </div>

                      <h4 className="fw-bold fs-5 mb-1">{rec.name}</h4>
                      <p className="text-secondary small fw-bold mb-2">{rec.category} • {rec.salary}</p>
                      
                      {/* AI Rationale Box */}
                      <div className="p-3 bg-light rounded-3 mb-3 border border-light">
                        <small className="text-dark fw-semibold d-block">
                          <i className="bi bi-stars text-warning me-1"></i> {rec.aiReason}
                        </small>
                      </div>

                      <div className="d-flex flex-wrap gap-1">
                        {rec.requiredSkills?.slice(0, 4).map((skill) => (
                          <span key={skill} className="badge bg-secondary bg-opacity-10 text-secondary fw-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-md-row justify-content-between gap-3 pt-3 border-top">
              <button
                type="button"
                onClick={() => setViewState("form")}
                className="btn btn-outline-secondary btn-lg rounded-pill px-4 fw-bold"
              >
                <i className="bi bi-arrow-left me-2"></i> Edit Student Profile
              </button>
              <button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={!selectedCareer || isSaving}
                className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-lg"
                style={{ minWidth: "260px" }}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Generating Custom Roadmap...
                  </>
                ) : (
                  <>
                    Lock In & Generate Roadmap <i className="bi bi-arrow-right ms-1"></i>
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
