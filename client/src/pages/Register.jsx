import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

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
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden flex-col justify-between border-r border-white/10 bg-gradient-to-br from-brand-500/20 via-zinc-950 to-zinc-950 p-10 lg:flex"
        >
          <div>
            <p className="ui-kicker">Join the party</p>
            <h1 className="ui-title max-w-md">Create an account and start hosting in seconds.</h1>
            <p className="ui-copy max-w-lg">
              Share a private room, drop a video, and build a live session with your people.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="ui-chip">Private room keys</div>
            <div className="ui-chip">Real-time synced playback</div>
            <div className="ui-chip">Social feed for highlights</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 sm:p-10"
        >
          <div className="mb-8 text-center lg:text-left">
            <p className="ui-kicker">Sign up</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Create your account</h1>
            <p className="mt-2 text-sm text-zinc-400">Set up your profile and jump into the room flow.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="ui-input"
            />
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
            <textarea
              placeholder="Short bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="ui-input resize-none"
            />

            {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

            <button type="submit" disabled={loading} className="ui-button-primary w-full">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400 lg:text-left">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brand-300 hover:text-brand-200">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
