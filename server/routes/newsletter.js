import express from "express";
import pool from "../config/database.js";
import nodemailer from "nodemailer";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Configure email transporter using SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || "your-app-password",
  },
  logger: true,
  debug: true,
});

// Test SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("⚠️ SMTP Email Configuration Error:", error.message);
    console.error("Make sure these environment variables are set:");
    console.error("  - SMTP_HOST");
    console.error("  - SMTP_PORT");
    console.error("  - SMTP_USER");
    console.error("  - SMTP_PASS");
    console.error("  - EMAIL_FROM or EMAIL_USER");
  } else {
    console.log("✓ SMTP Email service configured and ready");
  }
});

// Health check - verify SMTP configuration
router.get("/health", (req, res) => {
  const smtpConfigured = {
    smtpHost: !!process.env.SMTP_HOST,
    smtpPort: !!process.env.SMTP_PORT,
    smtpUser: !!process.env.SMTP_USER,
    smtpPass: !!process.env.SMTP_PASS,
    emailFrom: !!process.env.EMAIL_FROM,
    emailUser: !!process.env.EMAIL_USER,
  };

  const allConfigured = Object.values(smtpConfigured).every((v) => v === true);

  res.json({
    status: allConfigured ? "✓ Email system configured" : "⚠️ Email system NOT fully configured",
    configuration: smtpConfigured,
    missingVariables: Object.entries(smtpConfigured)
      .filter(([_, value]) => !value)
      .map(([key]) => key),
  });
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
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@jayt1017.com",
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
router.get("/subscribers", requireAuth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC");
    console.log(`✓ Retrieved ${result.rows.length} newsletter subscribers`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.json([]); // Return empty array if table doesn't exist
  }
});

// Send email to all subscribers (for admin)
router.post("/send-to-all", requireAuth, async (req, res) => {
  try {
    const { subject, htmlContent } = req.body;

    if (!subject || !htmlContent) {
      return res.status(400).json({ error: "Subject and content are required" });
    }

    // Get all subscribers
    const subscribersResult = await pool.query(
      "SELECT email FROM newsletter_subscribers ORDER BY email"
    );

    if (subscribersResult.rows.length === 0) {
      return res.status(400).json({ error: "No subscribers to send to" });
    }

    const emails = subscribersResult.rows.map((row) => row.email);

    // Send email to all subscribers (using BCC for privacy)
    try {
      console.log(`Attempting to send email to ${emails.length} subscribers...`);
      const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@jayt1017.com";
      
      await transporter.sendMail({
        from: fromEmail,
        to: fromEmail, // Send to admin, BCC subscribers for privacy
        bcc: emails,
        subject: subject,
        html: htmlContent,
      });

      console.log(`✓ Email sent to ${emails.length} subscribers`);
      res.json({
        message: `Email sent successfully to ${emails.length} subscribers`,
        subscriberCount: emails.length,
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      console.error("SMTP Host:", process.env.SMTP_HOST);
      console.error("SMTP Port:", process.env.SMTP_PORT);
      console.error("SMTP User configured:", !!process.env.SMTP_USER);
      res.status(500).json({ 
        error: "Failed to send email: " + emailErr.message,
        debug: process.env.NODE_ENV === "development" ? emailErr : undefined
      });
    }
  } catch (err) {
    console.error("Error in send-to-all:", err.message);
    res.status(500).json({ error: "Failed to send emails: " + err.message });
  }
});

// Auto-notify subscribers about new music
router.post("/notify-new-music", requireAuth, async (req, res) => {
  try {
    const { title, artist, url, platform } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    // Get all subscribers
    const subscribersResult = await pool.query(
      "SELECT email FROM newsletter_subscribers ORDER BY email"
    );

    if (subscribersResult.rows.length === 0) {
      return res.status(400).json({ error: "No subscribers to notify" });
    }

    const emails = subscribersResult.rows.map((row) => row.email);

    const htmlContent = `
      <h2>🎵 New Music Release!</h2>
      <p>Hey there!</p>
      <p><strong>${artist || "JayT1017"}</strong> just released <strong>"${title}"</strong>!</p>
      <p>Check it out on ${platform || "your favorite platform"}:</p>
      <p><a href="${url}" target="_blank" style="padding: 12px 24px; background-color: #a855f7; color: white; text-decoration: none; border-radius: 6px; display: inline-block;">Listen Now</a></p>
      <hr>
      <p>Don't miss out on future releases - follow JayT1017 on all platforms:</p>
      <ul>
        <li><a href="https://instagram.com/jay_t1017">Instagram</a></li>
        <li><a href="https://tiktok.com/@jay_t1017">TikTok</a></li>
        <li><a href="https://twitter.com/jayt1017x">Twitter</a></li>
      </ul>
      <p>🔥 Stay tuned for more!</p>
    `;

    // Send notification email (using BCC for privacy)
    try {
      const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@jayt1017.com";
      console.log(`Sending music notification to ${emails.length} subscribers...`);
      
      await transporter.sendMail({
        from: fromEmail,
        to: fromEmail, // Send to admin, BCC subscribers for privacy
        bcc: emails,
        subject: `🎵 New Release: ${title}`,
        html: htmlContent,
      });

      console.log(`✓ Music notification sent to ${emails.length} subscribers`);
      res.json({
        message: `Notification sent to ${emails.length} subscribers about "${title}"`,
        subscriberCount: emails.length,
      });
    } catch (emailErr) {
      console.error("Music notification sending failed:", emailErr);
      res.status(500).json({ 
        error: "Failed to send notification: " + emailErr.message,
        debug: process.env.NODE_ENV === "development" ? emailErr : undefined
      });
    }
  } catch (err) {
    console.error("Error in notify-new-music:", err.message);
    res.status(500).json({ error: "Failed to send notification: " + err.message });
  }
});

// Auto-notify subscribers about new merchandise
router.post("/notify-new-merch", requireAuth, async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    // Get all subscribers
    const subscribersResult = await pool.query(
      "SELECT email FROM newsletter_subscribers ORDER BY email"
    );

    if (subscribersResult.rows.length === 0) {
      return res.status(400).json({ error: "No subscribers to notify" });
    }

    const emails = subscribersResult.rows.map((row) => row.email);

    const imageHtml = image ? `<p><img src="${image}" alt="${name}" style="max-width: 300px; border-radius: 8px; margin: 20px 0;"></p>` : "";

    const htmlContent = `
      <h2>🛍️ New Merchandise Drop!</h2>
      <p>Hey there!</p>
      <p>JayT1017 just released new ${category || "merchandise"}!</p>
      <h3>${name}</h3>
      <p><strong>Price: $${price}</strong></p>
      ${imageHtml}
      <p><a href="https://jayt1017-website-production.up.railway.app#merch" target="_blank" style="padding: 12px 24px; background-color: #ec4899; color: white; text-decoration: none; border-radius: 6px; display: inline-block;">Shop Now</a></p>
      <hr>
      <p>Limited stock available - don't miss out!</p>
      <p>🔥 Get yours before they're gone!</p>
    `;

    // Send notification email (using BCC for privacy)
    try {
      const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@jayt1017.com";
      console.log(`Sending merch notification to ${emails.length} subscribers...`);
      
      await transporter.sendMail({
        from: fromEmail,
        to: fromEmail, // Send to admin, BCC subscribers for privacy
        bcc: emails,
        subject: `🛍️ New Drop: ${name}`,
        html: htmlContent,
      });

      console.log(`✓ Merch notification sent to ${emails.length} subscribers`);
      res.json({
        message: `Notification sent to ${emails.length} subscribers about "${name}"`,
        subscriberCount: emails.length,
      });
    } catch (emailErr) {
      console.error("Merch notification sending failed:", emailErr);
      res.status(500).json({ 
        error: "Failed to send notification: " + emailErr.message,
        debug: process.env.NODE_ENV === "development" ? emailErr : undefined
      });
    }
  } catch (err) {
    console.error("Error in notify-new-merch:", err.message);
    res.status(500).json({ error: "Failed to send notification: " + err.message });
  }
});

export default router;
