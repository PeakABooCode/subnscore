// server/routes/gameRoutes.js
import express from "express";
import {
  saveGameSession,
  getGames,
  getGameDetails,
  deleteGame,
} from "../controllers/gameController.js";

const router = express.Router();

// --- MIDDLEWARE: Check if user is logged in ---
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized. Please log in." });
};

// --- ROUTES ---
router.post("/save", isAuth, saveGameSession);
router.get("/", isAuth, getGames);
router.get("/:id", isAuth, getGameDetails);
router.delete("/:id", isAuth, deleteGame);

export default router;
