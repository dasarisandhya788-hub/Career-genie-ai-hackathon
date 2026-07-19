import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AppRoutes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import "./styles/global.css";

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="app-container d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <AppRoutes />
            </main>
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}
