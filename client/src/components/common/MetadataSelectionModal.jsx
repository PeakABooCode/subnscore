import React from "react";
import { X, List, ChevronRight } from "lucide-react";

// 📋 METADATA SELECTION MODAL: This popup takes an array of strings (like a list of seasons or divisions).
// It generates a button for every string. When the user clicks a button, it fires the `onSelect` function
// to pass their choice back up to the parent screen.
export default function MetadataSelectionModal({
  isOpen,
  onClose,
  title,
  data, // Array of strings (leagues, divisions, seasons)
  onSelect,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md relative flex flex-col max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <List className="text-blue-600" /> {title}
        </h2>

        {data.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-bold italic">
            No data found.
          </div>
        ) : (
          <div className="overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {data.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-center justify-between"
              >
                <div className="font-black text-slate-800 uppercase group-hover:text-blue-700 truncate">
                  {item}
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-300 group-hover:text-blue-500"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
