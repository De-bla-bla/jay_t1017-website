import express from "express";
import pool from "../config/database.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const router = express.Router();

// Admin credentials from env or hardcoded
const ADMIN_USERNAME = process.env.ADMIN_USER || "JayT1017";
const ADMIN_PASSWORD = process.env.ADMIN_PASS || "Ametepe1920@";

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = signToken({ admin: true, username }, { expiresIn: '24h' });
      res.json({
        success: true,
        token,
        message: "Login successful",
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get dashboard stats (requires auth)
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const merchCount = await pool.query("SELECT COUNT(*) FROM merch");
    const ordersCount = await pool.query("SELECT COUNT(*) FROM orders");
    const totalRevenue = await pool.query("SELECT SUM(total) as revenue FROM orders WHERE status = 'completed'");
    const visitors = await pool.query("SELECT COUNT(*) as count FROM page_visits");

    res.json({
      totalOrders: parseInt(ordersCount.rows[0].count) || 0,
      totalRevenue: parseFloat(totalRevenue.rows[0].revenue) || 0,
      merchItems: parseInt(merchCount.rows[0].count) || 0,
      visitors: parseInt(visitors.rows[0].count) || 0,
    });
  } catch (err) {
    console.error(err);
    // Return mock data if tables don't exist yet
    res.json({
      totalOrders: 0,
      totalRevenue: 0,
      merchItems: 4,
      visitors: 0,
    });
  }
});

// Get all orders (requires auth)
router.get("/orders", requireAuth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 20");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.json([]); // Return empty array if table doesn't exist
  }
});

// Create order (requires auth)
router.post("/orders", requireAuth, async (req, res) => {
  try {
    const { customerName, customerPhone, items, total, notes } = req.body;
    const result = await pool.query(
      "INSERT INTO orders (customer_name, customer_phone, items, total, notes, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [customerName, customerPhone, JSON.stringify(items), total, notes, "pending"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get admin profile (requires auth)
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM admin_profile LIMIT 1");
    if (result.rows.length === 0) {
      // No profile found yet
      return res.json({
        id: 1,
        artistName: "JayT1017",
        bio: "Emo Rap Artist from Ghana",
        profileImage: "",
        socialLinks: {
          instagram: "https://instagram.com/jay_t1017",
          tiktok: "https://tiktok.com/@jay_t1017",
          twitter: "https://twitter.com/jayt1017x",
          facebook: "https://facebook.com/JayT1017",
          snapchat: "https://snapchat.com/add/jay_t2021395",
          appleMusic: "https://music.apple.com",
        },
      });
    }
    // Convert snake_case to camelCase for client
    const profile = result.rows[0];
    res.json({
      id: profile.id,
      artistName: profile.artist_name,
      bio: profile.bio,
      profileImage: profile.profile_image,
      socialLinks: profile.social_links || {},
    });
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update admin profile (requires auth)
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { artistName, bio, profileImage, socialLinks } = req.body;
    
    // Check if profile exists
    const checkResult = await pool.query("SELECT id FROM admin_profile WHERE id = 1");
    
    let result;
    if (checkResult.rows.length === 0) {
      // Insert if doesn't exist
      result = await pool.query(
        "INSERT INTO admin_profile (id, artist_name, bio, profile_image, social_links) VALUES (1, $1, $2, $3, $4) RETURNING *",
        [artistName, bio, profileImage, JSON.stringify(socialLinks || {})]
      );
    } else {
      // Update if exists
      result = await pool.query(
        "UPDATE admin_profile SET artist_name = $1, bio = $2, profile_image = $3, social_links = $4, updated_at = CURRENT_TIMESTAMP WHERE id = 1 RETURNING *",
        [artistName, bio, profileImage, JSON.stringify(socialLinks || {})]
      );
    }
    
    // Convert snake_case to camelCase
    const profile = result.rows[0];
    res.json({
      id: profile.id,
      artistName: profile.artist_name,
      bio: profile.bio,
      profileImage: profile.profile_image,
      socialLinks: profile.social_links || {},
    });
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ error: "Failed to update profile: " + err.message });
  }
});

export default router;
