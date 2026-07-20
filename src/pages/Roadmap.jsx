import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { updateUserProfile } from "../services/authService.js";
import { getLearningResources } from "../data/learningResources.js";

const EXPLORATION_STEPS = [
  "Take a Career Exploration interest test",
  "Watch career day overviews of different fields",
  "Learn basic logic through simple python scripting",
  "Explore introductory AI concepts",
  "Learn how websites work (HTML/CSS)",
  "Read about Cloud & Cybersecurity roles",
  "Schedule meetings with industry professionals",
  "Pick one specific career option to trial",
  "Create a basic study plan",
  "Commit to your first specific career roadmap"
];

export default function Roadmap() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const { studentDetails } = useUser();

  const name = userProfile?.name || studentDetails?.name || localStorage.getItem("name") || "Student";
  let careerName = "";
  if (currentUser) {
    careerName = userProfile?.dreamCareer || userProfile?.careerGoal || "";
  } else {
    careerName = localStorage.getItem("career") || "";
  }
  
  const [careersList, setCareersList] = useState([]);
  const [currentCareerDetails, setCurrentCareerDetails] = useState(null);
  const [steps, setSteps] = useState([]);
  const [activeTab, setActiveTab] = useState("roadmap"); // "roadmap" | "journey" | "insights" | "projects" | "resources"

  // Load database on mount
  useEffect(() => {
    fetch("/data/careers.json")
      .then((res) => res.json())
      .then((data) => {
        setCareersList(data);
      })
      .catch((err) => {
        console.error("Error loading careers database in Roadmap:", err);
      });
  }, []);

  const hasSelectedCareer = Boolean(
    careerName && 
    careerName.trim() !== "" && 
    careerName !== "Not sure yet" && 
    userProfile?.careerStatus !== "exploring"
  );

  const getDefaultStepsForCareer = (cName) => {
    const target = cName || "Chosen Goal";
    return [
      `Learn core fundamentals & foundational concepts for ${target}`,
      `Master essential tools, analytical methods & practical skills for ${target}`,
      `Build 3+ hands-on practical portfolio projects for ${target}`,
      `Complete specialized certifications & practical industry training for ${target}`,
      `Apply for relevant internships / entry-level roles in ${target}`,
      `Prepare for technical interviews, domain assessments & full-time career placement`
    ];
  };

  // Set steps and career details based on profile loading and careersList
  useEffect(() => {
    if (!hasSelectedCareer) return;

    let found = null;
    if (careersList.length > 0) {
      const targetLower = careerName.toLowerCase();
      found = careersList.find(c => 
        c.name?.toLowerCase() === targetLower || 
        c.id?.toLowerCase() === targetLower ||
        targetLower.includes(c.name?.toLowerCase()) ||
        c.name?.toLowerCase().includes(targetLower)
      );
    }

    if (found && found.roadmap && found.roadmap.length > 0) {
      setSteps(found.roadmap);
      setCurrentCareerDetails(found);
    } else {
      setSteps(getDefaultStepsForCareer(careerName));
      if (found) setCurrentCareerDetails(found);
    }
  }, [careersList, userProfile, hasSelectedCareer, careerName]);

  const totalSteps = steps.length;
  const career = currentCareerDetails?.name || careerName;
  const resolvedResources = getLearningResources(currentCareerDetails?.id || currentCareerDetails?.name || career);

  // Unique localstorage key for this career
  const progressKey = `progress_${career.replace(/\s+/g, "")}`;

  // State for completed step indices
  const [completedSteps, setCompletedSteps] = useState([]);

  // Sync state with userProfile when it loads
  useEffect(() => {
    if (userProfile && userProfile.completedTasks) {
      setCompletedSteps(userProfile.completedTasks);
    } else {
      const saved = localStorage.getItem(progressKey);
      setCompletedSteps(saved ? JSON.parse(saved) : []);
    }
  }, [userProfile, progressKey]);

  // State for AI Mentor
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  // POPUP IF NO CAREER CHOSEN YET
  if (!hasSelectedCareer) {
    return (
      <div className="container py-5 my-5 d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="card shadow-lg p-5 text-center border-0 rounded-4 bg-white" style={{ maxWidth: "620px", borderRadius: "24px" }}>
          <div className="fs-1 text-warning mb-3">⚠️</div>
          <h2 className="fw-bold text-dark mb-3">You Haven't Chosen a Career Yet! 🧞‍♂️</h2>
          <p className="text-muted lead mb-4" style={{ fontSize: "1.05rem" }}>
            Please select your target dream career or let AI Genie analyze your profile details first to unlock your personalized learning roadmap.
          </p>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link to="/select-career" className="btn btn-primary btn-lg rounded-pill px-4 py-3 fw-bold shadow">
              <i className="bi bi-rocket-takeoff me-2"></i>Choose Dream Career
            </Link>
            <Link to="/student?notSure=true" className="btn btn-outline-primary btn-lg rounded-pill px-4 py-3 fw-bold">
              <i className="bi bi-magic me-2"></i>Help Me Decide with AI
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = completedSteps.length;
  const percentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // Save to localStorage as a fallback
  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(completedSteps));
  }, [completedSteps, progressKey]);

  // Handle step checkbox toggle
  const toggleStep = async (index, isChecked) => {
    let updated;
    if (isChecked) {
      if (!completedSteps.includes(index)) {
        updated = [...completedSteps, index];
      } else {
        return;
      }
    } else {
      updated = completedSteps.filter((stepIndex) => stepIndex !== index);
    }

    setCompletedSteps(updated);

    // Trigger confetti if checking hits 100%
    if (isChecked && updated.length === totalSteps) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    // Save to Firestore if authenticated
    if (currentUser) {
      const pct = totalSteps > 0 ? Math.round((updated.length / totalSteps) * 100) : 0;
      try {
        await updateUserProfile(currentUser.uid, {
          completedTasks: updated,
          progress: pct
        });
        await refreshProfile(currentUser.uid);
      } catch (error) {
        console.error("Error updating progress in Firestore:", error);
      }
    }
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setAsking(true);
    setAiAnswer("");

    try {
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, career })
      });
      const data = await response.json();
      setAiAnswer(data.answer || "Here is guidance for your career goal: " + question);
    } catch (err) {
      setAiAnswer(`For ${career}, focus on foundational concepts, practical projects, and consistent daily practice!`);
    } finally {
      setAsking(false);
    }
  };

  const bp = currentCareerDetails?.bridgePath || {};

  return (
    <div className="container py-5">
      {/* Top Header Banner */}
      <div className="card shadow-lg border-0 p-4 p-md-5 mb-4 bg-white" style={{ borderRadius: "24px" }}>
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-2">
              <i className="bi bi-stars me-1"></i> AI Learning Roadmap
            </span>
            <h1 className="display-6 fw-bold text-dark mb-2">
              {career} Roadmap for {name}
            </h1>
            <p className="text-muted lead mb-0" style={{ fontSize: "1rem" }}>
              {currentCareerDetails?.category || "Professional Track"} • {currentCareerDetails?.recommendedEducation || "Higher Education"}
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/select-career" className="btn btn-outline-primary rounded-pill px-4 fw-bold">
              <i className="bi bi-arrow-repeat me-2"></i>Change Career
            </Link>
          </div>
        </div>

        <hr className="my-4" />

        {/* Progress Tracker Bar */}
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold text-dark fs-6">Overall Roadmap Progress</span>
            <span className="badge bg-primary fs-6 px-3 py-1 rounded-pill">{percentage}% Completed</span>
          </div>
          <div className="progress" style={{ height: "14px", borderRadius: "10px" }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
              role="progressbar"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="d-flex justify-content-between mt-2 text-muted small">
            <span>{completedCount} of {totalSteps} milestones finished</span>
            <span>{percentage === 100 ? "🎉 Fully Completed!" : `${totalSteps - completedCount} milestones remaining`}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveTab("roadmap")}
          className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${
            activeTab === "roadmap" ? "btn-primary shadow" : "btn-light text-secondary border"
          }`}
        >
          <i className="bi bi-journal-check me-2"></i>Roadmap Checklist ({completedCount}/{totalSteps})
        </button>
        <button
          onClick={() => setActiveTab("journey")}
          className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${
            activeTab === "journey" ? "btn-primary shadow" : "btn-light text-secondary border"
          }`}
        >
          <i className="bi bi-diagram-3 me-2"></i>Academic Journey Path
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${
            activeTab === "insights" ? "btn-primary shadow" : "btn-light text-secondary border"
          }`}
        >
          <i className="bi bi-lightbulb me-2"></i>Career Insights & Salary
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${
            activeTab === "projects" ? "btn-primary shadow" : "btn-light text-secondary border"
          }`}
        >
          <i className="bi bi-code-square me-2"></i>Projects & Practice Labs
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${
            activeTab === "resources" ? "btn-primary shadow" : "btn-light text-secondary border"
          }`}
        >
          <i className="bi bi-book me-2"></i>Free Learning Resources
        </button>
      </div>

      {/* Main Content Area */}
      <div className="row g-4">
        <div className="col-lg-8">
          
          {/* TAB 1: INTERACTIVE CHECKLIST */}
          {activeTab === "roadmap" && (
            <div className="card shadow-sm border-0 p-4 p-md-5 bg-white" style={{ borderRadius: "24px" }}>
              <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-check2-square text-primary"></i>
                Milestone Checklist for {career}
              </h3>

              <div className="d-flex flex-column gap-3">
                {steps.map((step, idx) => {
                  const isDone = completedSteps.includes(idx);
                  const title = typeof step === "string" ? step : step.title || step.moduleTitle || `Milestone ${idx + 1}`;
                  const desc = typeof step === "object" ? step.description : "";

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx, !isDone)}
                      className={`p-4 rounded-4 border-2 cursor-pointer transition-all ${
                        isDone
                          ? "bg-success bg-opacity-10 border-success text-dark"
                          : "bg-light border-light hover-shadow"
                      }`}
                      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="checkbox"
                          className="form-check-input flex-shrink-0"
                          style={{ width: "24px", height: "24px", cursor: "pointer" }}
                          checked={isDone}
                          onChange={(e) => toggleStep(idx, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-grow-1">
                          <h5 className={`mb-1 fw-bold ${isDone ? "text-decoration-line-through text-success" : "text-dark"}`}>
                            Step {idx + 1}: {title}
                          </h5>
                          {desc && <p className="mb-0 text-muted small">{desc}</p>}
                        </div>
                        {isDone && <span className="badge bg-success rounded-pill px-3 py-2">Done ✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: JOURNEY PATH VISUALIZER */}
          {activeTab === "journey" && (
            <div className="card shadow-sm border-0 p-4 p-md-5 bg-white" style={{ borderRadius: "24px" }}>
              <h3 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-diagram-3 text-primary"></i>
                Academic & Career Journey Path
              </h3>
              <p className="text-muted mb-4">Step-by-step timeline transition from education to target role:</p>

              <div className="position-relative my-4 mx-auto text-start" style={{ maxWidth: "600px" }}>
                <div className="position-absolute start-50 translate-middle-x h-100" style={{ width: "4px", backgroundColor: "#e9ecef", zIndex: 1, top: "20px" }}></div>

                {[
                  { label: "Current Education", value: bp.currentEducation || userProfile?.education || "Intermediate / Diploma", icon: "🎓", color: "#6f42c1" },
                  { label: "Recommended Degree", value: bp.recommendedDegree || currentCareerDetails?.recommendedEducation || "Bachelor's Degree", icon: "📚", color: "#0d6efd" },
                  { label: "Core Skills", value: bp.requiredSkills || (currentCareerDetails?.requiredSkills ? currentCareerDetails.requiredSkills.join(", ") : "Key Technical Skills"), icon: "💻", color: "#198754" },
                  { label: "Projects & Portfolio", value: bp.projects || "Build 3+ Industry Capstones", icon: "🛠", color: "#ffc107" },
                  { label: "Internship / Entry Role", value: bp.internship || "Junior / Intern Position", icon: "🏢", color: "#0dcaf0" },
                  { label: "Target Dream Career", value: bp.careerGoal || career, icon: "🎯", color: "#dc3545" }
                ].map((node, index) => (
                  <div key={index} className="d-flex align-items-center mb-4 position-relative" style={{ zIndex: 2 }}>
                    <div className="w-50 text-end pe-4">
                      <span className="fw-bold text-muted small">{node.label}</span>
                    </div>
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center shadow" 
                      style={{ 
                        width: "44px", 
                        height: "44px", 
                        backgroundColor: "white", 
                        border: `3px solid ${node.color}`,
                        fontSize: "1.2rem",
                        zIndex: 3
                      }}
                    >
                      {node.icon}
                    </div>
                    <div className="w-50 ps-4">
                      <div className="p-3 bg-light rounded-3 border">
                        <strong className="text-dark d-block">{node.value}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CAREER INSIGHTS */}
          {activeTab === "insights" && (
            <div className="card shadow-sm border-0 p-4 p-md-5 bg-white" style={{ borderRadius: "24px" }}>
              <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-lightbulb text-primary"></i>
                Career Insights & Market Overview
              </h3>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-4 bg-success bg-opacity-10 rounded-4 border border-success h-100">
                    <span className="text-success fw-bold d-block mb-1">💰 Expected Salary Range (India)</span>
                    <h4 className="fw-bold text-dark mb-0">{currentCareerDetails?.salaryRangeIndia || currentCareerDetails?.salary || "₹6,00,000 - ₹25,00,000 / year"}</h4>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 bg-primary bg-opacity-10 rounded-4 border border-primary h-100">
                    <span className="text-primary fw-bold d-block mb-1">📈 Future Industry Scope</span>
                    <p className="mb-0 text-dark small">{currentCareerDetails?.futureScope || "High demand career track with rapid growth in domestic and international markets."}</p>
                  </div>
                </div>
              </div>

              {currentCareerDetails?.topRecruiters && (
                <div className="mb-4 p-4 bg-light rounded-4 border">
                  <strong className="text-dark d-block mb-2">🏢 Top Recruiters & Employers:</strong>
                  <div className="d-flex flex-wrap gap-2">
                    {currentCareerDetails.topRecruiters.map((rec, i) => (
                      <span key={i} className="badge bg-white text-dark border px-3 py-2 rounded-pill fw-semibold">
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {currentCareerDetails?.requiredSkills && (
                <div className="p-4 bg-light rounded-4 border">
                  <strong className="text-dark d-block mb-2">⚡ Essential Skills to Master:</strong>
                  <div className="d-flex flex-wrap gap-2">
                    {currentCareerDetails.requiredSkills.map((sk, i) => (
                      <span key={i} className="badge bg-primary px-3 py-2 rounded-pill fw-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROJECTS & PRACTICE LABS */}
          {activeTab === "projects" && (
            <div className="card shadow-sm border-0 p-4 p-md-5 bg-white" style={{ borderRadius: "24px" }}>
              <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-code-square text-primary"></i>
                Recommended Projects & Practice Labs
              </h3>

              {resolvedResources?.projects && (
                <div className="mb-4">
                  <h5 className="fw-bold text-success mb-3">🟢 Beginner Projects</h5>
                  <ul className="list-group mb-4">
                    {resolvedResources.projects.beginner.map((p, i) => (
                      <li key={i} className="list-group-item bg-light border-0 mb-2 rounded-3">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>{p}
                      </li>
                    ))}
                  </ul>

                  <h5 className="fw-bold text-primary mb-3">🔵 Intermediate Projects</h5>
                  <ul className="list-group mb-4">
                    {resolvedResources.projects.intermediate.map((p, i) => (
                      <li key={i} className="list-group-item bg-light border-0 mb-2 rounded-3">
                        <i className="bi bi-star-fill text-primary me-2"></i>{p}
                      </li>
                    ))}
                  </ul>

                  <h5 className="fw-bold text-danger mb-3">🔴 Advanced Capstone Projects</h5>
                  <ul className="list-group">
                    {resolvedResources.projects.advanced.map((p, i) => (
                      <li key={i} className="list-group-item bg-light border-0 mb-2 rounded-3">
                        <i className="bi bi-trophy-fill text-danger me-2"></i>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resolvedResources?.practicePlatforms && (
                <div className="mt-4 pt-3 border-top">
                  <h5 className="fw-bold text-dark mb-3">🎯 Recommended Practice Platforms</h5>
                  <div className="row g-3">
                    {resolvedResources.practicePlatforms.map((plat, i) => (
                      <div key={i} className="col-md-6">
                        <a href={plat.url} target="_blank" rel="noreferrer" className="text-decoration-none">
                          <div className="p-3 border rounded-3 bg-light hover-shadow h-100">
                            <strong className="text-primary d-block">{plat.name}</strong>
                            <small className="text-muted">{plat.focus}</small>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FREE LEARNING RESOURCES */}
          {activeTab === "resources" && (
            <div className="card shadow-sm border-0 p-4 p-md-5 bg-white" style={{ borderRadius: "24px" }}>
              <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-book text-primary"></i>
                Free Curated Learning Resources
              </h3>

              <h5 className="fw-bold text-primary mb-3">🎓 Free Courses</h5>
              <div className="d-flex flex-column gap-2 mb-4">
                {resolvedResources.freeCourses.map((c, i) => (
                  <a key={i} href={c.url} target="_blank" rel="noreferrer" className="p-3 border rounded-3 text-decoration-none text-dark bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="d-block text-primary">{c.title}</strong>
                      <small className="text-muted">{c.provider}</small>
                    </div>
                    <i className="bi bi-box-arrow-up-right text-muted"></i>
                  </a>
                ))}
              </div>

              <h5 className="fw-bold text-danger mb-3">▶️ Recommended YouTube Playlists</h5>
              <div className="d-flex flex-column gap-2 mb-4">
                {resolvedResources.youtubePlaylists.map((yt, i) => (
                  <div key={i} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="d-block text-dark">{yt.title}</strong>
                      <small className="text-danger fw-semibold">{yt.channel}</small>
                    </div>
                    <i className="bi bi-youtube text-danger fs-4"></i>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Gemini AI Mentor */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-white sticky-top" style={{ top: "20px", borderRadius: "20px" }}>
            <h4 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-robot text-primary fs-4"></i>
              Gemini AI Mentor
            </h4>
            <p className="text-muted small">Ask any doubt about your {career} learning roadmap:</p>

            <form onSubmit={handleAskAI}>
              <div className="mb-3">
                <textarea
                  className="form-control bg-light border-0 p-3"
                  rows="3"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={`e.g. How do I prepare for ${career} interviews?`}
                  style={{ borderRadius: "14px" }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold rounded-pill shadow-sm"
                disabled={asking || !question.trim()}
              >
                {asking ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Asking AI...
                  </>
                ) : (
                  <>
                    Ask AI Mentor <i className="bi bi-send-fill ms-1"></i>
                  </>
                )}
              </button>
            </form>

            {aiAnswer && (
              <div className="mt-3 p-3 bg-primary bg-opacity-10 rounded-4 border border-primary">
                <small className="fw-bold text-primary d-block mb-1">AI Response:</small>
                <p className="mb-0 small text-dark" style={{ whiteSpace: "pre-line" }}>
                  {aiAnswer}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
