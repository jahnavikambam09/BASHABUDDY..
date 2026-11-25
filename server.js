import express from "express";
import cors from "cors";
import { db, initDatabase } from "./db/database.js";
import { evaluatePronunciation } from "./services/scoring.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(".")); // Serves index.html, style.css, script.js directly!

// GET all bilingual vocabulary units
app.get("/api/vocabulary", (req, res) => {
  db.all("SELECT * FROM VocabularyUnits ORDER BY word_id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: rows.length, words: rows });
  });
});

// GET user profile & progress
app.get("/api/profile/:id", (req, res) => {
  const userId = Number(req.params.id) || 1;
  db.get("SELECT * FROM UserProfiles WHERE user_id = ?", [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "User profile not found" });
    res.json(row);
  });
});

// POST pronunciation evaluation & persist score in SQLite
app.post("/api/pronunciation/evaluate", (req, res) => {
  const { user_id = 1, spoken, target } = req.body || {};

  // Strict input validation
  if (typeof spoken !== "string" || typeof target !== "string" || !spoken.trim() || !target.trim()) {
    return res.status(400).json({ error: "Both 'spoken' and 'target' non-empty strings are required." });
  }
  if (spoken.length > 100 || target.length > 100) {
    return res.status(400).json({ error: "Input exceeds maximum allowed length of 100 characters." });
  }

  const result = evaluatePronunciation(spoken, target);

  db.run(
    "INSERT INTO PronunciationScores (user_id, word, spoken_text, accuracy_score) VALUES (?, ?, ?, ?)",
    [user_id, target.trim(), spoken.trim(), result.score],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (result.passed) {
        db.run(
          "UPDATE UserProfiles SET words_today = MIN(daily_goal, words_today + 1), total_points = total_points + 15 WHERE user_id = ?",
          [user_id]
        );
        db.run(
          "INSERT INTO ProgressLogs (user_id, action_type, points_earned) VALUES (?, 'PRONUNCIATION_PASS', 15)",
          [user_id]
        );
      }

      res.status(201).json({ score_id: this.lastID, ...result });
    }
  );
});

// POST reset demo state cleanly
app.post("/api/profile/:id/reset", (req, res) => {
  const userId = Number(req.params.id) || 1;
  db.run("UPDATE UserProfiles SET words_today = 2, total_points = 120 WHERE user_id = ?", [userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Demo progress reset to 2/5 words." });
  });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 BhashaBuddy Full-Stack Server + SQLite running at http://localhost:${PORT}`);
  });
});
