import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

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
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden flex-col justify-between border-r border-white/10 bg-gradient-to-br from-brand-500/20 via-zinc-950 to-zinc-950 p-10 lg:flex"
        >
          <div>
            <p className="ui-kicker">Welcome back</p>
            <h1 className="ui-title max-w-md">Sign in to a smoother watch party experience.</h1>
            <p className="ui-copy max-w-lg">
              Jump back into synced rooms, live chat, and shared moments without losing the mood.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="ui-chip">Fast room access</div>
            <div className="ui-chip">Live chat and reactions</div>
            <div className="ui-chip">Private, invite-only sessions</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 sm:p-10"
        >
          <div className="mb-8 text-center lg:text-left">
            <p className="ui-kicker">Sign in</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Continue watching</h1>
            <p className="mt-2 text-sm text-zinc-400">Pick up where you left off and rejoin your rooms.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="ui-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="ui-input"
            />

            {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

            <button type="submit" disabled={loading} className="ui-button-primary w-full">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400 lg:text-left">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-brand-300 hover:text-brand-200">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
