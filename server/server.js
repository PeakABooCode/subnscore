// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import pgSession from "connect-pg-simple";
import passport from "passport";
import pool from "./config/db.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import coachingRoutes from "./routes/coachingRoutes.js";
import committeeRoutes from "./routes/committeeRoutes.js";
import { isOfficial } from "./config/middleware/roleMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// --- GLOBAL RATE LIMITING ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests from this IP, please try again later." },
});

// Security headers — sets X-Frame-Options, X-Content-Type-Options, HSTS, CSP, etc.
app.use(helmet({ contentSecurityPolicy: false })); // CSP disabled: Vite SPA needs inline scripts

// 1mb cap — prevents multi-GB JSON payloads that would exhaust server memory
app.use(express.json({ limit: "1mb" }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  process.env.CLIENT_URL,
  process.env.CLIENT_URL?.replace(/\/$/, ""),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no origin) and exact-match origins only.
      // The old *.onrender.com wildcard allowed any Render app to call our API.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  }),
);

app.use(globalLimiter);

// --- SESSION CONFIGURATION ---
const PgSession = pgSession(session);
app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days — was 30, reduces stolen-session window
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // blocks CSRF from cross-site form submissions
    },
  }),
);

// --- PASSPORT INIT ---
app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/coaching", coachingRoutes);
app.use("/api/committee", isOfficial, committeeRoutes);
 
// --- PRODUCTION STATIC ASSETS ---
const clientBuildPath = path.join(__dirname, "../client/dist");

console.log(`Folder for static assets: ${clientBuildPath}`);

app.use(express.static(clientBuildPath));

app.get("*all", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res
        .status(500)
        .send("The frontend build is missing. Check your Render build logs.");
    }
  });
});

// --- GLOBAL ERROR HANDLER ---
// Logs full stack server-side; sends generic message to client to avoid leaking internals.
app.use((err, req, res, next) => {
  console.error("❌ Global Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
