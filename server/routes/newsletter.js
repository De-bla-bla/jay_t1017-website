import express from "express";
import pool from "../config/database.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

// Subscribe to newsletter
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Check if email already exists
    try {
      const checkResult = await pool.query("SELECT id FROM newsletter_subscribers WHERE email = $1", [email]);
      if (checkResult.rows.length > 0) {
        return res.status(400).json({ error: "Email already subscribed" });
      }
    } catch (dbErr) {
      console.log("Newsletter table might not exist yet, creating...");
    }

    // Insert email into database
    try {
      await pool.query(
        "INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES ($1, CURRENT_TIMESTAMP)",
        [email]
      );
    } catch (dbErr) {
      // Create table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      // Try insert again
      await pool.query(
        "INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES ($1, CURRENT_TIMESTAMP)",
        [email]
      );
    }

    // Send confirmation email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || "noreply@jayt1017.com",
        to: email,
        subject: "Welcome to JayT1017 Newsletter! 🎵",
        html: `
          <h2>Welcome to JayT1017 Newsletter!</h2>
          <p>Hey there! 👋</p>
          <p>Thanks for subscribing to get the latest news about JayT1017's music, merch drops, and exclusive content.</p>
          <p>You'll be the first to know when new tracks drop, exclusive merchandise releases, and special announcements!</p>
          <hr>
          <p><strong>Follow JayT1017:</strong></p>
          <ul>
            <li><a href="https://instagram.com/jay_t1017">Instagram</a></li>
            <li><a href="https://tiktok.com/@jay_t1017">TikTok</a></li>
            <li><a href="https://twitter.com/jayt1017x">Twitter</a></li>
          </ul>
          <p>Stay tuned! 🔥</p>
          <p><strong>- JayT1017</strong></p>
        `,
      });
    } catch (emailErr) {
      console.warn("Email sending failed (this is okay if email is not configured):", emailErr.message);
      // Still return success if database insert worked
    }

    res.status(201).json({ message: "Subscription successful! Check your email." });
  } catch (err) {
    console.error("Newsletter subscription error:", err.message);
    res.status(500).json({ error: "Subscription failed: " + err.message });
  }
});

// Get all subscribers (for admin)
router.get("/subscribers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.json([]); // Return empty array if table doesn't exist
  }
});

export default router;
