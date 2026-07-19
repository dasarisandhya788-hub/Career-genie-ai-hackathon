import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StudentDetails from "./pages/StudentDetails";
import Roadmap from "./pages/Roadmap";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SetupInstructions from "./pages/SetupInstructions";
import SelectCareer from "./pages/SelectCareer";
import DiscoverCareer from "./pages/DiscoverCareer";
import StudentProfile from "./pages/StudentProfile";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { isConfigMissing } from "./firebase/config";

function App() {
  if (isConfigMissing) {
    return <SetupInstructions />;
  }

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Landing Page */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/about"
            element={<Navigate to="/" replace />}
          />

          {/* Authentication Routes */}
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Auth defaultTab="login" />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Auth defaultTab="register" />
              </PublicRoute>
            }
          />

          {/* Authenticated Flow Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/select-career"
            element={
              <ProtectedRoute>
                <SelectCareer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Auxiliary Career Discovery pages (Preserved) */}
          <Route
            path="/student-profile"
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover-career"
            element={
              <ProtectedRoute>
                <DiscoverCareer />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
