OfficialGameDetailsModal;

import React from "react";
import { X, History, Trophy, Clock } from "lucide-react";
import { formatTime } from "../../utils/helpers";

export default function OfficialGameDetailsModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const { game, logs } = data;

  return (
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-[10000] backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center border-b-4 border-amber-500">
          <div className="flex items-center gap-3">
            <Trophy className="text-amber-500" size={28} />
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                Official Game Report
              </h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {game.league} • Season {game.season} • {game.division}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-xl"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          {/* Scoreboard Summary */}
          <div className="grid grid-cols-3 items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="text-center">
              <p className="text-[15px] font-black text-blue-500 uppercase tracking-widest mb-1 truncate">
                {game.team_a_name}
              </p>
              <h3 className="text-5xl font-black text-slate-900">
                {game.final_score_a}
              </h3>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase mb-2">
                FINAL RESULT
              </span>
              <div className="text-slate-300 font-black text-2xl tracking-tighter">
                VS
              </div>
            </div>

            <div className="text-center">
              <p className="text-[15px] font-black text-red-500 uppercase tracking-widest mb-1 truncate">
                {game.team_b_name}
              </p>
              <h3 className="text-5xl font-black text-slate-900">
                {game.final_score_b}
              </h3>
            </div>
          </div>

          {/* Full Play-by-Play Log */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col gap-3 shadow-inner">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <History size={14} className="text-amber-500" /> Official
              Play-by-Play
            </h3>
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {logs.length === 0 ? (
                <p className="text-[10px] text-slate-600 italic text-center py-10 font-bold uppercase tracking-widest">
                  No events recorded
                </p>
              ) : (
                logs.map((log, idx) => {
                  const isScore =
                    log.action_type === "SCORE" ||
                    log.action_type === "SCORE_ADJUST";
                  const isFoul = log.action_type === "FOUL";
                  const isTimeout = log.action_type === "TIMEOUT";
                  const isSub =
                    log.action_type === "SUB_IN" ||
                    log.action_type === "SUB_OUT";
                  const isStat =
                    log.action_type === "REBOUND" ||
                    log.action_type === "ASSIST" ||
                    log.action_type === "STEAL";

                  return (
                    <div
                      key={log.id || idx}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                        isScore
                          ? "bg-emerald-500/20 border-emerald-500/40"
                          : isFoul
                            ? "bg-red-500/20 border-red-500/40"
                            : isTimeout
                              ? "bg-amber-500/20 border-amber-500/40"
                              : isSub
                                ? "bg-indigo-500/20 border-indigo-500/40"
                                : isStat
                                  ? "bg-cyan-500/20 border-cyan-500/40"
                                  : "bg-slate-800 border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black bg-slate-800 text-slate-300 w-5 h-5 rounded-full flex items-center justify-center border border-slate-700">
                          {log.quarter > 4
                            ? `OT${log.quarter - 4}`
                            : `Q${log.quarter}`}
                        </span>
                        <div className="flex flex-col">
                          <span
                            className={`text-[9px] font-black uppercase leading-tight ${log.team_side === "A" ? "text-blue-300" : log.team_side === "B" ? "text-red-300" : "text-slate-300"}`}
                          >
                            {log.action_type === "TIMEOUT" ||
                            log.action_type === "SCORE_ADJUST"
                              ? `TEAM ${log.team_side === "A" ? game.team_a_name : game.team_b_name}`
                              : log.action_type === "GAME_START"
                                ? `TIP-OFF: ${log.team_side === "A" ? game.team_a_name : game.team_b_name}`
                                : log.action_type === "ARROW_FLIP"
                                  ? `POSS: ${log.team_side === "A" ? game.team_a_name : game.team_b_name}`
                                  : log.action_type === "PERIOD_END"
                                    ? ""
                                    : `#${log.jersey} ${log.player_name}`}
                          </span>
                          <span
                            className={`text-[8px] font-bold uppercase tracking-tighter ${
                              isScore
                                ? "text-emerald-300"
                                : isFoul
                                  ? "text-red-300"
                                  : isTimeout
                                    ? "text-amber-300"
                                    : isSub
                                      ? "text-indigo-300"
                                      : isStat
                                        ? "text-cyan-300"
                                        : "text-slate-500"
                            }`}
                          >
                            {log.action_type === "FOUL"
                              ? "PERSONAL FOUL"
                              : log.action_type === "TIMEOUT"
                                ? "TIMEOUT"
                                : log.action_type === "SCORE"
                                  ? `+${log.amount} PTS`
                                  : log.action_type === "REBOUND"
                                    ? "REBOUND"
                                    : log.action_type === "ASSIST"
                                      ? "ASSIST"
                                      : log.action_type === "STEAL"
                                        ? "STEAL"
                                        : log.action_type === "GAME_START"
                                          ? "JUMP BALL WON"
                                          : log.action_type === "PERIOD_END"
                                            ? "PERIOD END"
                                            : log.action_type === "ARROW_FLIP"
                                              ? "HELD BALL"
                                              : log.action_type ===
                                                  "SCORE_ADJUST"
                                                ? `${log.amount} SCORE ADJUST`
                                                : log.action_type === "SUB_IN"
                                                  ? "IN"
                                                  : log.action_type ===
                                                      "SUB_OUT"
                                                    ? "OUT"
                                                    : log.action_type}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-amber-500/80 tabular-nums">
                          {formatTime(log.time_remaining)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
