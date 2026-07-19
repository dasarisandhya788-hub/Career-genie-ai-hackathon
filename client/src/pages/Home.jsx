import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero bg-white border-bottom py-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-3">
                🧞‍♂️ Welcome to CareerGeenieAI
              </span>
              <h1 className="display-4 fw-bold mb-3">
                Your Personalized <br />
                <span className="text-primary">Career Roadmap</span>
              </h1>
              <p className="lead text-muted mb-4">
                Confused after Intermediate, B.Tech, or Graduation? CareerGeenieAI helps
                you discover the right career, build core skills, and
                follow an AI-powered personalized roadmap to achieve your dream job.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/auth" className="btn btn-lg btn-primary shadow-sm px-5 py-3 rounded-pill fw-bold">
                  Get Started <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="/images/career-girl.png"
                className="img-fluid rounded shadow-sm"
                alt="Career Journey"
                style={{ maxWidth: "85%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* App Description & Overview */}
      <section className="py-5 bg-light border-bottom">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-9">
              <h2 className="fw-bold mb-3">Empowering Students to Reach Their Full Potential</h2>
              <p className="lead text-muted">
                CareerGeenieAI bridges the gap between academic education and industry expectations. 
                Whether you are exploring top technology paths, government service exams, or creative roles, 
                our platform curates step-by-step guidance, free courses, practice platforms, and project ideas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Platform Features</h2>
            <p className="text-muted lead">
              Intelligent tools designed to accelerate your career success.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-4 h-100 bg-light rounded-4">
                <div className="fs-1 text-primary mb-3">🧭</div>
                <h5 className="fw-bold mb-2">Smart Career Selector</h5>
                <p className="text-muted small mb-0">
                  Choose from 13+ in-demand career dreams tailored to tech, design, business, and public service.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-4 h-100 bg-light rounded-4">
                <div className="fs-1 text-info mb-3">🤖</div>
                <h5 className="fw-bold mb-2">Gemini AI Engine</h5>
                <p className="text-muted small mb-0">
                  Generate semester-wise custom roadmaps, timeline insights, resume tips, and instant AI mentorship Q&A.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-4 h-100 bg-light rounded-4">
                <div className="fs-1 text-success mb-3">📚</div>
                <h5 className="fw-bold mb-2">Curated Learning Resources</h5>
                <p className="text-muted small mb-0">
                  Hand-picked free courses, YouTube playlists, official documentation, and top practice platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose CareerGeenieAI */}
      <section className="container my-5 py-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose CareerGeenieAI?</h2>
          <p className="text-muted lead">
            Everything a student needs to plan and achieve their dream career.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 text-center p-4 h-100">
              <div className="fs-1 mb-3">🎯</div>
              <h5 className="fw-bold">Personalized Roadmaps</h5>
              <p className="text-muted mb-0">Create step-by-step learning paths based on your current education and goals.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0 text-center p-4 h-100">
              <div className="fs-1 mb-3">🧞‍♂️</div>
              <h5 className="fw-bold">AI Career Mentor</h5>
              <p className="text-muted mb-0">Ask questions anytime and get intelligent career guidance instant responses.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0 text-center p-4 h-100">
              <div className="fs-1 mb-3">💻</div>
              <h5 className="fw-bold">Practical Platforms</h5>
              <p className="text-muted mb-0">Direct links to LeetCode, HackerRank, CodeChef, Kaggle, and open-source projects.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0 text-center p-4 h-100">
              <div className="fs-1 mb-3">📈</div>
              <h5 className="fw-bold">Track Progress</h5>
              <p className="text-muted mb-0">Check off completed steps, view progress analytics, and save your journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How It Works</h2>
            <p className="text-muted lead">Get started in 4 simple steps</p>
          </div>

          <div className="row g-4 justify-content-center text-center">
            <div className="col-md-3">
              <div className="p-3">
                <div className="badge bg-primary rounded-circle mb-3 fs-4 d-inline-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>1</div>
                <h5 className="fw-bold">Register / Login</h5>
                <p className="text-muted small">Create your free account to save roadmaps & track progress.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3">
                <div className="badge bg-primary rounded-circle mb-3 fs-4 d-inline-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>2</div>
                <h5 className="fw-bold">Choose Career Dream</h5>
                <p className="text-muted small">Select your target career path or explore guided options.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3">
                <div className="badge bg-primary rounded-circle mb-3 fs-4 d-inline-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>3</div>
                <h5 className="fw-bold">Enter Student Details</h5>
                <p className="text-muted small">Provide your education, college, current year, and target goals.</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3">
                <div className="badge bg-primary rounded-circle mb-3 fs-4 d-inline-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>4</div>
                <h5 className="fw-bold">Generate AI Roadmap</h5>
                <p className="text-muted small">Access curated learning resources, projects & save progress.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/auth" className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-sm">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container text-center">
          <div className="mb-2">
            <span className="fw-bold fs-5 text-primary">CareerGeenieAI</span>
          </div>
          <p className="text-white-50 small mb-0">
            © {new Date().getFullYear()} CareerGeenieAI. Empowering students with personalized AI career roadmaps.
          </p>
        </div>
      </footer>
    </div>
  );
}
