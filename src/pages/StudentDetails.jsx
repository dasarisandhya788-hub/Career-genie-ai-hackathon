import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { updateUserProfile } from "../services/authService.js";
import { EDUCATION_LEVELS, ACADEMIC_YEARS, ACADEMIC_YEARS_BY_EDUCATION } from "../utils/constants.js";

export default function StudentDetails() {
  const navigate = useNavigate();
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const { selectedCareer, setStudentDetails } = useUser();

  // Form states
  const [name, setName] = useState("");
  const [education, setEducation] = useState("B.Tech");
  const [currentYear, setCurrentYear] = useState("3rd Year");
  const [college, setCollege] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [studyHours, setStudyHours] = useState("4");
  const [targetCompany, setTargetCompany] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(userProfile?.name || localStorage.getItem("name") || "");
    const edu = userProfile?.education || localStorage.getItem("education") || "B.Tech";
    setEducation(edu);
    
    const validYears = ACADEMIC_YEARS_BY_EDUCATION[edu] || ACADEMIC_YEARS;
    const yr = userProfile?.currentYear || localStorage.getItem("currentYear") || "3rd Year";
    if (validYears.includes(yr)) {
      setCurrentYear(yr);
    } else {
      setCurrentYear(validYears[0]);
    }
    setCollege(userProfile?.college || localStorage.getItem("college") || "");
    setSkills(userProfile?.skills || localStorage.getItem("skills") || "");
    setInterests(userProfile?.interests || localStorage.getItem("interests") || "");
    setStudyHours(userProfile?.studyHours || localStorage.getItem("studyHours") || "4");
    setTargetCompany(userProfile?.targetCompany || localStorage.getItem("targetCompany") || "");
  }, [userProfile]);

  const handleEducationChange = (newEdu) => {
    setEducation(newEdu);
    const validYears = ACADEMIC_YEARS_BY_EDUCATION[newEdu] || ACADEMIC_YEARS;
    if (!validYears.includes(currentYear)) {
      setCurrentYear(validYears[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your Full Name.");
      return;
    }
    if (!college.trim()) {
      alert("Please enter your College name.");
      return;
    }
    if (!studyHours) {
      alert("Please enter daily Study Hours.");
      return;
    }

    setIsSaving(true);

    const detailsObj = {
      name,
      education,
      currentYear,
      college,
      skills,
      interests,
      studyHours,
      targetCompany
    };

    // Store in localStorage & UserContext
    localStorage.setItem("name", name);
    localStorage.setItem("education", education);
    localStorage.setItem("currentYear", currentYear);
    localStorage.setItem("college", college);
    localStorage.setItem("skills", skills);
    localStorage.setItem("interests", interests);
    localStorage.setItem("studyHours", studyHours);
    localStorage.setItem("targetCompany", targetCompany);
    setStudentDetails(detailsObj);

    if (currentUser) {
      try {
        await updateUserProfile(currentUser.uid, {
          name,
          education,
          currentYear,
          college,
          skills,
          interests,
          studyHours,
          targetCompany,
          dreamCareer: selectedCareer || userProfile?.dreamCareer || "Software Engineer",
          careerGoal: selectedCareer || userProfile?.dreamCareer || "Software Engineer"
        });
        await refreshProfile(currentUser.uid);
      } catch (err) {
        console.error("Error updating profile details:", err);
      }
    }

    setIsSaving(false);
    // Flow step: Student Details -> Generate AI Roadmap
    navigate("/roadmap");
  };

  return (
    <div className="container mt-5 py-3">
      <div className="card shadow-lg p-5 mx-auto border-0 bg-white" style={{ maxWidth: "720px", borderRadius: "24px" }}>
        <div className="text-center mb-4">
          <span className="fs-1">🎓</span>
          <h2 className="fw-bold text-primary mt-2">Student Details</h2>
          <p className="text-muted small">
            Provide your academic background so Gemini AI can generate your custom career roadmap.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="form-label fw-bold">Full Name</label>
            <input
              type="text"
              className="form-control bg-light"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="row g-3 mb-4">
            {/* Education */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Education Level</label>
              <select
                className="form-select bg-light"
                value={education}
                onChange={(e) => handleEducationChange(e.target.value)}
                required
              >
                {EDUCATION_LEVELS.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
            </div>

            {/* Current Year */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Current Year</label>
              <select
                className="form-select bg-light"
                value={currentYear}
                onChange={(e) => setCurrentYear(e.target.value)}
                required
              >
                {(ACADEMIC_YEARS_BY_EDUCATION[education] || ACADEMIC_YEARS).map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* College Name */}
          <div className="mb-4">
            <label className="form-label fw-bold">College / University</label>
            <input
              type="text"
              className="form-control bg-light"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Enter your college or university name"
              required
            />
          </div>

          <div className="row g-3 mb-4">
            {/* Current Skills */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Current Skills</label>
              <input
                type="text"
                className="form-control bg-light"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Python, HTML/CSS, Basics of SQL"
              />
            </div>

            {/* Interests */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Interests & Hobbies</label>
              <input
                type="text"
                className="form-control bg-light"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. Web Dev, Machine Learning, Gaming"
              />
            </div>
          </div>

          <div className="row g-3 mb-4">
            {/* Study Hours */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Daily Study Hours</label>
              <input
                type="number"
                className="form-control bg-light"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                placeholder="e.g. 4"
                min="1"
                max="24"
                required
              />
            </div>

            {/* Target Company (Optional) */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Target Company (Optional)</label>
              <input
                type="text"
                className="form-control bg-light"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft, Amazon"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-bold shadow-sm rounded-pill mt-2"
            disabled={isSaving}
          >
            {isSaving ? "Saving & Generating..." : "Generate AI Roadmap 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
