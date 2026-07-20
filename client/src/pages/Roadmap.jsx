import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestoreService";
import { getLearningResources } from "../data/learningResources";

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

  const name = userProfile?.name || localStorage.getItem("name") || "Student";
  const careerStatus = userProfile?.careerStatus || "";
  let careerName = userProfile?.dreamCareer || userProfile?.careerGoal || localStorage.getItem("career") || "Software Engineer";
  
  const [careersList, setCareersList] = useState([]);
  const [currentCareerDetails, setCurrentCareerDetails] = useState(null);
  const [steps, setSteps] = useState([]);
  const [viewMode, setViewMode] = useState("journey");

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

  let targetCareerName = "";
  if (currentUser) {
    targetCareerName = userProfile?.dreamCareer || userProfile?.careerGoal || "";
  } else {
    targetCareerName = localStorage.getItem("career") || "";
  }

  const hasSelectedCareer = Boolean(
    targetCareerName && 
    targetCareerName.trim() !== "" && 
    targetCareerName !== "Not sure yet" && 
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
      const targetLower = targetCareerName.toLowerCase();
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
      setSteps(getDefaultStepsForCareer(targetCareerName));
      if (found) setCurrentCareerDetails(found);
    }
  }, [careersList, userProfile, hasSelectedCareer, targetCareerName]);

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
  const [loading, setLoading] = useState(false);

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

    // Trigger confetti if this checking hits 100%
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

  // Ask AI Mentor logic
  const askAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      alert("Please ask a question.");
      return;
    }

    setLoading(true);
    setAiAnswer("🤖 Thinking...");

    try {
      const response = await fetch("http://localhost:3000/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setAiAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAiAnswer("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isExploring = (userProfile?.careerStatus === "exploring" || careerName === "Not sure yet" || careerName === "Career Exploration Roadmap");

  if (viewMode === "journey" && currentCareerDetails && !isExploring) {
    const bp = currentCareerDetails.bridgePath || {};
    return (
      <div className="container py-5">
        <div className="card shadow-lg p-5 mx-auto text-center border-0 bg-white" style={{ maxWidth: "800px", borderRadius: "24px" }}>
          <div className="mb-4">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-2">My Journey Path</span>
            <h1 className="display-6 fw-bold text-dark">{currentCareerDetails.name} Path</h1>
            <p className="text-muted">
              Here is your visual academic and skill path to transition from your current education to your dream career.
            </p>
          </div>

          {/* Vertical Journey Visualizer */}
          <div className="position-relative my-5 mx-auto text-start" style={{ maxWidth: "600px" }}>
            {/* The line connecting nodes */}
            <div className="position-absolute start-50 translate-middle-x h-100" style={{ width: "4px", backgroundColor: "#e9ecef", zIndex: 1, top: "20px" }}></div>

            {/* Nodes */}
            {[
              { label: "Current Education", value: bp.currentEducation || userProfile?.education || "Intermediate (MPC)", icon: "🎓", color: "#6f42c1" },
              { label: "Recommended Degree", value: bp.recommendedDegree || currentCareerDetails.recommendedEducation || "B.Tech CSE", icon: "📚", color: "#0d6efd" },
              { label: "Required Skills", value: bp.requiredSkills || "Programming", icon: "💻", color: "#198754" },
              { label: "Projects", value: bp.projects || "DSA", icon: "🛠", color: "#ffc107" },
              { label: "Internship", value: bp.internship || "Internship", icon: "🏢", color: "#0dcaf0" },
              { label: "Final Career", value: bp.careerGoal || currentCareerDetails.name || "Software Engineer", icon: "🎯", color: "#dc3545" }
            ].map((node, index) => (
              <div key={index} className="d-flex align-items-center mb-5 position-relative" style={{ zIndex: 2 }}>
                {/* Left Side spacer/alignment */}
                <div className="w-50 text-end pe-4 d-none d-sm-block">
                  <span className="fw-bold text-muted small">{node.label}</span>
                </div>

                {/* Node Center Dot */}
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center shadow" 
                  style={{ 
                    width: "48px", 
                    height: "48px", 
                    backgroundColor: "white", 
                    border: `4px solid ${node.color}`,
                    fontSize: "1.4rem",
                    zIndex: 3
                  }}
                >
                  {node.icon}
                </div>

                {/* Right Side Content Card */}
                <div className="w-100 w-sm-50 ps-4">
                  <div className="card shadow-sm border-0 p-3" style={{ borderRadius: "14px", backgroundColor: "#f8f9fa" }}>
                    <span className="fw-bold text-muted small d-sm-none">{node.label}</span>
                    <h5 className="fw-bold mb-1" style={{ color: node.color }}>{node.value}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => setViewMode("roadmap")}
              className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg transition-all"
              style={{ minWidth: "250px", fontSize: "1.1rem" }}
            >
              Continue <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
        <h1 className="text-primary fw-bold mb-0">
          🚀 {career} Roadmap
        </h1>
        {!isExploring && (
          <button 
            onClick={() => setViewMode("journey")} 
            className="btn btn-outline-primary rounded-pill fw-bold"
          >
            <i className="bi bi-compass me-1"></i> View Visual Journey
          </button>
        )}
      </div>

      {/* Welcome Alert */}
      <div className="alert alert-info text-center shadow-sm">
        <h4 className="fw-bold">Welcome, {name}</h4>
        <p className="mb-0">
          Your Goal: <strong>{career}</strong>
        </p>
      </div>

      {careerStatus === "exploring" && (
        <div className="alert alert-warning text-center shadow-sm border-warning mb-4 py-3">
          <span className="fs-5 me-2">🧞‍♂️</span>
          <strong>Need help choosing your path?</strong> Identify your strengths and interests using our career matching wizard to discover suitable paths:
          <Link to="/discover-career" className="btn btn-warning btn-sm fw-bold rounded-pill ms-2 px-4 py-2 shadow-sm">
            Discover My Career
          </Link>
        </div>
      )}

      {/* Progress Tracker Card */}
      <div className="card shadow p-4 mb-4 border-0">
        <h4 className="mb-3 text-primary fw-bold">🎯 Your Learning Progress</h4>
        <div className="progress mb-3" style={{ height: "25px", borderRadius: "12px" }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-success fw-bold"
            role="progressbar"
            style={{ width: `${percentage}%` }}
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {percentage}%
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="fw-bold text-secondary">
            Progress: {completedCount} of {totalSteps} steps completed
          </span>
          {percentage === 100 && (
            <span className="text-success fw-bold fs-5 animate-celebration">
              🎉 Congratulations! You completed your roadmap!
            </span>
          )}
        </div>
      </div>

      {/* Career Insights & Resources (Dynamic Database-driven details) */}
      {currentCareerDetails && (
        <div className="card shadow p-4 mb-4 border-0 bg-white" style={{ borderRadius: "20px" }}>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className={`rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center`} style={{ width: "50px", height: "50px", fontSize: "1.5rem" }}>
              <i className={`bi ${currentCareerDetails.icon || "bi-info-circle-fill"}`}></i>
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-dark">{currentCareerDetails.name} Insights</h4>
              <span className="badge bg-light text-secondary border mt-1">
                Category: {currentCareerDetails.category} {currentCareerDetails.stream ? `| Stream: ${currentCareerDetails.stream}` : ""}
              </span>
            </div>
          </div>

          <p className="text-muted mb-3">{currentCareerDetails.description}</p>
          
          <div className="row g-3 mt-1 mb-4">
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <h6 className="fw-bold text-secondary mb-2"><i className="bi bi-patch-check-fill text-success me-2"></i>Eligibility</h6>
                <p className="small mb-0 text-dark">{currentCareerDetails.eligibility}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <h6 className="fw-bold text-secondary mb-2"><i className="bi bi-clock-history text-info me-2"></i>Preparation Duration</h6>
                <p className="small mb-0 text-dark">{currentCareerDetails.durationToPrepare || "Varies"}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <h6 className="fw-bold text-secondary mb-2"><i className="bi bi-currency-rupee text-warning me-2"></i>Average Salary in India</h6>
                <p className="small mb-0 text-dark fw-semibold">{currentCareerDetails.salary || currentCareerDetails.salaryRangeIndia}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <h6 className="fw-bold text-secondary mb-2"><i className="bi bi-graph-up-arrow text-primary me-2"></i>Future Scope</h6>
                <p className="small mb-0 text-dark">{currentCareerDetails.futureScope}</p>
              </div>
            </div>
          </div>

          {currentCareerDetails.requiredSkills && currentCareerDetails.requiredSkills.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-secondary mb-2">Required Skills:</h6>
              <div className="d-flex flex-wrap gap-2">
                {currentCareerDetails.requiredSkills.map((skill, index) => (
                  <span key={index} className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold" style={{ fontSize: "0.85rem" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="row g-3">
            {currentCareerDetails.certifications && currentCareerDetails.certifications.length > 0 && (
              <div className="col-md-6">
                <h6 className="fw-bold text-secondary mb-2">Recommended Certifications:</h6>
                <ul className="list-group list-group-flush small">
                  {currentCareerDetails.certifications.map((cert, index) => (
                    <li key={index} className="list-group-item bg-transparent px-0 py-1 text-dark border-0">
                      <i className="bi bi-award text-success me-2"></i>{cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {currentCareerDetails.topRecruiters && currentCareerDetails.topRecruiters.length > 0 && (
              <div className="col-md-6">
                <h6 className="fw-bold text-secondary mb-2">Top Recruiters:</h6>
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {currentCareerDetails.topRecruiters.map((recruiter, index) => (
                    <span key={index} className="badge bg-light text-dark border px-2 py-1.5 rounded">
                      {recruiter}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {((currentCareerDetails.resources || currentCareerDetails.learningResources) && (currentCareerDetails.resources || currentCareerDetails.learningResources).length > 0) && (
            <div className="mt-4 pt-3 border-top">
              <h6 className="fw-bold text-secondary mb-2"><i className="bi bi-journal-bookmark-fill text-primary me-2"></i>High-Quality Learning Resources & Guides:</h6>
              <div className="list-group list-group-flush">
                {(currentCareerDetails.resources || currentCareerDetails.learningResources).map((res, index) => (
                  <div key={index} className="list-group-item bg-transparent px-0 py-2 d-flex align-items-start gap-2 border-0">
                    <span className="badge bg-info text-white mt-0.5">{index + 1}</span>
                    <div className="text-dark small fw-semibold">{res}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Roadmap steps timeline */}
      <div className="timeline mb-5">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          return (
            <div
              key={index}
              className={`timeline-item ${isCompleted ? "completed" : ""}`}
              id={`item-${index}`}
            >
              <div className="form-check d-flex align-items-center">
                <input
                  className="form-check-input me-3 step-checkbox"
                  type="checkbox"
                  id={`check-${index}`}
                  checked={isCompleted}
                  onChange={(e) => toggleStep(index, e.target.checked)}
                />
                <label className="form-check-label flex-grow-1" htmlFor={`check-${index}`}>
                  <h5 className="mb-1 fw-bold">Step {index + 1}</h5>
                  <p className="mb-0 text-muted step-description">{step}</p>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Learning Resources & Projects Section */}
      {resolvedResources && (
        <div className="card shadow-sm border-0 p-4 mb-5 bg-white" style={{ borderRadius: "20px" }}>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 border-bottom pb-3 gap-2">
            <div>
              <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-book-half text-primary fs-3"></i>
                Learning Resources & Project Ideas
              </h3>
              <p className="text-muted small mb-0">
                Curated learning courses, video tutorials, practice platforms, documentation, and real-world project ideas for <strong>{career}</strong>.
              </p>
            </div>
            <span className="badge bg-primary rounded-pill px-3 py-2 align-self-start align-self-md-center">
              <i className="bi bi-stars me-1"></i>Career-Specific
            </span>
          </div>

          <div className="row g-4">
            {/* Free Courses */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 bg-light p-3 rounded-4">
                <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-mortarboard-fill fs-5"></i> Free Courses
                </h6>
                <div className="d-flex flex-column gap-2">
                  {resolvedResources.freeCourses?.map((c, i) => (
                    <a
                      key={i}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none p-2 bg-white rounded-3 border text-dark hover-shadow transition-all d-block"
                      style={{ fontSize: "0.88rem" }}
                    >
                      <div className="fw-bold text-truncate">{c.title}</div>
                      <div className="small text-muted">{c.provider}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* YouTube Playlists */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 bg-light p-3 rounded-4">
                <h6 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-youtube fs-5"></i> YouTube Playlists
                </h6>
                <div className="d-flex flex-column gap-2">
                  {resolvedResources.youtubePlaylists?.map((yt, i) => (
                    <div key={i} className="p-2 bg-white rounded-3 border text-dark" style={{ fontSize: "0.88rem" }}>
                      <div className="fw-bold text-truncate">{yt.title}</div>
                      <div className="small text-danger fw-semibold"><i className="bi bi-play-circle me-1"></i>{yt.channel}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Practice Platforms */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 bg-light p-3 rounded-4">
                <h6 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-laptop-fill fs-5"></i> Practice Platforms
                </h6>
                <div className="d-flex flex-column gap-2">
                  {resolvedResources.practicePlatforms?.map((p, i) => (
                    <a
                      key={i}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none p-2 bg-white rounded-3 border text-dark hover-shadow transition-all d-block"
                      style={{ fontSize: "0.88rem" }}
                    >
                      <div className="fw-bold text-truncate">{p.name}</div>
                      <div className="small text-muted">{p.focus}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Official Documentation */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 bg-light p-3 rounded-4">
                <h6 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-file-earmark-code-fill fs-5"></i> Official Docs
                </h6>
                <div className="d-flex flex-column gap-2">
                  {resolvedResources.officialDocs?.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none p-2 bg-white rounded-3 border text-dark hover-shadow transition-all d-block"
                      style={{ fontSize: "0.88rem" }}
                    >
                      <div className="fw-bold text-truncate">{doc.name}</div>
                      <div className="small text-info"><i className="bi bi-box-arrow-up-right me-1"></i>Official Guide</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Ideas Section */}
          {resolvedResources.projects && (
            <div className="mt-4 pt-4 border-top">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-rocket-takeoff-fill text-warning"></i>
                Recommended Project Ideas ({career})
              </h5>
              <div className="row g-3">
                {/* Beginner */}
                <div className="col-md-4">
                  <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-4 h-100">
                    <span className="badge bg-success mb-2 px-3 py-1">🟢 Beginner Projects</span>
                    <ul className="mb-0 ps-3 small text-dark">
                      {resolvedResources.projects.beginner?.map((proj, i) => (
                        <li key={i} className="mb-2 fw-semibold">{proj}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Intermediate */}
                <div className="col-md-4">
                  <div className="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-4 h-100">
                    <span className="badge bg-warning text-dark mb-2 px-3 py-1">🟡 Intermediate Projects</span>
                    <ul className="mb-0 ps-3 small text-dark">
                      {resolvedResources.projects.intermediate?.map((proj, i) => (
                        <li key={i} className="mb-2 fw-semibold">{proj}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Advanced */}
                <div className="col-md-4">
                  <div className="p-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-4 h-100">
                    <span className="badge bg-danger mb-2 px-3 py-1">🔴 Advanced Projects</span>
                    <ul className="mb-0 ps-3 small text-dark">
                      {resolvedResources.projects.advanced?.map((proj, i) => (
                        <li key={i} className="mb-2 fw-semibold">{proj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Mentor Card */}
      <div className="card shadow p-4 mb-5 border-0">
        <h3 className="text-center text-primary fw-bold">
          🤖 Career Genie AI Mentor
        </h3>
        <form onSubmit={askAI}>
          <input
            type="text"
            className="form-control mt-3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about your career..."
            required
          />
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3 fw-bold"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </form>

        {aiAnswer && (
          <div
            className={`alert mt-4 ${
              aiAnswer.startsWith("❌") ? "alert-danger" : "alert-success"
            }`}
            style={{ whiteSpace: "pre-line" }}
          >
            {aiAnswer}
          </div>
        )}
      </div>
    </div>
  );
}
