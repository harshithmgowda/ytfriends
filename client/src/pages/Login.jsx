import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const features = [
  { icon: "⚡", label: "Fast room access" },
  { icon: "💬", label: "Live chat & reactions" },
  { icon: "🔒", label: "Private sessions" },
];

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/login", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-68px)] items-center justify-center px-4 py-10">
      <div
        className="grid w-full max-w-5xl overflow-hidden rounded-[2rem]"
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.08)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="lg:grid lg:grid-cols-[1fr_1fr]">
          {/* Left panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(10,8,20,0.95) 60%, rgba(59,130,246,0.10) 100%)",
              borderRight: "1px solid rgba(255,255,255,0.06)"
            }}
          >
            {/* Top orb */}
            <div
              className="absolute -right-10 -top-10 h-48 w-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.22), transparent 70%)", filter: "blur(32px)" }}
            />
            {/* Bottom orb */}
            <div
              className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)", filter: "blur(28px)" }}
            />

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                    boxShadow: "0 8px 24px rgba(168,85,247,0.45)"
                  }}
                >
                  ▶
                </div>
                <span
                  className="text-lg font-bold uppercase tracking-[0.2em]"
                  style={{
                    background: "linear-gradient(90deg, #c084fc, #93c5fd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  WatchParty
                </span>
              </div>

              <p className="ui-kicker">Welcome back</p>
              <h1
                className="mt-3 text-3xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
              >
                Sign in to a smoother watch party experience.
              </h1>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(161,153,195,0.80)" }}>
                Jump back into synced rooms, live chat, and shared moments without losing the mood.
              </p>
            </div>

            <div className="relative z-10 space-y-2">
              {features.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <span className="text-base">{icon}</span>
                  <span className="text-sm font-medium text-zinc-200">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-8 sm:p-12"
            style={{ background: "rgba(8,6,18,0.90)" }}
          >
            <div className="mb-8">
              <p className="ui-kicker">Sign in</p>
              <h2
                className="mt-2 text-3xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
              >
                Continue watching
              </h2>
              <p className="mt-2 text-sm" style={{ color: "rgba(161,153,195,0.75)" }}>
                Pick up where you left off and rejoin your rooms.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="ui-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="ui-input"
                />
              </div>

              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#fca5a5"
                  }}
                >
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="ui-button-primary w-full py-3 mt-2">
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign in →"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: "rgba(161,153,195,0.70)" }}>
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold transition-colors hover:text-white"
                style={{ color: "#c084fc" }}
              >
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
