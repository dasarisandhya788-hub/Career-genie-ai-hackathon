export async function fetchCareers() {
  try {
    const res = await fetch("/data/careers.json");
    if (!res.ok) throw new Error("Failed to fetch careers");
    return await res.json();
  } catch (e) {
    console.error("fetchCareers error:", e);
    return [];
  }
}

export async function askAiMentor(question) {
  const res = await fetch(
    "https://career-genie-ai-hackathon-production.up.railway.app/api/ask-ai",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    }
  );

  if (!res.ok) {
    throw new Error("AI Mentor service unavailable");
  }

  return await res.json();
}