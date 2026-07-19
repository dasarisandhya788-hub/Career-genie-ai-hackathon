import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { updateUserProfile, logoutUser } from "../services/authService.js";
import { formatDate } from "../utils/helpers.js";
import { EDUCATION_LEVELS, ACADEMIC_YEARS, ACADEMIC_YEARS_BY_EDUCATION } from "../utils/constants.js";
import { POPULAR_CAREERS } from "../data/careers.js";

export default function Profile() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [education, setEducation] = useState("B.Tech");
  const [currentYear, setCurrentYear] = useState("3rd Year");
  const [college, setCollege] = useState("");
  const [dreamCareer, setDreamCareer] = useState("Software Engineer");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [studyHours, setStudyHours] = useState("4");
  const [targetCompany, setTargetCompany] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      const edu = userProfile.education || "B.Tech";
      setEducation(edu);
      
      const validYears = ACADEMIC_YEARS_BY_EDUCATION[edu] || ACADEMIC_YEARS;
      const yr = userProfile.currentYear || "3rd Year";
      if (validYears.includes(yr)) {
        setCurrentYear(yr);
      } else {
        setCurrentYear(validYears[0]);
      }
      setCollege(userProfile.college || "");
      setDreamCareer(userProfile.dreamCareer || userProfile.careerGoal || "Software Engineer");
      setSkills(userProfile.skills || "");
      setInterests(userProfile.interests || "");
      setStudyHours(userProfile.studyHours || "4");
      setTargetCompany(userProfile.targetCompany || "");
    }
  }, [userProfile]);

  const handleEducationChange = (newEdu) => {
    setEducation(newEdu);
    const validYears = ACADEMIC_YEARS_BY_EDUCATION[newEdu] || ACADEMIC_YEARS;
    if (!validYears.includes(currentYear)) {
      setCurrentYear(validYears[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      if (currentUser) {
        await updateUserProfile(currentUser.uid, {
          name,
          education,
          currentYear,
          college,
          dreamCareer,
          careerGoal: dreamCareer,
          skills,
          interests,
          studyHours,
          targetCompany
        });
        await refreshProfile(currentUser.uid);
      }
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const joinDate = formatDate(userProfile?.createdAt);
  const progress = userProfile?.progress || 0;

  return (
    <div className="container mt-5 py-3">
      <div className="row g-4 justify-content-center">
        <div className="col-md-9 col-lg-8">
          <div className="card shadow-lg border-0 p-5 bg-white" style={{ borderRadius: "24px" }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                  style={{ width: "75px", height: "75px", fontSize: "2rem", fontWeight: "bold" }}
                >
                  {name ? name.charAt(0).toUpperCase() : "S"}
                </div>
                <div>
                  <h3 className="fw-bold mb-1">{name || "Student Profile"}</h3>
                  <p className="text-muted mb-0">{currentUser?.email}</p>
                  <small className="text-secondary">Member since: {joinDate}</small>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-4 fw-bold">
                <i className="bi bi-box-arrow-right me-2"></i>Logout
              </button>
            </div>

            {/* Saved Progress Overview */}
            <div className="alert alert-primary bg-primary bg-opacity-10 border-0 p-4 mb-4 rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-dark">Selected Career: <strong>{dreamCareer}</strong></span>
                <span className="badge bg-success fs-6 rounded-pill">{progress}% Complete</span>
              </div>
              <div className="progress" style={{ height: "15px", borderRadius: "10px" }}>
                <div className="progress-bar bg-success" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {message && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
              </div>
            )}

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError("")}></button>
              </div>
            )}

            <form onSubmit={handleSave}>
              <h4 className="fw-bold text-primary mb-4">Edit Student Profile</h4>

              <div className="row g-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Full Name</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Selected Career</label>
                  <select
                    className="form-select bg-light"
                    value={dreamCareer}
                    onChange={(e) => setDreamCareer(e.target.value)}
                  >
                    {POPULAR_CAREERS.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Education Level</label>
                  <select
                    className="form-select bg-light"
                    value={education}
                    onChange={(e) => handleEducationChange(e.target.value)}
                  >
                    {EDUCATION_LEVELS.map((edu) => <option key={edu} value={edu}>{edu}</option>)}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Current Year</label>
                  <select
                    className="form-select bg-light"
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                  >
                    {(ACADEMIC_YEARS_BY_EDUCATION[education] || ACADEMIC_YEARS).map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">College / University</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Study Hours Per Day</label>
                  <input
                    type="number"
                    className="form-control bg-light"
                    value={studyHours}
                    onChange={(e) => setStudyHours(e.target.value)}
                    min="1"
                    max="24"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Current Skills</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Target Company</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end mt-3">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
