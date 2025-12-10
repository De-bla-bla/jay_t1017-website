import express from "express";
import pool from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all music tracks
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM music ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
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
    const { title, artist, url, platform, description } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    // Try database first
    try {
      const result = await pool.query(
        "INSERT INTO music (title, artist, url, platform, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [title, artist || "", url, platform || "spotify", description || ""]
      );
      return res.status(201).json(result.rows[0]);
    } catch (dbErr) {
      // Create table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS music (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          artist VARCHAR(255),
          url TEXT NOT NULL,
          platform VARCHAR(50),
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      // Try insert again
      const result = await pool.query(
        "INSERT INTO music (title, artist, url, platform, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [title, artist || "", url, platform || "spotify", description || ""]
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create track: " + err.message });
  }
});

// Update music track (requires auth)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, url, platform, description } = req.body;

    const result = await pool.query(
      "UPDATE music SET title = $1, artist = $2, url = $3, platform = $4, description = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      [title, artist || "", url, platform || "spotify", description || "", id]
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
