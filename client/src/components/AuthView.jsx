import React from "react";
import { Globe } from "lucide-react";

export default function AuthView({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  handleLocalAuth,
  handleDemoLogin,
}) {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <h1 className="text-2xl font-bold text-center mb-6">
          {authMode === "login" ? "Coach Login" : "Register Coach"}
        </h1>
        <form onSubmit={handleLocalAuth} className="space-y-4">
          {authMode === "register" && (
            <input
              required
              className="w-full p-2 border rounded"
              placeholder="Full Name"
              value={authForm.name}
              onChange={(e) =>
                setAuthForm({ ...authForm, name: e.target.value })
              }
            />
          )}
          <input
            type="email"
            required
            className="w-full p-2 border rounded"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
          />
          <input
            type="password"
            required
            className="w-full p-2 border rounded"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2 rounded font-bold"
          >
            {authMode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* --- DISABLED DEMO BUTTON --- */}
        <button
          disabled
          className="w-full mt-4 bg-slate-100 text-slate-400 py-2 rounded font-bold cursor-not-allowed border border-slate-200"
        >
          Demo Mode (Under Maintenance)
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:5000/api/auth/google")
          }
          className="w-full mt-4 flex items-center justify-center gap-2 border py-2 rounded font-bold hover:bg-slate-50"
        >
          <Globe size={18} className="text-red-500" /> Google Login
        </button>
        <p className="mt-4 text-center text-sm">
          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            className="text-blue-600 font-bold"
          >
            {authMode === "login"
              ? "Need an account? Register"
              : "Have an account? Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
