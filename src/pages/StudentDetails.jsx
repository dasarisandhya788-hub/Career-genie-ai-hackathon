import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { updateUserProfile } from "../services/authService.js";
import { EDUCATION_LEVELS, ACADEMIC_YEARS, ACADEMIC_YEARS_BY_EDUCATION } from "../utils/constants.js";
import { POPULAR_CAREERS } from "../data/careers.js";

export default function StudentDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const { selectedCareer: ctxSelectedCareer, setSelectedCareer, setStudentDetails } = useUser();

  // Basic Details States
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("B.Tech");
  const [fieldOfStudy, setFieldOfStudy] = useState("Engineering & Technology");
  const [currentYear, setCurrentYear] = useState("3rd Year");
  const [college, setCollege] = useState("");
  
  // Career Choice State
  const [knowsCareer, setKnowsCareer] = useState(true);
  const [career, setCareer] = useState("Software Engineer");

  // Rich Attributes States
  const [skills, setSkills] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedStrengths, setSelectedStrengths] = useState([]);
  const [selectedWorkPref, setSelectedWorkPref] = useState([]);
  const [hobbies, setHobbies] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [studyHours, setStudyHours] = useState("4");
  const [targetCompany, setTargetCompany] = useState("");

  // AI Analysis View Mode: "form" | "analyzing" | "suggestions"
  const [viewMode, setViewMode] = useState("form");
  const [analyzingText, setAnalyzingText] = useState("Connecting to AI Genie Engine...");
  const [aiSelectedCareer, setAiSelectedCareer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const fieldsOfStudy = [
    "Engineering & Technology",
    "Medicine & Healthcare",
    "Business, Management & Finance",
    "Creative Arts, Design & Media",
    "Law, Public Policy & Civil Services",
    "Government, Civil Services & Defence",
    "Sciences, Mathematics & Environment",
    "General / Not Decided Yet"
  ];

  const interestsList = [
    { id: "Coding", label: "Coding & Software", icon: "bi-code-slash", color: "primary" },
    { id: "AI", label: "AI & Machine Learning", icon: "bi-cpu", color: "info" },
    { id: "Data", label: "Data Science & Stats", icon: "bi-graph-up-arrow", color: "success" },
    { id: "Healthcare", label: "Healthcare & Medicine", icon: "bi-hospital", color: "danger" },
    { id: "Finance", label: "Finance & Money", icon: "bi-currency-dollar", color: "success" },
    { id: "Design", label: "UX/UI & Creative Design", icon: "bi-palette", color: "warning" },
    { id: "Writing", label: "Writing & Journalism", icon: "bi-pencil-square", color: "primary" },
    { id: "Law", label: "Law & Public Policy", icon: "bi-bank", color: "dark" },
    { id: "Research", label: "Scientific Research", icon: "bi-journal-text", color: "secondary" },
    { id: "Security", label: "Cybersecurity & Defence", icon: "bi-shield-lock", color: "danger" },
    { id: "Business", label: "Business & Startups", icon: "bi-briefcase", color: "warning" },
    { id: "Cloud", label: "Cloud Systems & DevOps", icon: "bi-cloud", color: "info" },
    { id: "Helping People", label: "Helping People", icon: "bi-heart", color: "danger" }
  ];

  const strengthsList = [
    { id: "Problem Solving", label: "Analytical Problem Solving", icon: "bi-lightbulb", color: "primary" },
    { id: "Mathematics", label: "Logical & Math Reasoning", icon: "bi-calculator", color: "info" },
    { id: "Creativity", label: "Artistic & Visual Creativity", icon: "bi-brush", color: "warning" },
    { id: "Communication", label: "Public Speaking & Writing", icon: "bi-chat-dots", color: "success" },
    { id: "Leadership", label: "Team Leadership", icon: "bi-people", color: "danger" },
    { id: "Detail Orientation", label: "Attention to Detail", icon: "bi-zoom-in", color: "dark" },
    { id: "Technical Aptitude", label: "Technical Aptitude", icon: "bi-tools", color: "primary" },
    { id: "Empathy", label: "Empathy & Patient Care", icon: "bi-emoji-smile", color: "danger" }
  ];

  const workPrefList = [
    { id: "Computers", label: "Working with Computers & Code" },
    { id: "Hospitals", label: "Working in Healthcare & Patient Care" },
    { id: "Finance", label: "Managing Investments & Financial Audits" },
    { id: "Creative", label: "Designing Visuals, Media & Experiences" },
    { id: "Leadership", label: "Managing Teams & Business Strategy" },
    { id: "Research", label: "Conducting Scientific Lab Research" },
    { id: "Public", label: "Public Service, Law & Governance" },
    { id: "Field", label: "Outdoor Fieldwork & Tactical Defence" }
  ];

  useEffect(() => {
    setName(userProfile?.name || localStorage.getItem("name") || "");
    if (userProfile?.age) setAge(userProfile.age);
    const edu = userProfile?.education || localStorage.getItem("education") || "B.Tech";
    setEducation(edu);
    if (userProfile?.fieldOfStudy) setFieldOfStudy(userProfile.fieldOfStudy);
    
    const validYears = ACADEMIC_YEARS_BY_EDUCATION[edu] || ACADEMIC_YEARS;
    const yr = userProfile?.currentYear || localStorage.getItem("currentYear") || "3rd Year";
    if (validYears.includes(yr)) {
      setCurrentYear(yr);
    } else {
      setCurrentYear(validYears[0]);
    }
    setCollege(userProfile?.college || localStorage.getItem("college") || "");
    setSkills(userProfile?.skills || localStorage.getItem("skills") || "");
    if (userProfile?.interests && Array.isArray(userProfile.interests)) {
      setSelectedInterests(userProfile.interests);
    }
    if (userProfile?.strengths && Array.isArray(userProfile.strengths)) {
      setSelectedStrengths(userProfile.strengths);
    }
    setHobbies(userProfile?.hobbies || localStorage.getItem("hobbies") || "");
    setAdditionalInfo(userProfile?.additionalInfo || "");
    setStudyHours(userProfile?.studyHours || localStorage.getItem("studyHours") || "4");
    setTargetCompany(userProfile?.targetCompany || localStorage.getItem("targetCompany") || "");

    const notSureQuery = searchParams.get("notSure");
    const activeCareer = ctxSelectedCareer || userProfile?.dreamCareer || localStorage.getItem("career") || "";
    
    if (notSureQuery === "true" || activeCareer === "Not sure yet" || userProfile?.careerStatus === "exploring") {
      setKnowsCareer(false);
      setCareer("Not sure yet");
    } else if (activeCareer) {
      setCareer(activeCareer);
      setKnowsCareer(true);
    }
  }, [userProfile, ctxSelectedCareer, searchParams]);

  const handleEducationChange = (newEdu) => {
    setEducation(newEdu);
    const validYears = ACADEMIC_YEARS_BY_EDUCATION[newEdu] || ACADEMIC_YEARS;
    if (!validYears.includes(currentYear)) {
      setCurrentYear(validYears[0]);
    }
  };

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

  // AI Matching Recommendation Algorithm
  const getAIRecommendations = () => {
    const validCareers = POPULAR_CAREERS.filter((c) => c.id !== "Not sure yet");

    const scored = validCareers.map((c) => {
      let score = 0;
      let reasons = [];

      if (fieldOfStudy && c.category === fieldOfStudy) {
        score += 30;
        reasons.push(`Direct alignment with ${c.category}`);
      }

      let textToSearch = `${skills} ${hobbies} ${additionalInfo}`.toLowerCase();
      let matchedInterests = selectedInterests.filter((i) => textToSearch.includes(i.toLowerCase()) || c.title.toLowerCase().includes(i.toLowerCase()) || c.desc.toLowerCase().includes(i.toLowerCase()));
      if (matchedInterests.length > 0) {
        score += matchedInterests.length * 15;
        reasons.push(`Matches interests in ${matchedInterests.join(", ")}`);
      }

      if (selectedStrengths.length > 0) {
        score += selectedStrengths.length * 10;
        reasons.push(`Capitalizes on core strengths: ${selectedStrengths.join(", ")}`);
      }

      if (selectedWorkPref.length > 0) {
        score += 15;
        reasons.push("Fits your ideal day-to-day work environment preference");
      }

      let matchPercent = Math.min(Math.max(Math.round((score / 85) * 100) + 65, 75), 98);

      if (reasons.length === 0) {
        reasons.push(`High demand career option suitable for ${education}`);
      }

      return {
        ...c,
        matchPercent,
        aiReason: `AI Rationale: ${reasons.join(". ")}.`
      };
    });

    scored.sort((a, b) => b.matchPercent - a.matchPercent);
    return scored.slice(0, 6);
  };

  const handleRunAIAnalysis = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your Full Name.");
      return;
    }

    setViewMode("analyzing");
    const steps = [
      "Connecting to AI Genie Analysis Engine...",
      "Evaluating academic stream, interests & core strengths...",
      "Cross-referencing 35+ global career fields...",
      "Calculating personalized match scores & AI explanations..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setAnalyzingText(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setViewMode("suggestions");
      }
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      alert("Please enter your Full Name.");
      return;
    }

    if (!knowsCareer || career === "Not sure yet") {
      handleRunAIAnalysis(e);
      return;
    }

    if (!studyHours) {
      alert("Please enter daily Study Hours.");
      return;
    }

    setIsSaving(true);

    const detailsObj = {
      name,
      age,
      education,
      fieldOfStudy,
      currentYear,
      college,
      skills,
      interests: selectedInterests,
      strengths: selectedStrengths,
      workPreferences: selectedWorkPref,
      hobbies,
      additionalInfo,
      studyHours,
      targetCompany
    };

    localStorage.setItem("name", name);
    localStorage.setItem("education", education);
    localStorage.setItem("career", career);
    localStorage.setItem("studyHours", studyHours);
    setStudentDetails(detailsObj);
    setSelectedCareer(career);

    if (currentUser) {
      try {
        await updateUserProfile(currentUser.uid, {
          name,
          age: Number(age) || null,
          education,
          fieldOfStudy,
          currentYear,
          college,
          skills,
          interests: selectedInterests,
          strengths: selectedStrengths,
          workPreferences: selectedWorkPref,
          hobbies,
          additionalInfo,
          studyHours,
          targetCompany,
          dreamCareer: career,
          careerGoal: career,
          careerStatus: "decided"
        });
        await refreshProfile(currentUser.uid);
      } catch (err) {
        console.error("Error updating profile details:", err);
      }
    }

    setIsSaving(false);
    navigate("/roadmap");
  };

  const handleLockInAICareer = async () => {
    if (!aiSelectedCareer) {
      alert("Please select one recommended career path from the list.");
      return;
    }

    setIsSaving(true);
    localStorage.setItem("career", aiSelectedCareer);
    setSelectedCareer(aiSelectedCareer);

    if (currentUser) {
      try {
        await updateUserProfile(currentUser.uid, {
          name,
          age: Number(age) || null,
          education,
          fieldOfStudy,
          college,
          skills,
          interests: selectedInterests,
          strengths: selectedStrengths,
          workPreferences: selectedWorkPref,
          hobbies,
          additionalInfo,
          studyHours,
          dreamCareer: aiSelectedCareer,
          careerGoal: aiSelectedCareer,
          careerStatus: "decided"
        });
        await refreshProfile(currentUser.uid);
      } catch (err) {
        console.error("Error saving AI career selection:", err);
      }
    }

    setIsSaving(false);
    navigate("/roadmap");
  };

  const recommendations = getAIRecommendations();

  return (
    <div className="container mt-5 py-3">
      <div className="card shadow-lg p-4 p-md-5 mx-auto border-0 bg-white" style={{ maxWidth: "850px", borderRadius: "24px" }}>
        
        {/* VIEW 1: STUDENT DETAILS FORM */}
        {viewMode === "form" && (
          <>
            <div className="text-center mb-4">
              <span className="fs-1">🎓</span>
              <h2 className="fw-bold text-primary mt-2">Complete Your Student Profile</h2>
              <p className="text-muted small" style={{ fontSize: "1rem" }}>
                Provide your education, interests, strengths & hobbies so AI Genie can recommend your dream career or generate your custom roadmap.
              </p>
            </div>

            {/* Not Sure Yet Callout Banner */}
            <div className="p-4 mb-4 rounded-4 bg-primary bg-opacity-10 border border-primary d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
              <div>
                <strong className="text-primary fs-6 d-block">Not sure what your dream career is? 🧭</strong>
                <span className="text-muted small">Fill out your interests, strengths & hobbies below and let AI Genie analyze and recommend matching dream careers!</span>
              </div>
              <button
                type="button"
                onClick={() => setKnowsCareer(false)}
                className="btn btn-primary rounded-pill px-4 py-2 fw-bold flex-shrink-0 shadow-sm"
              >
                Not Sure Yet (Use AI Genie 🧞‍♂️)
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Section 1: Basic Info */}
              <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">1. Personal & Academic Details</h5>
              
              <div className="row g-3 mb-4">
                <div className="col-md-7">
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
                <div className="col-md-5">
                  <label className="form-label fw-bold">Age</label>
                  <input
                    type="number"
                    className="form-control form-control-lg bg-light"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 20"
                    min="5"
                    max="100"
                  />
                </div>
              </div>

              {/* Education Level & Field of Study */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Education Level</label>
                  <select
                    className="form-select form-select-lg bg-light"
                    value={education}
                    onChange={(e) => handleEducationChange(e.target.value)}
                    required
                  >
                    {EDUCATION_LEVELS.map((edu) => (
                      <option key={edu} value={edu}>{edu}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Field of Study / Stream</label>
                  <select
                    className="form-select form-select-lg bg-light"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                  >
                    {fieldsOfStudy.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* College & Current Year */}
              <div className="row g-3 mb-4">
                <div className="col-md-7">
                  <label className="form-label fw-bold">College / Institution</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Enter your college or school name"
                  />
                </div>
                <div className="col-md-5">
                  <label className="form-label fw-bold">Current Academic Year</label>
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
              </div>

              {/* Section 2: Career Knowledge Radio Option */}
              <h5 className="fw-bold text-dark mb-3 border-bottom pb-2 mt-4">2. Dream Career Preference</h5>

              <div className="mb-4 p-3 bg-light rounded-4 border">
                <label className="form-label fw-bold d-block mb-2">
                  Do you already know your dream career goal?
                </label>
                <div className="d-flex flex-wrap gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="careerChoice"
                      id="knowsYes"
                      checked={knowsCareer === true}
                      onChange={() => {
                        setKnowsCareer(true);
                        if (career === "Not sure yet") setCareer("Software Engineer");
                      }}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="knowsYes">
                      Yes, I know my dream career
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="careerChoice"
                      id="knowsNo"
                      checked={knowsCareer === false}
                      onChange={() => {
                        setKnowsCareer(false);
                        setCareer("Not sure yet");
                      }}
                    />
                    <label className="form-check-label fw-bold text-primary" htmlFor="knowsNo">
                      No, Not Sure Yet (Let AI Analyze Profile 🧞‍♂️)
                    </label>
                  </div>
                </div>
              </div>

              {/* If Yes: Select Dream Career Dropdown */}
              {knowsCareer && (
                <div className="mb-4 p-3 bg-white rounded-4 border border-2 border-primary">
                  <label className="form-label fw-bold text-primary">Select Dream Career</label>
                  <select
                    className="form-select form-select-lg bg-light"
                    value={career}
                    onChange={(e) => {
                      setCareer(e.target.value);
                      if (e.target.value === "Not sure yet") {
                        setKnowsCareer(false);
                      }
                    }}
                  >
                    <option value="Not sure yet">❓ Not sure yet (Help Me Decide with AI Genie 🧞‍♂️)</option>
                    {POPULAR_CAREERS.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Section 3: Interests, Strengths & Hobbies */}
              <h5 className="fw-bold text-dark mb-3 border-bottom pb-2 mt-4">3. Interests, Strengths & Passions</h5>

              {/* Interests Badges */}
              <div className="mb-4 p-3 bg-light bg-opacity-50 rounded-4 border">
                <label className="form-label fw-bold d-block mb-2">
                  <i className="bi bi-heart-fill text-danger me-2"></i>Select Primary Interests
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {interestsList.map((item) => {
                    const active = selectedInterests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleInterestToggle(item.id)}
                        className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${
                          active ? `btn-${item.color} text-white` : "btn-outline-secondary bg-white text-secondary"
                        }`}
                        style={{ fontSize: "0.9rem" }}
                      >
                        <i className={`bi ${item.icon} me-1`}></i>
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strengths Badges */}
              <div className="mb-4 p-3 bg-light bg-opacity-50 rounded-4 border">
                <label className="form-label fw-bold d-block mb-2">
                  <i className="bi bi-star-fill text-warning me-2"></i>Identify Core Strengths
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {strengthsList.map((item) => {
                    const active = selectedStrengths.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleStrengthToggle(item.id)}
                        className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${
                          active ? "btn-secondary text-white" : "btn-outline-secondary bg-white text-secondary"
                        }`}
                        style={{ fontSize: "0.9rem" }}
                      >
                        <i className={`bi ${item.icon} me-1`}></i>
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Work Preferences Badges */}
              <div className="mb-4 p-3 bg-light bg-opacity-50 rounded-4 border">
                <label className="form-label fw-bold d-block mb-2">
                  <i className="bi bi-building-gear text-primary me-2"></i>Work Environment Preferences
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {workPrefList.map((w) => {
                    const active = selectedWorkPref.includes(w.id);
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => handleWorkPrefToggle(w.id)}
                        className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${
                          active ? "btn-dark text-white" : "btn-outline-secondary bg-white text-secondary"
                        }`}
                        style={{ fontSize: "0.85rem" }}
                      >
                        {w.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills, Hobbies & Additional Info */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Current Skills</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Python, Public Speaking, Design"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Hobbies & Passions</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    placeholder="e.g. Gaming, drawing, chess, blogging..."
                  />
                </div>
              </div>

              {/* Study Hours & Target Company */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Daily Study Hours</label>
                  <input
                    type="number"
                    className="form-control bg-light"
                    value={studyHours}
                    onChange={(e) => setStudyHours(e.target.value)}
                    min="1"
                    max="24"
                    required={knowsCareer && career !== "Not sure yet"}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Target Company / Dream Role (Optional)</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft, ISRO, Apollo"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-3 fw-bold shadow-lg rounded-pill mt-3"
                style={{ fontSize: "1.1rem" }}
                disabled={isSaving}
              >
                {!knowsCareer || career === "Not sure yet" ? (
                  <>
                    Analyze Profile & Discover Dream Career <i className="bi bi-magic ms-1 fs-5"></i>
                  </>
                ) : (
                  <>
                    Generate AI Roadmap <i className="bi bi-rocket-takeoff ms-1 fs-5"></i>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* VIEW 2: AI ANALYZING PROGRESS */}
        {viewMode === "analyzing" && (
          <div className="text-center py-5">
            <div className="spinner-grow text-primary mb-4" style={{ width: "4rem", height: "4rem" }} role="status"></div>
            <h3 className="fw-bold text-dark mb-3">🧞‍♂️ Genie AI Analysis in Progress</h3>
            <p className="lead text-primary fw-semibold">{analyzingText}</p>
            <div className="progress mx-auto mt-4" style={{ maxWidth: "450px", height: "8px" }}>
              <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary w-100"></div>
            </div>
          </div>
        )}

        {/* VIEW 3: AI SUGGESTED DREAM CAREERS */}
        {viewMode === "suggestions" && (
          <div>
            <div className="text-center mb-4">
              <span className="fs-1">🎯</span>
              <h2 className="fw-bold text-primary mt-2">AI Recommended Dream Careers</h2>
              <p className="text-muted">
                Based on your profile details, here are the top career matches for you. Click one to lock in and generate your roadmap!
              </p>
            </div>

            <div className="row g-4 mb-5">
              {recommendations.map((rec) => {
                const isSelected = aiSelectedCareer === rec.title;
                return (
                  <div key={rec.id} className="col-md-6">
                    <div
                      onClick={() => setAiSelectedCareer(rec.title)}
                      className={`card h-100 border-2 cursor-pointer shadow-sm p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary bg-opacity-10 scale-102"
                          : "border-light bg-white hover-shadow"
                      }`}
                      style={{ cursor: "pointer", borderRadius: "20px" }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-primary"
                          style={{ width: "50px", height: "50px", fontSize: "1.5rem", backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                        >
                          <i className={`bi ${rec.icon}`}></i>
                        </div>
                        <span className="badge rounded-pill bg-primary px-3 py-2 fw-bold">
                          {rec.matchPercent}% Match
                        </span>
                      </div>
                      <h4 className="fw-bold fs-5 mb-1">{rec.title}</h4>
                      <p className="text-muted small mb-2">{rec.desc}</p>
                      
                      <div className="p-3 bg-light rounded-3 mb-2">
                        <small className="text-dark fw-semibold d-block">
                          <i className="bi bi-stars text-warning me-1"></i> {rec.aiReason}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between gap-3 pt-3 border-top">
              <button
                type="button"
                onClick={() => setViewMode("form")}
                className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
              >
                Edit Student Details
              </button>
              <button
                type="button"
                onClick={handleLockInAICareer}
                disabled={!aiSelectedCareer || isSaving}
                className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg"
              >
                {isSaving ? "Saving..." : "Lock In & Generate Roadmap 🚀"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
