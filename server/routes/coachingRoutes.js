import express from "express";
import {
  saveGameSession,
  getGames,
  getGameDetails,
  deleteGame,
} from "../controllers/coaching/gameController.js";
import {
  saveRoster,
  getTeamRoster,
  getCoachTeams,
} from "../controllers/coaching/teamController.js";

const router = express.Router();

// --- MIDDLEWARE: Check if user is logged in ---
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized. Please log in." });
};

// --- COACHING MODULE ROUTES ---
router.post("/games/save", isAuth, saveGameSession); // This is coachingQuarter
router.get("/games", isAuth, getGames);
router.get("/games/:id", isAuth, getGameDetails);
router.delete("/games/:id", isAuth, deleteGame);
router.get("/teams", isAuth, getCoachTeams);
router.post("/teams/roster", isAuth, saveRoster);
router.get("/teams/roster/:name", isAuth, getTeamRoster);

export default router;
