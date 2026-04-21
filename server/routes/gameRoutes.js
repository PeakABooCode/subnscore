import express from "express";
import { saveGameSession } from "../controllers/gameController.js";

const router = express.Router();

// Middleware: Ensure user is logged in before they can save anything
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized. Please log in." });
};

router.post("/save", ensureAuth, saveGameSession);

export default router;
