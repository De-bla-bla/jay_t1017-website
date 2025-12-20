import express from "express";
import pool from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all music tracks
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM music ORDER BY created_at DESC");
    console.log("got", result.rows.length, "tracks");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching music:", err.message);
    res.json([]); // Return empty array if table doesn't exist
  }
});

// Get single music track
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM music WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Track not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch track" });
  }
});

// Add new music track (requires auth)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, artist, url, platform, description, coverImage } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    // Try database first
    try {
      const result = await pool.query(
        "INSERT INTO music (title, artist, url, platform, description, cover_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [title, artist || "", url, platform || "spotify", description || "", coverImage || ""]
      );
      console.log("track saved:", result.rows[0]);
      return res.status(201).json(result.rows[0]);
    } catch (dbErr) {
      console.error("Database insert failed, creating table:", dbErr.message);
      // Create table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS music (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          artist VARCHAR(255),
          url TEXT NOT NULL,
          platform VARCHAR(50),
          description TEXT,
          cover_image TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("music table created");
      
      // Try insert again
      const result = await pool.query(
        "INSERT INTO music (title, artist, url, platform, description, cover_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [title, artist || "", url, platform || "spotify", description || "", coverImage || ""]
      );
      console.log("track saved:", result.rows[0]);
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error("Error in POST /api/music:", err);
    res.status(500).json({ error: "Failed to create track: " + err.message });
  }
});

// Update music track (requires auth)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, url, platform, description, coverImage } = req.body;

    const result = await pool.query(
      "UPDATE music SET title = $1, artist = $2, url = $3, platform = $4, description = $5, cover_image = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *",
      [title, artist || "", url, platform || "spotify", description || "", coverImage || "", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update track: " + err.message });
  }
});

// Delete music track (requires auth)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM music WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.json({ message: "Track deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete track: " + err.message });
  }
});

export default router;
