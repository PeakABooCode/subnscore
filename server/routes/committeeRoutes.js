import express from "express";
import {
  initializeOfficialGame,
  getOfficialGames,
} from "../controllers/committee/officialController.js";

// This router will handle all official scoresheet and committee-level logic.
const router = express.Router();

// Placeholder route to verify the module is working
router.get("/status", (req, res) => {
  res.json({
    message: "Committee Scoresheet API is online",
    role: req.user?.role,
  });
});

router.post("/games/init", initializeOfficialGame); // This is committeeQuarter
router.get("/games", getOfficialGames);

export default router;
