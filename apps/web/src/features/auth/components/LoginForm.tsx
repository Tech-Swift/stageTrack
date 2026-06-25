import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginService } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";
import { getDashboardRoute } from "../utils/roleRedirect";

interface Props {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginService(email, password);

      login(response.token, response.user);

      onSuccess?.();

      navigate(getDashboardRoute(response.user.role));
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">
          Welcome Back
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to access your StageTrack dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-[#2563EB] py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login to Dashboard"}
        </button>
      </form>
    </div>
  );
}