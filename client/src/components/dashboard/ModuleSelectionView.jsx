import React from "react";
import { ClipboardCheck, Users, Activity, ChevronRight } from "lucide-react";

export default function ModuleSelectionView({ onSelectModule }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coaching Staff Module Card */}
        <button
          onClick={() => onSelectModule("COACHING")}
          className="group bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 flex flex-col items-center text-center space-y-4 hover:shadow-2xl active:scale-[0.98]"
        >
          <div className="bg-blue-100 p-6 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
            <Users size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              Coaching Staff
            </h2>
            <p className="text-slate-500 text-sm font-bold mt-2 leading-relaxed">
              Track real-time stats, manage substitutions, and analyze player
              performance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest pt-2">
            Enter Module <ChevronRight size={16} />
          </div>
        </button>

        {/* Committee Scoresheet Module Card */}
        <button
          onClick={() => onSelectModule("COMMITTEE")}
          className="group bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-amber-500 transition-all duration-300 flex flex-col items-center text-center space-y-4 hover:shadow-2xl active:scale-[0.98]"
        >
          <div className="bg-amber-100 p-6 rounded-2xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm">
            <ClipboardCheck size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              Committee Scoresheet
            </h2>
            <p className="text-slate-500 text-sm font-bold mt-2 leading-relaxed">
              Official game recording, foul management, and score validation for
              officials.
            </p>
          </div>
          <div className="flex items-center gap-2 text-amber-600 font-black uppercase text-xs tracking-widest pt-2">
            Enter Module <ChevronRight size={16} />
          </div>
        </button>
      </div>

      <div className="mt-12 flex flex-col items-center opacity-40">
        <Activity size={32} className="text-slate-400 mb-2" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          SubNScore Hoops ecosystem
        </span>
      </div>
    </div>
  );
}
