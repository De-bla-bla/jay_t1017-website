import express from "express";
import pool from "../config/database.js";
import sgMail from "@sendgrid/mail";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// set up sendgrid
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
  console.log("SendGrid API ready");
} else {
  console.warn("No SendGrid API key — emails won't work");
  console.warn("Set SENDGRID_API_KEY in your env");
}

// check sendgrid config
router.get("/health", (req, res) => {
  const sendgridConfigured = {
    sendgridApiKey: !!process.env.SENDGRID_API_KEY,
    emailFrom: !!process.env.EMAIL_FROM,
  };

  const allConfigured = Object.values(sendgridConfigured).every((v) => v === true);

  res.json({
    status: allConfigured ? "Email system ok" : "Email system not ready",
    configuration: sendgridConfigured,
    missingVariables: Object.entries(sendgridConfigured)
      .filter(([_, value]) => !value)
      .map(([key]) => key),
    service: "SendGrid API",
  });
});

// user signs up for newsletter
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

    // send welcome email
    try {
      if (process.env.SENDGRID_API_KEY) {
        await sgMail.send({
          from: process.env.EMAIL_FROM || "noreply@jayt1017.com",
          to: email,
          subject: "Welcome to JayT1017 Newsletter!",
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
        console.log("welcome email sent:", email);
      }
    } catch (emailErr) {
      console.warn("email didn't send (no problem if sendgrid isn't set up):", emailErr.message);
      // Still return success if database insert worked
    }

    res.status(201).json({ message: "Subscription successful! Check your email." });
  } catch (err) {
    console.error("Newsletter subscription error:", err.message);
    res.status(500).json({ error: "Subscription failed: " + err.message });
  }
});

// get list of subscribers
router.get("/subscribers", requireAuth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC");
    console.log(`got ${result.rows.length} subscribers`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.json([]); // Return empty array if table doesn't exist
  }
});

// admin sends email to all subscribers
router.post("/send-to-all", requireAuth, async (req, res) => {
  try {
    const { subject, htmlContent } = req.body;

    if (!subject || !htmlContent) {
      return res.status(400).json({ error: "Subject and content are required" });
    }

    if (!process.env.SENDGRID_API_KEY) {
      console.error("no sendgrid key");
      return res.status(503).json({ 
        error: "Email service not working",
        configured: false 
      });
    }

    // Get all subscribers
    const subscribersResult = await pool.query(
      "SELECT email FROM newsletter_subscribers ORDER BY email"
    );

    if (subscribersResult.rows.length === 0) {
      return res.status(400).json({ error: "No subscribers to send to" });
    }

    const emails = subscribersResult.rows.map((row) => row.email);

    // Send email to all subscribers using SendGrid
    try {
      console.log(`Attempting to send email to ${emails.length} subscribers...`);
      const fromEmail = process.env.EMAIL_FROM || "noreply@jayt1017.com";
      
      // Use send instead of sendMultiple for better compatibility
      const promises = emails.map((email) =>
        sgMail.send({
          from: fromEmail,
          to: email,
          subject: subject,
          html: htmlContent,
        })
      );

      await Promise.all(promises);

      console.log(`sent to ${emails.length} people`);
      res.json({
        message: `Email sent successfully to ${emails.length} subscribers`,
        subscriberCount: emails.length,
      });
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr.message);
      console.error("Error details:", emailErr);
      console.error("SendGrid API Key exists:", !!process.env.SENDGRID_API_KEY);
      res.status(500).json({ 
        error: "Failed to send email: " + emailErr.message,
        type: emailErr.code || "UNKNOWN_ERROR"
      });
    }
  } catch (err) {
    console.error("❌ Error in send-to-all:", err.message);
    res.status(500).json({ error: "Failed to send emails: " + err.message });
  }
});

// notify subscribers about new music
router.post("/notify-new-music", requireAuth, async (req, res) => {
  try {
    const { title, artist, url, platform } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    if (!process.env.SENDGRID_API_KEY) {
      console.error("no sendgrid key");
      return res.status(503).json({ 
        error: "email service not working",
        configured: false 
      });
    }

    // get subscriber list
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

    // send notification
    try {
      const fromEmail = process.env.EMAIL_FROM || "noreply@jayt1017.com";
      console.log(`notifying ${emails.length} people about the track...`);
      
      const promises = emails.map((email) =>
        sgMail.send({
          from: fromEmail,
          to: email,
          subject: `🎵 New Release: ${title}`,
          html: htmlContent,
        })
      );

      await Promise.all(promises);

      console.log(`notified everyone`);
      res.json({
        message: `Notification sent to ${emails.length} subscribers about "${title}"`,
        subscriberCount: emails.length,
      });
    } catch (emailErr) {
      console.error("❌ Music notification sending failed:", emailErr.message);
      console.error("Error details:", emailErr);
      res.status(500).json({ 
        error: "Failed to send notification: " + emailErr.message,
        type: emailErr.code || "UNKNOWN_ERROR"
      });
    }
  } catch (err) {
    console.error("❌ Error in notify-new-music:", err.message);
    res.status(500).json({ error: "Failed to send notification: " + err.message });
  }
});

// notify subscribers about new merch
router.post("/notify-new-merch", requireAuth, async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    if (!process.env.SENDGRID_API_KEY) {
      console.error("no sendgrid key");
      return res.status(503).json({ 
        error: "emails aren't working",
        configured: false 
      });
    }

    // get subscriber list
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

    // send it
    try {
      const fromEmail = process.env.EMAIL_FROM || "noreply@jayt1017.com";
      console.log(`telling ${emails.length} people about new merch...`);
      
      const promises = emails.map((email) =>
        sgMail.send({
          from: fromEmail,
          to: email,
          subject: `🛍️ New Drop: ${name}`,
          html: htmlContent,
        })
      );

      await Promise.all(promises);

      console.log(`everyone notified`);
      res.json({
        message: `Notification sent to ${emails.length} subscribers about "${name}"`,
        subscriberCount: emails.length,
      });
    } catch (emailErr) {
      console.error("❌ Merch notification sending failed:", emailErr.message);
      console.error("Error details:", emailErr);
      res.status(500).json({ 
        error: "Failed to send notification: " + emailErr.message,
        type: emailErr.code || "UNKNOWN_ERROR"
      });
    }
  } catch (err) {
    console.error("❌ Error in notify-new-merch:", err.message);
    res.status(500).json({ error: "Failed to send notification: " + err.message });
  }
});

export default router;
