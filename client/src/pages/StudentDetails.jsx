import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestoreService";

export default function StudentDetails() {
  const navigate = useNavigate();
  const { currentUser, userProfile, refreshProfile } = useAuth();

  // Form states
  const [name, setName] = useState("");
  const [education, setEducation] = useState("Select");
  const [knowsCareer, setKnowsCareer] = useState(true);
  const [career, setCareer] = useState("Software Engineer");
  const [studyHours, setStudyHours] = useState("");
  const [careersList, setCareersList] = useState([]);

  // Load careers database on mount
  useEffect(() => {
    fetch("/data/careers.json")
      .then((res) => res.json())
      .then((data) => {
        setCareersList(data);
      })
      .catch((err) => {
        console.error("Error loading careers database in StudentDetails:", err);
      });
  }, []);

  // Sync state with userProfile when it loads
  useEffect(() => {
    setName(userProfile?.name || localStorage.getItem("name") || "");
    setEducation(userProfile?.education || localStorage.getItem("education") || "Select");
    setCareer(userProfile?.dreamCareer || userProfile?.careerGoal || localStorage.getItem("career") || "Software Engineer");
    setStudyHours(userProfile?.studyHours || localStorage.getItem("study") || "");
  }, [userProfile]);

  // Handle roadmap generation submission
  const generateRoadmap = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (education === "Select") {
      alert("Please select your education.");
      return;
    }

    if (career === "Not sure yet") {
      handleHelpMeDecide();
      return;
    }

    if (!studyHours) {
      alert("Please enter study hours.");
      return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("education", education);
    localStorage.setItem("career", career);
    localStorage.setItem("study", studyHours);

    if (currentUser) {
      try {
        await updateUserProfile(currentUser.uid, {
          name,
          dreamCareer: career,
          careerGoal: career,
          careerStatus: "decided",
          education,
          studyHours,
          progress: 0,
          completedTasks: []
        });
        await refreshProfile(currentUser.uid);
      } catch (err) {
        console.error("Error updating profile in Firestore:", err);
      }
    }

    navigate("/roadmap");
  };

  const handleHelpMeDecide = async () => {
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
    navigate("/student-profile");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-5 mx-auto" style={{ maxWidth: "700px", borderRadius: "24px" }}>
        <h2 className="text-center mb-2 fw-bold text-primary">Tell Us About Yourself</h2>
        <p className="text-center text-muted mb-4">
          Provide your details to generate a custom roadmap or discover your dream career with AI.
        </p>

        {/* Not Sure Yet Callout */}
        <div className="p-3 mb-4 rounded-4 bg-primary bg-opacity-10 border border-primary d-flex align-items-center justify-content-between gap-3">
          <div>
            <strong className="text-primary d-block">Not sure what your dream career is?</strong>
            <small className="text-muted">Let AI Genie analyze your interests & strengths to match your ideal career.</small>
          </div>
          <button
            type="button"
            onClick={handleHelpMeDecide}
            className="btn btn-primary btn-sm rounded-pill px-3 py-2 fw-bold flex-shrink-0"
          >
            Not Sure Yet 🧞‍♂️
          </button>
        </div>

        <form onSubmit={generateRoadmap}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="form-label fw-bold">Full Name</label>
            <input
              type="text"
              className="form-control form-control-lg bg-light"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Education */}
          <div className="mb-4">
            <label className="form-label fw-bold">Education</label>
            <select
              className="form-select form-select-lg bg-light"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              required
            >
              <option value="Select">Select Education Level</option>
              <option value="Class 10">Class 10</option>
              <option value="Intermediate">Intermediate (12th)</option>
              <option value="Diploma">Diploma</option>
              <option value="B.Tech">B.Tech</option>
              <option value="Degree">Degree / Graduation</option>
              <option value="Post Graduate">Post Graduate</option>
            </select>
          </div>

          {/* Goal Knowledge Option */}
          <div className="mb-4">
            <label className="form-label fw-bold d-block">
              Do you already know your career goal?
            </label>
            <div className="form-check form-check-inline me-4">
              <input
                className="form-check-input"
                type="radio"
                name="careerChoice"
                id="knowsYes"
                checked={knowsCareer === true}
                onChange={() => setKnowsCareer(true)}
              />
              <label className="form-check-label fw-semibold" htmlFor="knowsYes">
                Yes, I know my dream career
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="careerChoice"
                id="knowsNo"
                checked={knowsCareer === false}
                onChange={handleHelpMeDecide}
              />
              <label className="form-check-label fw-semibold text-primary" htmlFor="knowsNo">
                No, Not Sure Yet (Help Me Decide 🧞‍♂️)
              </label>
            </div>
          </div>

          {/* If Yes: Select Dream Career */}
          {knowsCareer && (
            <div className="mb-4 p-3 bg-light rounded-4 border">
              <label className="form-label fw-bold text-secondary">Dream Career</label>
              <select
                className="form-select form-select-lg bg-white"
                value={career}
                onChange={(e) => {
                  setCareer(e.target.value);
                  if (e.target.value === "Not sure yet") {
                    handleHelpMeDecide();
                  }
                }}
              >
                <option value="Not sure yet">❓ Not sure yet (Help Me Decide with AI Genie 🧞‍♂️)</option>
                {careersList.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Study Hours */}
          <div className="mb-4">
            <label className="form-label fw-bold">Study Hours Per Day</label>
            <input
              type="number"
              className="form-control form-control-lg bg-light"
              value={studyHours}
              onChange={(e) => setStudyHours(e.target.value)}
              placeholder="e.g. 4"
              min="1"
              max="24"
              required={career !== "Not sure yet"}
            />
          </div>

          {/* Generate Roadmap Button */}
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-3 fw-bold shadow-lg rounded-pill"
            style={{ fontSize: "1.1rem" }}
          >
            {career === "Not sure yet" ? (
              <>
                Analyze Profile & Suggest Careers <i className="bi bi-magic ms-1"></i>
              </>
            ) : (
              <>
                Generate Roadmap <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
