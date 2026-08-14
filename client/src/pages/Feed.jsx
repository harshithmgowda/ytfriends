import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import FeedCard from "../components/FeedCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    const { data } = await API.get("/posts");
    setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  const createPost = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/posts", form);
    setPosts((prev) => [data.post, ...prev]);
    setForm({ title: "", content: "", image: "" });
  };

  const toggleLike = async (id) => {
    const { data } = await API.put(`/posts/${id}/like`);
    setPosts((prev) => prev.map((post) => (post._id === id ? data.post : post)));
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
      <Sidebar />

      <div className="space-y-6">
        {/* Hero */}
        <section className="ui-hero relative overflow-hidden">
          <div
            className="absolute top-0 right-0 h-56 w-56 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.20), transparent 70%)", filter: "blur(36px)", transform: "translate(30%, -30%)" }}
          />
          <div
            className="absolute bottom-0 left-0 h-40 w-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)", filter: "blur(28px)", transform: "translate(-30%, 30%)" }}
          />

          <div className="relative z-10 grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div>
              <p className="ui-section-label mb-3">Community feed</p>
              <h1
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
              >
                Share what you&apos;re watching.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: "rgba(161,153,195,0.80)" }}>
                Post a recommendation, a reaction, or a highlight from your watch room.
              </p>
            </div>

            <div className="ui-panel p-5">
              <p className="ui-section-label mb-3">Posting styles</p>
              <div className="space-y-2">
                {[
                  { label: "Short reactions", tag: "Best for speed", icon: "⚡" },
                  { label: "Screenshot + caption", tag: "More visual", icon: "📸" },
                ].map(({ label, tag, icon }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span className="flex items-center gap-2 text-sm text-zinc-200">
                      <span>{icon}</span> {label}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "#c084fc" }}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* New post form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={createPost}
          className="ui-surface p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", boxShadow: "0 2px 12px rgba(168,85,247,0.35)" }}
            >
              ✦
            </div>
            <div>
              <p className="ui-section-label">New post</p>
              <h2
                className="text-xl font-bold text-white mt-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Add a fresh take
              </h2>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 mb-3">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(161,153,195,0.60)" }}>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="What are you sharing?"
                className="ui-input"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(161,153,195,0.60)" }}>Image URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://... (optional)"
                className="ui-input"
              />
            </div>
          </div>
          <div className="space-y-1 mb-4">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(161,153,195,0.60)" }}>Your thoughts</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your reaction, review, or recommendation..."
              rows={4}
              className="ui-input resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="ui-button-primary px-6 py-2.5">
              ✦ Publish post
            </button>
          </div>
        </motion.form>

        {/* Posts grid */}
        <section className="grid gap-5 md:grid-cols-2">
          {loading && (
            <div className="col-span-2 flex items-center gap-2 py-8 text-sm" style={{ color: "rgba(161,153,195,0.50)" }}>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Loading feed...
            </div>
          )}
          {!loading && posts.length === 0 && (
            <div
              className="col-span-2 rounded-2xl border-dashed p-12 text-center"
              style={{ border: "1px dashed rgba(255,255,255,0.08)" }}
            >
              <p className="text-3xl mb-3">✦</p>
              <p className="text-sm font-medium text-white mb-1">No posts yet</p>
              <p className="text-xs" style={{ color: "rgba(161,153,195,0.50)" }}>Be the first to share something awesome!</p>
            </div>
          )}
          {posts.map((post) => (
            <FeedCard key={post._id} post={post} onLike={toggleLike} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default Feed;
