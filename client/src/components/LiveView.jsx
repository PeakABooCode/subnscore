import React from "react";

export default function LiveView({
  court,
  roster,
  playerStats,
  clock,
  isRunning,
  setIsRunning,
  quarter,
  advanceQuarter,
  subOut,
  subIn,
  addStat,
  teamFouls,
  setTimeouts,
  timeouts,
  undoLastAction,
  actionHistory,
  teamMeta,
}) {
  // NEW: Calculate total team score from all individual player stats
  const teamTotalScore = Object.values(playerStats).reduce(
    (acc, curr) => acc + (curr.score || 0),
    0,
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ========================================= */}
      {/* 1. NEW SCOREBOARD HEADER                  */}
      {/* ========================================= */}
      <div className="bg-slate-900 rounded-xl p-4 flex justify-between items-center text-white shadow-lg border-b-4 border-amber-500">
        <div className="text-center flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {teamMeta?.teamName || "HOME"}
          </p>
          <p className="text-4xl font-black">{teamTotalScore}</p>
        </div>
        <div className="px-6 text-xl font-bold text-amber-500 italic">VS</div>
        <div className="text-center flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {teamMeta?.opponent || "AWAY"}
          </p>
          <p className="text-4xl font-black text-slate-500">--</p>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. MAIN GAME INTERFACE (3-COL GRID)       */}
      {/* ========================================= */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
        {/* LEFT & MIDDLE: COURT AND BENCH */}
        <div className="md:col-span-2 space-y-6">
          {/* ON COURT PLAYERS */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-3 text-white font-bold flex justify-between items-center">
              <span>ON COURT</span>
              <span className="text-xs font-normal opacity-70">
                Click stats to record
              </span>
            </div>
            <div className="p-4 space-y-3">
              {court.map((id) => {
                const p = roster.find((r) => r.id === id);
                const stats = playerStats[id] || { score: 0, fouls: 0 };

                return (
                  <div
                    key={id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-50 border rounded-lg hover:border-blue-300 transition-colors gap-3"
                  >
                    {/* PLAYER INFO SECTION */}
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-800 truncate">
                        #{p.jersey} {p.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Pts: {stats.score} | Fls: {stats.fouls}
                      </span>
                    </div>

                    {/* BUTTONS SECTION: This wraps on mobile */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                      {/* SCORING BUTTONS */}
                      <div className="flex bg-white rounded shadow-sm border p-1 gap-1">
                        <button
                          onClick={() => addStat(id, "score", 1)}
                          className="w-8 h-8 flex items-center justify-center bg-amber-50 text-amber-700 rounded font-bold text-xs hover:bg-amber-100"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => addStat(id, "score", 2)}
                          className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-700 rounded font-bold text-xs hover:bg-blue-100"
                        >
                          +2
                        </button>
                        <button
                          onClick={() => addStat(id, "score", 3)}
                          className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-700 rounded font-bold text-xs hover:bg-emerald-100"
                        >
                          +3
                        </button>
                      </div>

                      {/* FOUL BUTTON */}
                      <button
                        onClick={() => addStat(id, "fouls", 1)}
                        className="h-10 px-2 bg-red-50 text-red-600 border border-red-100 rounded flex flex-col items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <span className="text-[10px] font-bold leading-none">
                          FOUL
                        </span>
                        <span className="font-bold">{stats.fouls}</span>
                      </button>

                      {/* SUB OUT BUTTON */}
                      <button
                        onClick={() => subOut(id)}
                        className="px-3 h-10 bg-slate-200 hover:bg-slate-300 rounded text-[10px] font-black text-slate-600 transition-colors"
                      >
                        OUT
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BENCH PLAYERS */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 p-3 text-slate-600 font-bold text-sm uppercase tracking-wide">
              Bench (Click to sub in)
            </div>
            <div className="p-4 flex flex-wrap gap-3">
              {roster
                .filter((r) => !court.includes(r.id))
                .map((p) => {
                  const stats = playerStats[p.id] || { score: 0, fouls: 0 };
                  return (
                    <button
                      key={p.id}
                      onClick={() => subIn(p.id)}
                      className="bg-white border-2 border-slate-100 px-4 py-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm flex flex-col items-start min-w-[120px]"
                    >
                      <span className="font-bold text-slate-700">
                        #{p.jersey} {p.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                        Pts: {stats.score} | Fls: {stats.fouls}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: CLOCK AND TEAM STATS */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-center text-white shadow-xl border-b-4 border-blue-600">
            <div className="text-xs font-bold opacity-50 uppercase tracking-widest">
              Quarter {quarter}
            </div>

            {/* THE VISUAL PAUSE CLOCK */}
            <div
              className={`text-6xl font-mono font-bold my-4 tabular-nums transition-colors duration-300 ${
                !isRunning && clock > 0 && clock < 600
                  ? "text-red-500 animate-pulse"
                  : "text-white"
              }`}
            >
              {Math.floor(clock / 60)
                .toString()
                .padStart(2, "0")}
              :{(clock % 60).toString().padStart(2, "0")}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 py-3 rounded-xl font-black text-lg shadow-inner transition-all ${
                  isRunning
                    ? "bg-amber-500 text-slate-900"
                    : "bg-emerald-500 text-white"
                }`}
              >
                {isRunning ? "PAUSE CLOCK" : "START CLOCK"}
              </button>

              <button
                onClick={advanceQuarter}
                className="bg-slate-700 hover:bg-slate-600 px-4 rounded-xl transition-colors"
              >
                ⏩
              </button>
            </div>
          </div>

          {/* TEAM STATS BOX */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">
                Team Fouls (Q{quarter})
              </span>
              <span
                className={`text-2xl font-black ${
                  teamFouls[quarter] >= 5
                    ? "text-red-600 animate-pulse"
                    : "text-slate-800"
                }`}
              >
                {teamFouls[quarter] || 0}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() =>
                  setTimeouts([...timeouts, { quarter, time: clock }])
                }
                className="w-full border-2 border-slate-100 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Use Timeout (
                {timeouts.filter((t) => t.quarter === quarter).length})
              </button>

              {/* UNDO BUTTON */}
              <button
                onClick={undoLastAction}
                disabled={actionHistory.length === 0}
                className={`w-full py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  actionHistory.length === 0
                    ? "bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100"
                    : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                }`}
              >
                ↺ Undo Last Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
