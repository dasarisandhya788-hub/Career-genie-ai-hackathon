import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CareerSelection from "./pages/CareerSelection.jsx";
import StudentDetails from "./pages/StudentDetails.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Profile from "./pages/Profile.jsx";
import SavedRoadmaps from "./pages/SavedRoadmaps.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function PublicOnlyRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <LandingPage />
          </PublicOnlyRoute>
        }
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
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
            <CareerSelection />
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
      <Route
        path="/saved-roadmaps"
        element={
          <ProtectedRoute>
            <SavedRoadmaps />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
