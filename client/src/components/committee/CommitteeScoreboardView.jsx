import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { formatTime } from "../../utils/helpers";

export default function CommitteeScoreboardView() {
  const [data, setData] = useState({
    teamAName: "TEAM A",
    teamBName: "TEAM B",
    scores: { A: 0, B: 0 },
    teamFouls: { A: 0, B: 0 },
    quarter: 1,
    clock: 600,
    possessionArrow: null,
    shotClock: 24,
  });

  useEffect(() => {
    // Create a broadcast channel to listen for updates from the controller
    const channel = new BroadcastChannel("subnscore_official_sync");

    channel.onmessage = (event) => {
      setData(event.data);
    };

    // Clean up on unmount
    return () => channel.close();
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col font-sans overflow-hidden p-8">
      {/* Main Scoreboard Area */}
      <div className="flex-1 grid grid-cols-3 items-center">
        {/* Team A */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-4xl lg:text-6xl font-black text-blue-500 uppercase text-center truncate w-full">
            {data.teamAName}
          </h2>
          <div className="text-[12rem] lg:text-[18rem] font-black leading-none tabular-nums">
            {data.scores.A}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((f) => (
              <div
                key={f}
                className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full ${data.teamFouls.A >= f ? "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]" : "bg-zinc-800"}`}
              />
            ))}
          </div>
        </div>

        {/* Center: Clock & Period */}
        <div className="flex flex-col items-center justify-center space-y-12">
          {/* Period Indicator */}
          <div className="bg-amber-500 text-black px-12 py-3 rounded-2xl text-3xl lg:text-5xl font-black uppercase tracking-tighter">
            {data.quarter > 4
              ? `OT ${data.quarter - 4}`
              : `PERIOD ${data.quarter}`}
          </div>

          <div className="flex flex-col items-center gap-4">
            {/* Game Clock */}
            <div className="text-[8rem] lg:text-[11rem] font-mono font-black tabular-nums bg-zinc-900 px-10 py-2 rounded-3xl border-4 border-zinc-800 text-amber-500 shadow-inner leading-none">
              {formatTime(data.clock)}
            </div>

            {/* Shot Clock - LARGE and FLASHING */}
            <div className="flex flex-col items-center">
               <div className={`text-[12rem] lg:text-[15rem] font-mono font-black tabular-nums leading-none transition-colors duration-300 ${data.shotClock <= 10 ? 'text-red-600 animate-pulse' : 'text-amber-500'}`}>
                 {data.shotClock}
               </div>
               <div className="text-zinc-700 text-2xl font-black uppercase tracking-[0.5em] -mt-4">
                 Shot Clock
               </div>
            </div>
          </div>

          {/* Possession Arrow */}
          <div className="flex items-center gap-10">
            <ArrowLeft
              size={80}
              className={`transition-all duration-300 ${data.possessionArrow === "A" ? "text-amber-500 scale-125" : "text-zinc-900"}`}
              strokeWidth={4}
            />
            <div className="text-zinc-600 text-xl font-black uppercase tracking-widest">
              Possession
            </div>
            <ArrowRight
              size={80}
              className={`transition-all duration-300 ${data.possessionArrow === "B" ? "text-amber-500 scale-125" : "text-zinc-900"}`}
              strokeWidth={4}
            />
          </div>
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-4xl lg:text-6xl font-black text-red-500 uppercase text-center truncate w-full">
            {data.teamBName}
          </h2>
          <div className="text-[12rem] lg:text-[18rem] font-black leading-none tabular-nums">
            {data.scores.B}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((f) => (
              <div
                key={f}
                className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full ${data.teamFouls.B >= f ? "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]" : "bg-zinc-800"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Identity Footer */}
      <div className="flex justify-between items-center pt-8 border-t border-zinc-900">
        <div className="text-zinc-500 font-black uppercase tracking-widest text-sm italic">
          Live Official Scoresheet
        </div>
        <div className="flex items-center gap-2 text-zinc-700">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-xs uppercase">
            Monitor Link Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 p-2 rounded-lg">
            <span className="text-amber-500 font-black tracking-tighter">
              SubNScore
            </span>
            <span className="text-white font-black tracking-tighter ml-1">
              Hoops
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
