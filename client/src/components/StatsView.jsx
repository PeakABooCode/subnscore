import React, { useState } from "react";
import { formatTime } from "../utils/helpers";
import { ClipboardList, Users, Clock, Trash2, Target } from "lucide-react";

export default function StatsView({
  roster,
  playerStats,
  stints,
  clock,
  teamMeta,
  quarter, // We use this to know exactly how many quarters/OTs there are!
  resetGame,
  actionHistory = [],
}) {
  const [activeTab, setActiveTab] = useState("boxscore");

  // --- Calculations ---
  const teamTotalScore = Object.values(playerStats).reduce(
    (acc, curr) => acc + (curr.score || 0),
    0,
  );
  const teamTotalFouls = Object.values(playerStats).reduce(
    (acc, curr) => acc + (curr.fouls || 0),
    0,
  );

  const calculateMins = (pId) => {
    let total = 0;
    stints
      .filter((s) => s.playerId === pId)
      .forEach((s) => {
        const out =
          s.clockOut !== null ? s.clockOut : s.quarter === quarter ? clock : 0;
        total += s.clockIn - out;
      });
    return formatTime(total);
  };

  // UPDATED: Dynamically generate the quarters object instead of hardcoding 1, 2, 3, 4
  const getQuarterAppearances = () => {
    const quarters = {};
    // Pre-fill arrays for every quarter up to the current one
    for (let i = 1; i <= quarter; i++) {
      quarters[i] = [];
    }

    stints.forEach((stint) => {
      // Safety catch in case a stint exists outside the normal range
      if (!quarters[stint.quarter]) quarters[stint.quarter] = [];

      if (!quarters[stint.quarter].includes(stint.playerId)) {
        quarters[stint.quarter].push(stint.playerId);
      }
    });
    return quarters;
  };

  const getQuarterStats = (playerId, qtr) => {
    let qPts = 0;
    let qFls = 0;
    actionHistory.forEach((action) => {
      if (action.playerId === playerId && action.quarter === qtr) {
        if (action.type === "score") qPts += action.amount;
        if (action.type === "fouls") qFls += action.amount;
      }
    });
    return { qPts, qFls };
  };

  const quarterData = getQuarterAppearances();
  // UPDATED: Create a dynamic array for mapping [1, 2, 3, 4, 5...] based on current quarter
  const dynamicQuartersArray = Array.from({ length: quarter }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* 1. REPORT HEADER */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-b-4 border-amber-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-amber-400 uppercase tracking-tighter">
            {teamMeta?.teamName || "Team"} Final Report
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">
            {teamMeta?.league} • {teamMeta?.season}
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-slate-800 px-5 py-2 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-black uppercase">
              Total Pts
            </span>
            <span className="text-2xl font-black text-white">
              {teamTotalScore}
            </span>
          </div>
          <div className="bg-slate-800 px-5 py-2 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-black uppercase">
              Total Fouls
            </span>
            <span className="text-2xl font-black text-red-400">
              {teamTotalFouls}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="flex bg-slate-200 p-1 rounded-xl shadow-sm border border-slate-300">
        <button
          onClick={() => setActiveTab("boxscore")}
          className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === "boxscore"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-300/50"
          }`}
        >
          <ClipboardList size={18} /> Box Score
        </button>
        <button
          onClick={() => setActiveTab("quarters")}
          className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === "quarters"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-300/50"
          }`}
        >
          <Clock size={18} /> Quarter Data
        </button>
      </div>

      {/* 3. TAB 1: BOX SCORE */}
      {activeTab === "boxscore" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider text-sm">
              <Users size={18} className="text-blue-600" /> Complete Roster
              Stats
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest">
                  <th className="p-4 font-black">Player</th>
                  <th className="p-4 font-black text-center">PTS</th>
                  <th className="p-4 font-black text-center">FLS</th>
                  <th className="p-4 font-black text-center">Total Min</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((p) => {
                  const stats = playerStats[p.id] || { score: 0, fouls: 0 };
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                          #{p.jersey}
                        </span>
                        <span className="font-black text-slate-800 text-sm sm:text-base truncate">
                          {p.name}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 w-10 h-10 rounded-lg font-black text-lg">
                          {stats.score}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-black text-lg ${stats.fouls >= 5 ? "bg-red-600 text-white" : stats.fouls >= 4 ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"}`}
                        >
                          {stats.fouls}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg text-sm sm:text-base">
                          {calculateMins(p.id)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB 2: QUARTER BREAKDOWN */}
      {activeTab === "quarters" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* UPDATED: We use dynamicQuartersArray instead of hardcoded [1,2,3,4] */}
          {dynamicQuartersArray.map((q) => {
            const playersInQuarter = quarterData[q] || [];

            return (
              <div
                key={`qtr-${q}`}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
              >
                <div className="bg-slate-900 px-5 py-3 border-b-4 border-amber-500 flex justify-between items-center">
                  <h3 className="font-black text-white uppercase tracking-wider text-sm">
                    {q > 4 ? `Overtime ${q - 4}` : `Quarter ${q}`}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-2 py-1 rounded">
                    {playersInQuarter.length} Appeared
                  </span>
                </div>

                <div className="p-4 flex-1 bg-slate-50">
                  {playersInQuarter.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {playersInQuarter.map((id) => {
                        const p = roster.find((r) => r.id === id);
                        if (!p) return null;

                        // Grab the specific stats for this quarter
                        const qStats = getQuarterStats(id, q);

                        return (
                          <div
                            key={`${q}-${id}`}
                            className="bg-white border border-slate-200 px-3 py-2 rounded-lg flex items-center justify-between shadow-sm"
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <span className="text-xs font-black text-slate-400">
                                #{p.jersey}
                              </span>
                              <span className="text-sm font-bold text-slate-800 truncate">
                                {p.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 shrink-0">
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase leading-none">
                                  Pts
                                </span>
                                <span className="text-sm font-black text-slate-700 leading-none mt-0.5">
                                  {qStats.qPts}
                                </span>
                              </div>
                              <div className="flex flex-col items-center justify-center ml-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase leading-none">
                                  Fls
                                </span>
                                <span
                                  className={`text-sm font-black leading-none mt-0.5 ${qStats.qFls > 0 ? "text-red-500" : "text-slate-700"}`}
                                >
                                  {qStats.qFls}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-6 opacity-50">
                      <Target size={24} className="mb-2" />
                      <p className="text-xs font-bold uppercase tracking-widest text-center">
                        No Subs Recorded
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. DANGER ZONE (Reset Game) */}
      <div className="flex justify-end pt-4 border-t border-slate-200 mt-8">
        <button
          onClick={resetGame}
          className="bg-white border-2 border-red-200 hover:bg-red-50 hover:border-red-500 text-red-600 font-black py-3 px-6 rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Trash2 size={18} /> Trash Game & Start Over
        </button>
      </div>
    </div>
  );
}
