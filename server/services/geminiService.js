import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-flash-latest";

export async function askAI(question) {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: question }]
      }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`Gemini API Error (status ${response.status}):`, errText);
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
    return data.candidates[0].content.parts[0].text;
  }
  
  throw new Error("Invalid response format from Gemini API");
}

function safeParseJSON(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    try {
      const sanitized = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, (match) => {
        if (match === "\n") return "\\n";
        if (match === "\r") return "\\r";
        if (match === "\t") return "\\t";
        return "";
      });
      return JSON.parse(sanitized);
    } catch (e2) {
      console.error("Failed to parse JSON from Gemini response. Raw text:\n", text);
      throw e2;
    }
  }
}

export async function generateCustomRoadmap(studentDetails, career) {
  if (!API_KEY) {
    return null;
  }

  const prompt = `
Generate a comprehensive, personalized career roadmap for a student aiming to become a "${career}".
Student Details:
- Full Name: ${studentDetails.name || "Student"}
- Education Level: ${studentDetails.education || "Undergraduate"}
- Current Year: ${studentDetails.currentYear || "N/A"}
- College: ${studentDetails.college || "N/A"}
- Current Skills: ${studentDetails.skills || "Beginner"}
- Interests: ${studentDetails.interests || "General"}
- Daily Study Hours: ${studentDetails.studyHours || 4} hours/day
- Target Company: ${studentDetails.targetCompany || "Top Tech Companies"}

Respond ONLY with valid JSON with the following key structure:
{
  "overview": "Detailed introduction and career summary",
  "timeline": "Estimated timeframe to reach job readiness",
  "semesterLearning": ["Phase 1 / Semester 1 step", "Phase 2 step"],
  "skills": ["Skill 1", "Skill 2"],
  "technologies": ["Tech 1", "Tech 2"],
  "certifications": ["Cert 1", "Cert 2"],
  "interviewPrep": ["Preparation tip 1", "Preparation tip 2"],
  "resumeTips": ["Resume advice 1", "Resume advice 2"],
  "softSkills": ["Soft skill 1", "Soft skill 2"],
  "jobRoles": ["Role 1", "Role 2"],
  "salaryInsights": "Expected salary range"
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini API Error (status ${response.status}):`, errText);
      return null;
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const text = data.candidates[0].content.parts[0].text;
      return safeParseJSON(text);
    }
    return null;
  } catch (err) {
    console.error("Error generating roadmap from Gemini AI:", err);
    return null;
  }
}
