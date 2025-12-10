import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import merchRoutes from "./routes/merch.js";
import adminRoutes from "./routes/admin.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/merch", merchRoutes);
app.use("/api/admin", adminRoutes);

// Serve client static files when in production or when build exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, "..", "client", "dist");

// Serve client if built (client/dist) or when explicitly requested
if (process.env.NODE_ENV === "production" || process.env.SERVE_CLIENT === "true" || fs.existsSync(clientDist)) {
  // Intercept index.html requests to inject runtime config BEFORE express.static serves it
  app.get('/', (req, res) => {
    const indexPath = path.join(clientDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      try {
        let indexHtml = fs.readFileSync(indexPath, 'utf8');
        const runtimeConfig = {
          VITE_FILESTACK_API_KEY: process.env.VITE_FILESTACK_API_KEY || '',
          VITE_API_URL: process.env.VITE_API_URL || '',
        };
        const injectScript = `<script>window.__RUNTIME__=${JSON.stringify(runtimeConfig)};</script>`;
        indexHtml = indexHtml.replace('</head>', injectScript + '</head>');
        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.send(indexHtml);
      } catch (err) {
        console.error('Error injecting runtime config:', err);
        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.sendFile(indexPath);
      }
    }
    res.status(404).send('Not found');
  });

  // Serve other static files
  app.use(express.static(clientDist));

  // SPA fallback for non-API requests (handle client-side routes)
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api')) return next();
    const indexPath = path.join(clientDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      try {
        let indexHtml = fs.readFileSync(indexPath, 'utf8');
        const runtimeConfig = {
          VITE_FILESTACK_API_KEY: process.env.VITE_FILESTACK_API_KEY || '',
          VITE_API_URL: process.env.VITE_API_URL || '',
        };
        const injectScript = `<script>window.__RUNTIME__=${JSON.stringify(runtimeConfig)};</script>`;
        indexHtml = indexHtml.replace('</head>', injectScript + '</head>');
        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.send(indexHtml);
      } catch (err) {
        console.error('Error injecting runtime config:', err);
        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.sendFile(indexPath);
      }
    }
    return next();
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Server is running",
    runtimeConfig: {
      hasFilestackKey: !!process.env.VITE_FILESTACK_API_KEY,
      hasApiUrl: !!process.env.VITE_API_URL,
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
