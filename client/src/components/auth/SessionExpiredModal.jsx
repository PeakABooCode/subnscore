import React, { useState } from "react";
import axios from "axios";
import { Activity, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function SessionExpiredModal({ userRole, onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", {
        email: form.email,
        password: form.password,
        role: userRole || "COACH",
      });
      onSuccess(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Amber top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400" />

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-slate-900 p-3 rounded-2xl mb-4 shadow-lg">
              <Activity className="text-amber-400" size={28} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter text-center">
              Session Expired
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-center">
              Sign back in to continue
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm font-bold">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700"
                  placeholder="coach@team.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                Security Key
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] bg-slate-900 hover:bg-black disabled:opacity-60 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] mt-2"
            >
              {loading ? "Signing In..." : "Resume Session"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
