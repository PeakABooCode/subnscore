/**
 * This is the "Brain" of the game storage. It handles the heavy lifting of saving teams, players, and that complex action history.
 */

import pool from "../config/db.js";

export const saveGameSession = async (req, res) => {
  // UPDATED: Destructured finalScoreUs and finalScoreThem from the body
  const {
    teamMeta,
    roster,
    playerStats,
    actionHistory,
    timeouts,
    finalScoreUs,
    finalScoreThem,
  } = req.body;

  const coachId = req.user.id;

  try {
    // We use a Transaction to ensure all-or-nothing saving
    await pool.query("BEGIN");

    // 1. Upsert the Team (Updates name if ID exists, or creates new)
    const teamResult = await pool.query(
      `INSERT INTO teams (coach_id, name, league, season) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [coachId, teamMeta.teamName, teamMeta.league, teamMeta.season],
    );
    const teamId = teamResult.rows[0].id;

    // 2. Insert the Game record
    // UPDATED: Added final_score_us and final_score_them columns and placeholders ($3, $4)
    const gameResult = await pool.query(
      `INSERT INTO games (team_id, opponent_name, final_score_us, final_score_them) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [teamId, teamMeta.opponent, finalScoreUs || 0, finalScoreThem || 0],
    );
    const gameId = gameResult.rows[0].id;

    // 3. Map Players and save Stats
    const playerMap = {}; // Maps frontend IDs to Database UUIDs

    for (const player of roster) {
      const pResult = await pool.query(
        `INSERT INTO players (team_id, name, jersey_number) 
         VALUES ($1, $2, $3) RETURNING id`,
        [teamId, player.name, player.jersey],
      );
      const dbPlayerId = pResult.rows[0].id;
      playerMap[player.id] = dbPlayerId;

      const stats = playerStats[player.id] || {};
      await pool.query(
        `INSERT INTO game_stats (game_id, player_id, points, fouls, turnovers) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          gameId,
          dbPlayerId,
          stats.score || 0,
          stats.fouls || 0,
          stats.turnovers || 0,
        ],
      );
    }

    // 4. Save Action Logs (History)
    for (const log of actionHistory) {
      await pool.query(
        `INSERT INTO action_logs (game_id, player_id, action_type, amount, quarter, time_remaining) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          gameId,
          playerMap[log.playerId],
          log.type,
          log.amount || 0,
          log.quarter,
          log.clock,
        ],
      );
    }

    await pool.query("COMMIT");
    res.json({ message: "Game saved successfully!", gameId });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Database Save Error:", err);
    res.status(500).json({ error: "Failed to save game data." });
  }
};

// 1. Get all games for the logged-in coach
export const getGames = async (req, res) => {
  const coachId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT g.*, t.name as team_name 
       FROM games g 
       JOIN teams t ON g.team_id = t.id 
       WHERE t.coach_id = $1 
       ORDER BY g.game_date DESC`,
      [coachId],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch games history" });
  }
};

// 2. Get full details of a specific game to rebuild the report
export const getGameDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const gameMeta = await pool.query(`SELECT * FROM games WHERE id = $1`, [
      id,
    ]);
    const stats = await pool.query(
      `SELECT gs.*, p.name, p.jersey_number 
       FROM game_stats gs 
       JOIN players p ON gs.player_id = p.id 
       WHERE gs.game_id = $1`,
      [id],
    );
    const logs = await pool.query(
      `SELECT * FROM action_logs WHERE game_id = $1 ORDER BY id ASC`,
      [id],
    );

    res.json({
      game: gameMeta.rows[0],
      stats: stats.rows,
      logs: logs.rows,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load game details" });
  }
};
