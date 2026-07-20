import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestoreService";

export default function Profile() {
  const { currentUser, userProfile, refreshProfile } = useAuth();

  // Form State
  const [name, setName] = useState("");
  const [education, setEducation] = useState("Select");
  const [dreamCareer, setDreamCareer] = useState("Software Engineer");
  const [studyHours, setStudyHours] = useState("");
  const [careersList, setCareersList] = useState([]);

  // Load careers database
  useEffect(() => {
    fetch("/data/careers.json")
      .then((res) => res.json())
      .then((data) => {
        setCareersList(data);
      })
      .catch((err) => {
        console.error("Error loading careers database in Profile:", err);
      });
  }, []);

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Sync state with user profile details
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setEducation(userProfile.education || "Select");
      setDreamCareer(userProfile.dreamCareer || userProfile.careerGoal || "Software Engineer");
      setStudyHours(userProfile.studyHours || "");
    }
  }, [userProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (education === "Select") {
      setError("Please select your education level.");
      return;
    }

    if (!studyHours) {
      setError("Please specify study hours.");
      return;
    }

    setIsSaving(true);
    try {
      const isExploring = dreamCareer === "Not sure yet";
      await updateUserProfile(currentUser.uid, {
        name,
        education,
        dreamCareer: dreamCareer,
        careerGoal: dreamCareer, // for backwards compatibility
        careerStatus: isExploring ? "exploring" : "decided",
        studyHours
      });
      await refreshProfile(currentUser.uid);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const joinDate = userProfile?.createdAt
    ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="container mt-5">
      <div className="row g-4 justify-content-center">
        <div className="col-md-8">
          <div className="card shadow border-0 p-5 bg-white" style={{ borderRadius: "24px" }}>
            <div className="d-flex align-items-center gap-4 mb-4 pb-3 border-bottom">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "80px", height: "80px", fontSize: "2.2rem", fontWeight: "bold" }}
              >
                {name ? name.charAt(0).toUpperCase() : "S"}
              </div>
              <div>
                <h2 className="fw-bold mb-1">{name || "Student Profile"}</h2>
                <p className="text-muted mb-0">{currentUser?.email}</p>
                <small className="text-secondary">Member since: {joinDate}</small>
              </div>
            </div>

            {message && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage("")} aria-label="Close"></button>
              </div>
            )}

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close"></button>
              </div>
            )}

            <form onSubmit={handleSave}>
              <h4 className="fw-bold text-primary mb-4">Edit Profile details</h4>

              <div className="row g-3">
                {/* Full Name */}
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

                {/* Education */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Education Level</label>
                  <select
                    className="form-select bg-light"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    required
                  >
                    <option value="Select">Select</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="Degree">Degree</option>
                  </select>
                </div>

                {/* Dream Career */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Dream Career</label>
                  <select
                    className="form-select bg-light"
                    value={dreamCareer}
                    onChange={(e) => setDreamCareer(e.target.value)}
                    required
                  >
                    {careersList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>

                {/* Study Hours */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold">Study Hours Per Day</label>
                  <input
                    type="number"
                    className="form-control bg-light"
                    value={studyHours}
                    onChange={(e) => setStudyHours(e.target.value)}
                    min="1"
                    max="24"
                    required
                  />
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end mt-2">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
