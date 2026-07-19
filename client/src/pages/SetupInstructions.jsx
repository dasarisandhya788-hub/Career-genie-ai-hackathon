import React from "react";

export default function SetupInstructions() {
  const envTemplate = `# Career Genie AI Environment Configuration
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=career-compass-ai-5c7ab.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=career-compass-ai-5c7ab
VITE_FIREBASE_STORAGE_BUCKET=career-compass-ai-5c7ab.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=705666857860
VITE_FIREBASE_APP_ID=1:705666857860:web:0a4b14ec5552339f71b8db
VITE_FIREBASE_MEASUREMENT_ID=G-QLMJX3KDSN`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envTemplate);
    alert("Configuration template copied to clipboard!");
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-5 border-0" style={{ maxWidth: "680px", borderRadius: "24px" }}>
        <div className="text-center mb-4">
          <div className="display-1 text-warning mb-3">⚠️</div>
          <h2 className="fw-bold text-dark">Firebase Configuration Required</h2>
          <p className="text-muted">
            The application cannot connect to Firebase because key environment variables are missing or set to placeholder defaults.
          </p>
        </div>

        <div className="alert alert-info border-0 p-4 rounded-3 mb-4">
          <h5 className="fw-bold text-info-emphasis mb-2">How to Fix This:</h5>
          <ol className="mb-0 text-secondary-emphasis" style={{ paddingLeft: "1.2rem" }}>
            <li className="mb-2">
              Create a new file named <strong>.env</strong> inside the <strong>client</strong> folder.
            </li>
            <li className="mb-2">
              Copy the environment configuration block below and paste it into the <strong>.env</strong> file.
            </li>
            <li className="mb-2">
              Replace <code>YOUR_API_KEY_HERE</code> with your actual Firebase API Key.
            </li>
            <li>
              Restart your development server (run <code>npm run dev</code>) so Vite loads the new variables.
            </li>
          </ol>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center bg-dark text-light px-3 py-2 rounded-top border-bottom border-secondary">
            <span className="small font-monospace">client/.env</span>
            <button onClick={copyToClipboard} className="btn btn-outline-light btn-sm rounded-pill px-3 py-1">
              <i className="bi bi-clipboard me-1"></i> Copy Code
            </button>
          </div>
          <pre className="bg-dark text-info p-3 rounded-bottom font-monospace mb-0 overflow-auto" style={{ fontSize: "0.9rem", color: "#38bdf8 !important" }}>
            {envTemplate}
          </pre>
        </div>

        <div className="text-center">
          <p className="small text-muted mb-0">
            Need help? Check the <code>client/.env.example</code> file for more details.
          </p>
        </div>
      </div>
    </div>
  );
}
