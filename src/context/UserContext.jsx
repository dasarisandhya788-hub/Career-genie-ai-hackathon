import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [selectedCareer, setSelectedCareer] = useState(localStorage.getItem("career") || "");
  const [studentDetails, setStudentDetails] = useState({
    name: localStorage.getItem("name") || "",
    education: localStorage.getItem("education") || "",
    currentYear: localStorage.getItem("currentYear") || "",
    college: localStorage.getItem("college") || "",
    skills: localStorage.getItem("skills") || "",
    interests: localStorage.getItem("interests") || "",
    studyHours: localStorage.getItem("studyHours") || "",
    targetCompany: localStorage.getItem("targetCompany") || ""
  });

  const value = {
    selectedCareer,
    setSelectedCareer,
    studentDetails,
    setStudentDetails
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
