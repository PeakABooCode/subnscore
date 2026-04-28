// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import pgSession from "connect-pg-simple";
import passport from "passport";
import pool from "./config/db.js";
import rateLimit from "express-rate-limit";
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

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const clientUrl = process.env.CLIENT_URL;
      const isAllowed =
        !origin ||
        origin === "http://localhost:5173" ||
        origin === "http://localhost:5000" ||
        origin === clientUrl ||
        origin === clientUrl?.replace(/\/$/, "") ||
        origin.endsWith(".onrender.com");

      if (isAllowed) {
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
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
// This prevents the server from crashing on unhandled errors and provides better debugging info
app.use((err, req, res, next) => {
  console.error("❌ Global Server Error:", err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
