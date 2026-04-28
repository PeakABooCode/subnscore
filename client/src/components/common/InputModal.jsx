import React, { useState, useEffect, useRef } from "react";
import { X, Edit3 } from "lucide-react";

export default function InputModal({
  isOpen,
  onClose,
  onSave,
  title,
  message,
  initialValue = "",
  placeholder = "",
  inputType = "text",
  confirmText = "Save",
  cancelText = "Cancel",
}) {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
      // Focus the input field when the modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialValue]);

  const handleSave = () => {
    onSave(inputValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center text-center">
          <Edit3 size={48} className="text-blue-600 mb-4" />
          <h2 className="text-2xl font-black text-slate-800 mb-3">{title}</h2>
          <p className="text-slate-600 mb-6">{message}</p>
        </div>

        <div className="relative mb-6">
          <input
            ref={inputRef}
            type={inputType}
            inputMode={inputType === "number" ? "numeric" : "text"}
            className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
