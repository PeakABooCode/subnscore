import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Users, ChevronRight, Trophy } from "lucide-react";

export default function HistoryView({ onViewGame }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get("/api/games");
        setGames(res.data);
      } catch (err) {
        console.error("Error fetching games", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading)
    return <div className="text-center p-10 font-bold">Loading History...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
        <Calendar className="text-blue-600" /> Game History
      </h2>

      {games.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <p className="text-slate-400 font-bold">
            No games saved yet. Go win some!
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => onViewGame(g.id)}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:border-blue-500 transition-all group"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="bg-slate-100 p-3 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <Trophy
                    size={20}
                    className="text-slate-400 group-hover:text-blue-600"
                  />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase text-sm">
                    vs {g.opponent_name}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    {new Date(g.game_date).toLocaleDateString()} • {g.team_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">
                    {g.final_score_us} - {g.final_score_them}
                  </span>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
