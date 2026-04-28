//This controller handles the initialization of an "Official Game" by creating or finding both teams and setting up the dual-lineup structure.
import pool from "../../config/db.js";

/**
 * Initializes an official game scoresheet with two teams.
 */
export const initializeOfficialGame = async (req, res) => {
  const { teamAName, teamBName, teamARoster, teamBRoster, league, season } =
    req.body;
  const officialId = req.user.id;

  try {
    await pool.query("BEGIN");

    // 1. Helper to Upsert Team and Players
    const setupTeam = async (name, roster) => {
      // Find or create team (Owned by the committee/official for this specific game context)
      let teamRes = await pool.query(
        "SELECT id FROM teams WHERE coach_id = $1 AND name = $2",
        [officialId, name],
      );

      let teamId;
      if (teamRes.rows.length > 0) {
        teamId = teamRes.rows[0].id;
        // Update existing team meta if it has changed
        await pool.query(
          "UPDATE teams SET league = $1, season = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
          [league, season, teamId]
        );
      } else {
        const newTeam = await pool.query(
          "INSERT INTO teams (coach_id, name, league, season) VALUES ($1, $2, $3, $4) RETURNING id",
          [officialId, name, league, season],
        );
        teamId = newTeam.rows[0].id;
      }

      // Sync Players
      const playerIds = [];
      for (const p of roster) {
        const pRes = await pool.query(
          "INSERT INTO players (team_id, name, jersey_number) VALUES ($1, $2, $3) " +
            "ON CONFLICT (team_id, jersey_number) DO UPDATE SET name = EXCLUDED.name RETURNING id",
          [teamId, p.name, p.jersey],
        );
        playerIds.push(pRes.rows[0].id);
      }
      return { teamId, playerIds };
    };

    const teamAData = await setupTeam(teamAName, teamARoster);
    const teamBData = await setupTeam(teamBName, teamBRoster);

    // Prepare initial lineup snapshots (Starters for Team A and Team B)
    const initialLineups = {
      teamA: teamARoster.slice(0, 5).map(p => p.id),
      teamB: teamBRoster.slice(0, 5).map(p => p.id)
    };

    // 2. Create the Game Record
    // Note: We are using team_id as Team A and opponent_name as Team B's name for compatibility,
    // but we can store Team B's ID in a new column later if needed.
    const gameRes = await pool.query(
      `INSERT INTO games (team_id, opponent_name, game_mode, league, season, official_id, lineups_by_quarter) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [teamAData.teamId, teamBName, "FULL", league, season, officialId, JSON.stringify(initialLineups)],
    );

    const gameId = gameRes.rows[0].id;

    await pool.query("COMMIT");

    res.json({
      message: "Official Game Initialized",
      gameId,
      teamAId: teamAData.teamId,
      teamBId: teamBData.teamId,
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Official Setup Error:", err);
    res
      .status(500)
      .json({ error: "Failed to initialize official scoresheet." });
  }
};

export const getOfficialGames = async (req, res) => {
  // Logic to fetch games managed by this official
  res.json({ message: "Official games list logic not implemented yet" });
};
