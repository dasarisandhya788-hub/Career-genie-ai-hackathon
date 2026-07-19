require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-flash-latest";

app.post("/ask-ai", async (req, res) => {
    try {
        const question = req.body.question;
        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        if (!API_KEY) {
            return res.status(500).json({ error: "Gemini API key is not configured." });
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
            return res.status(response.status).json({ error: response.statusText });
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            return res.json({
                answer: data.candidates[0].content.parts[0].text
            });
        }

        res.status(500).json({ error: "Invalid response format from Gemini API" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/careers", (req, res) => {
    try {
        const filePath = path.join(__dirname, "data", "careers.json");
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf8");
            res.json(JSON.parse(data));
        } else {
            res.status(404).json({ error: "careers.json database not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("🚀 Server Running on http://localhost:3000");
});