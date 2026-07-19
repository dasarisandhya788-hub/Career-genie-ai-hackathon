import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
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
              <Link to="/login" className="btn btn-lg btn-primary shadow-sm px-5 py-3 rounded-pill fw-bold">
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
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop"; }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
