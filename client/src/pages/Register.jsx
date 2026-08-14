import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const perks = [
  { icon: "🔑", label: "Private room keys" },
  { icon: "🎬", label: "Real-time synced playback" },
  { icon: "✨", label: "Social feed for highlights" },
];

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", bio: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/register", form);
      register(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.08)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="lg:grid lg:grid-cols-[1fr_1fr]">
          {/* Left form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-8 sm:p-12 order-2 lg:order-1"
            style={{ background: "rgba(8,6,18,0.90)" }}
          >
            <div className="mb-8">
              <p className="ui-kicker">Sign up</p>
              <h2
                className="mt-2 text-3xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
              >
                Create your account
              </h2>
              <p className="mt-2 text-sm" style={{ color: "rgba(161,153,195,0.75)" }}>
                Set up your profile and jump into the room flow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Full name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="ui-input"
                />
              </div>
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
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Short bio</label>
                <textarea
                  placeholder="Tell others a little about yourself..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="ui-input resize-none"
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
                    Creating account...
                  </span>
                ) : "Create account →"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: "rgba(161,153,195,0.70)" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold transition-colors hover:text-white"
                style={{ color: "#c084fc" }}
              >
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Right info panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex order-1 lg:order-2"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.14) 0%, rgba(10,8,20,0.95) 60%, rgba(168,85,247,0.10) 100%)",
              borderLeft: "1px solid rgba(255,255,255,0.06)"
            }}
          >
            {/* Orbs */}
            <div
              className="absolute -left-10 -top-10 h-48 w-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.22), transparent 70%)", filter: "blur(32px)" }}
            />
            <div
              className="absolute -bottom-12 -right-8 h-40 w-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)", filter: "blur(28px)" }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #a855f7)",
                    boxShadow: "0 8px 24px rgba(59,130,246,0.40)"
                  }}
                >
                  ▶
                </div>
                <span
                  className="text-lg font-bold uppercase tracking-[0.2em]"
                  style={{
                    background: "linear-gradient(90deg, #93c5fd, #c084fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  WatchParty
                </span>
              </div>

              <p className="ui-kicker">Join the party</p>
              <h1
                className="mt-3 text-3xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
              >
                Create an account and start hosting in seconds.
              </h1>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(161,153,195,0.80)" }}>
                Share a private room, drop a video, and build a live session with your people.
              </p>
            </div>

            <div className="relative z-10 space-y-2">
              {perks.map(({ icon, label }) => (
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
        </div>
      </div>
    </div>
  );
};

export default Register;
