import { updateUserProfile } from "./authService.js";

export async function generateRoadmapFromAI(studentDetails, career) {
  try {
    const res = await fetch("/api/generate-roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentDetails, career })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.roadmap;
    }
  } catch (err) {
    console.error("generateRoadmapFromAI error:", err);
  }
  return null;
}

export async function saveUserProgress(uid, completedTasks, totalSteps) {
  const percentage = totalSteps > 0 ? Math.round((completedTasks.length / totalSteps) * 100) : 0;
  await updateUserProfile(uid, {
    completedTasks,
    progress: percentage
  });
  return percentage;
}
