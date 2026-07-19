import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { generateRoadmapFromAI, saveUserProgress } from "../services/roadmapService.js";
import { askAiMentor } from "../services/api.js";
import { getLearningResources } from "../data/resources.js";
import { DEFAULT_ROADMAP_TEMPLATES } from "../data/roadmapTemplates.js";
import ProgressBar from "../components/ProgressBar.jsx";
import RoadmapCard from "../components/RoadmapCard.jsx";

export default function Roadmap() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const { studentDetails } = useUser();

  const name = userProfile?.name || studentDetails.name || localStorage.getItem("name") || "Student";
  const career = userProfile?.dreamCareer || userProfile?.careerGoal || localStorage.getItem("career") || "Software Engineer";

  const [aiRoadmapData, setAiRoadmapData] = useState(null);
  const [steps, setSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);

  // AI Mentor State
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadAloud, setAutoReadAloud] = useState(false);

  const progressKey = `progress_${career.replace(/\s+/g, "")}`;

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Fetch AI Roadmap or Template on mount
  useEffect(() => {
    async function loadRoadmap() {
      setLoadingRoadmap(true);
      const generated = await generateRoadmapFromAI(userProfile || studentDetails, career);
      if (generated) {
        setAiRoadmapData(generated);
        if (generated.semesterLearning && generated.semesterLearning.length > 0) {
          setSteps(generated.semesterLearning);
        } else {
          setSteps(DEFAULT_ROADMAP_TEMPLATES[career] || DEFAULT_ROADMAP_TEMPLATES["Software Engineer"]);
        }
      } else {
        setSteps(DEFAULT_ROADMAP_TEMPLATES[career] || DEFAULT_ROADMAP_TEMPLATES["Software Engineer"]);
      }
      setLoadingRoadmap(false);
    }
    loadRoadmap();
  }, [career, userProfile]);

  // Load completed steps from profile or localstorage
  useEffect(() => {
    if (userProfile && userProfile.completedTasks) {
      setCompletedSteps(userProfile.completedTasks);
    } else {
      const saved = localStorage.getItem(progressKey);
      setCompletedSteps(saved ? JSON.parse(saved) : []);
    }
  }, [userProfile, progressKey]);

  const totalSteps = steps.length;
  const completedCount = completedSteps.length;
  const percentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const toggleStep = async (index, isChecked) => {
    let updated;
    if (isChecked) {
      if (!completedSteps.includes(index)) {
        updated = [...completedSteps, index];
      } else return;
    } else {
      updated = completedSteps.filter((i) => i !== index);
    }

    setCompletedSteps(updated);
    localStorage.setItem(progressKey, JSON.stringify(updated));

    if (isChecked && updated.length === totalSteps) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }

    if (currentUser) {
      try {
        await saveUserProgress(currentUser.uid, updated, totalSteps);
        await refreshProfile(currentUser.uid);
      } catch (err) {
        console.error("Error saving progress:", err);
      }
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Chrome, Edge or Safari.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = async (event) => {
      const speechToText = event.results[0][0].transcript;
      setQuestion(speechToText);
      setIsListening(false);

      if (speechToText.trim()) {
        setAsking(true);
        setAiAnswer("🤖 Gemini AI is thinking...");
        try {
          const res = await askAiMentor(speechToText);
          const answerText = res.answer || "No response received.";
          setAiAnswer(answerText);
          if (autoReadAloud) {
            speakAnswer(answerText);
          }
        } catch (err) {
          setAiAnswer("❌ " + err.message);
        } finally {
          setAsking(false);
        }
      }
    };

    recognition.start();
  };

  const speakAnswer = (text) => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const cleanText = text
      .replace(/\*\*?/g, "")
      .replace(/##?/g, "")
      .replace(/-\s+/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setAsking(true);
    setAiAnswer("🤖 Gemini AI is thinking...");

    try {
      const res = await askAiMentor(question);
      const answerText = res.answer || "No response received.";
      setAiAnswer(answerText);
      if (autoReadAloud) {
        speakAnswer(answerText);
      }
    } catch (err) {
      setAiAnswer("❌ " + err.message);
    } finally {
      setAsking(false);
    }
  };

  const resources = getLearningResources(career);

  return (
    <div className="container mt-5 py-3">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-2">
            AI Personalized Roadmap
          </span>
          <h1 className="text-primary fw-bold mb-0">🚀 {career} Roadmap</h1>
        </div>
        <Link to="/select-career" className="btn btn-outline-secondary rounded-pill fw-bold">
          <i className="bi bi-pencil me-1"></i> Change Career Dream
        </Link>
      </div>

      {/* Welcome Alert */}
      <div className="alert alert-info text-center shadow-sm rounded-4 mb-4">
        <h5 className="fw-bold mb-1">Welcome, {name}!</h5>
        <p className="mb-0">
          Target Career: <strong>{career}</strong>
          {userProfile?.college ? ` | College: ${userProfile.college}` : ""}
          {userProfile?.education ? ` | ${userProfile.education}` : ""}
        </p>
      </div>

      {/* Progress Tracker */}
      <ProgressBar percentage={percentage} completedCount={completedCount} totalSteps={totalSteps} />

      {/* Overview & Insights from Gemini AI */}
      {aiRoadmapData && (
        <div className="card shadow-sm p-4 mb-4 border-0 bg-white" style={{ borderRadius: "20px" }}>
          <h4 className="fw-bold text-dark mb-3"><i className="bi bi-stars text-primary me-2"></i>Gemini AI Overview & Insights</h4>
          <p className="text-muted mb-3">{aiRoadmapData.overview}</p>
          
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3">
                <h6 className="fw-bold text-secondary mb-1">⏱ Timeline</h6>
                <p className="mb-0 text-dark small">{aiRoadmapData.timeline || "6-12 Months"}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3">
                <h6 className="fw-bold text-secondary mb-1">💼 Expected Roles</h6>
                <p className="mb-0 text-dark small">{aiRoadmapData.jobRoles?.join(", ") || career}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3">
                <h6 className="fw-bold text-secondary mb-1">💰 Salary Insights</h6>
                <p className="mb-0 text-dark small">{aiRoadmapData.salaryInsights || "Competitive Industry Standards"}</p>
              </div>
            </div>
          </div>

          <div className="row g-3">
            {aiRoadmapData.skills && (
              <div className="col-md-6">
                <h6 className="fw-bold text-secondary mb-2">Core Skills & Tech:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {aiRoadmapData.skills.concat(aiRoadmapData.technologies || []).map((s, i) => (
                    <span key={i} className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {aiRoadmapData.resumeTips && (
              <div className="col-md-6">
                <h6 className="fw-bold text-secondary mb-2">Interview Prep & Resume Tips:</h6>
                <ul className="small text-muted mb-0 ps-3">
                  {aiRoadmapData.interviewPrep?.concat(aiRoadmapData.resumeTips || []).map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step-by-Step Learning Timeline */}
      <h3 className="fw-bold text-dark mb-4">📅 Semester-Wise / Phase-Wise Roadmap</h3>
      <div className="timeline mb-5">
        {loadingRoadmap ? (
          <p className="text-muted">Generating customized AI roadmap steps...</p>
        ) : (
          steps.map((step, index) => (
            <RoadmapCard
              key={index}
              stepNumber={index + 1}
              description={step}
              isCompleted={completedSteps.includes(index)}
              onToggle={(isChecked) => toggleStep(index, isChecked)}
            />
          ))
        )}
      </div>

      {/* Dynamic Learning Resources Section */}
      <div className="card shadow-sm border-0 p-4 mb-5 bg-white" style={{ borderRadius: "20px" }}>
        <div className="border-bottom pb-3 mb-4">
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-book-half text-primary fs-3"></i>
            Curated Learning Resources ({career})
          </h3>
          <p className="text-muted small mb-0">
            Free courses, best playlists, practice platforms, official documentation, and project ideas.
          </p>
        </div>

        <div className="row g-4">
          {/* Free Courses */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 border-0 bg-light p-3 rounded-4">
              <h6 className="fw-bold text-primary mb-3"><i className="bi bi-mortarboard-fill me-1"></i> Free Courses</h6>
              <div className="d-flex flex-column gap-2">
                {resources.freeCourses?.map((c, i) => (
                  <a key={i} href={c.url} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-3 border text-dark text-decoration-none small">
                    <div className="fw-bold">{c.title}</div>
                    <div className="text-muted small">{c.provider}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* YouTube Playlists */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 border-0 bg-light p-3 rounded-4">
              <h6 className="fw-bold text-danger mb-3"><i className="bi bi-youtube me-1"></i> YouTube Playlists</h6>
              <div className="d-flex flex-column gap-2">
                {resources.youtubePlaylists?.map((yt, i) => (
                  <div key={i} className="p-2 bg-white rounded-3 border text-dark small">
                    <div className="fw-bold">{yt.title}</div>
                    <div className="text-danger small">{yt.channel}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Practice Platforms */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 border-0 bg-light p-3 rounded-4">
              <h6 className="fw-bold text-success mb-3"><i className="bi bi-laptop-fill me-1"></i> Practice Platforms</h6>
              <div className="d-flex flex-column gap-2">
                {resources.practicePlatforms?.map((p, i) => (
                  <a key={i} href={p.url} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-3 border text-dark text-decoration-none small">
                    <div className="fw-bold">{p.name}</div>
                    <div className="text-muted small">{p.focus}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Official Docs */}
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 border-0 bg-light p-3 rounded-4">
              <h6 className="fw-bold text-info mb-3"><i className="bi bi-file-earmark-code-fill me-1"></i> Official Docs</h6>
              <div className="d-flex flex-column gap-2">
                {resources.officialDocs?.map((doc, i) => (
                  <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-3 border text-dark text-decoration-none small">
                    <div className="fw-bold">{doc.name}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project Ideas */}
        {resources.projects && (
          <div className="mt-4 pt-4 border-top">
            <h5 className="fw-bold text-dark mb-3"><i className="bi bi-rocket-takeoff-fill text-warning me-2"></i>Projects ({career})</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3 bg-success bg-opacity-10 rounded-4 h-100">
                  <span className="badge bg-success mb-2">🟢 Beginner Projects</span>
                  <ul className="mb-0 ps-3 small text-dark">
                    {resources.projects.beginner?.map((p, i) => <li key={i} className="mb-1">{p}</li>)}
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-warning bg-opacity-10 rounded-4 h-100">
                  <span className="badge bg-warning text-dark mb-2">🟡 Intermediate Projects</span>
                  <ul className="mb-0 ps-3 small text-dark">
                    {resources.projects.intermediate?.map((p, i) => <li key={i} className="mb-1">{p}</li>)}
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-danger bg-opacity-10 rounded-4 h-100">
                  <span className="badge bg-danger mb-2">🔴 Advanced Projects</span>
                  <ul className="mb-0 ps-3 small text-dark">
                    {resources.projects.advanced?.map((p, i) => <li key={i} className="mb-1">{p}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Mentor Card */}
      <div className="card shadow p-4 mb-5 border-0 rounded-4 bg-white">
        <h3 className="text-center text-primary fw-bold">🤖 CareerGeenieAI Mentor</h3>
        <form onSubmit={handleAskAI}>
          <div className="input-group mt-3">
            <input
              type="text"
              className="form-control bg-light"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={isListening ? "Listening... Speak now..." : "Ask anything about your career..."}
              required
              disabled={isListening}
              style={{ borderRadius: "12px 0 0 12px" }}
            />
            <button
              type="button"
              className={`btn ${isListening ? "btn-danger" : "btn-outline-primary"}`}
              onClick={handleVoiceInput}
              title="Voice Search"
              style={{ borderRadius: "0 12px 12px 0" }}
            >
              {isListening ? (
                <div className="d-flex align-items-center gap-1">
                  <span className="spinner-grow spinner-grow-sm text-white" role="status" aria-hidden="true"></span>
                  <i className="bi bi-mic-fill"></i>
                </div>
              ) : (
                <i className="bi bi-mic"></i>
              )}
            </button>
          </div>
          
          <div className="d-flex gap-2 align-items-center justify-content-between mt-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="autoReadSwitch"
                checked={autoReadAloud}
                onChange={(e) => setAutoReadAloud(e.target.checked)}
              />
              <label className="form-check-label small text-muted font-monospace" htmlFor="autoReadSwitch">
                Auto read aloud responses 🔊
              </label>
            </div>
            
            <button type="submit" className="btn btn-primary fw-bold rounded-pill px-4" disabled={asking || isListening}>
              {asking ? "Thinking..." : "Ask AI Mentor"}
            </button>
          </div>
        </form>

        {aiAnswer && (
          <div className="alert alert-success mt-4 rounded-4 position-relative p-4 shadow-sm" style={{ borderLeft: "5px solid #198754" }}>
            <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
              <span className="fw-bold text-success d-flex align-items-center gap-2">
                <i className="bi bi-robot"></i> Mentor's Reply
              </span>
              <button
                type="button"
                className={`btn btn-sm ${isSpeaking ? "btn-danger" : "btn-outline-success"} rounded-circle d-flex align-items-center justify-content-center`}
                style={{ width: "32px", height: "32px" }}
                onClick={() => speakAnswer(aiAnswer)}
                title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
              >
                {isSpeaking ? <i className="bi bi-stop-fill"></i> : <i className="bi bi-volume-up-fill"></i>}
              </button>
            </div>
            <div style={{ whiteSpace: "pre-line", fontSize: "0.95rem" }} className="text-dark">
              {aiAnswer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
