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

  useEffect(() => {
    loadPosts();
  }, []);

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
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Community feed</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Share what you&apos;re watching</h1>
          <p className="mt-2 text-zinc-400">Post a recommendation, a reaction, or a highlight from your watch room.</p>
        </section>

        <form onSubmit={createPost} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Post title"
              className="rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none focus:border-brand-500"
            />
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="Image URL (optional)"
              className="rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none focus:border-brand-500"
            />
          </div>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write your thoughts..."
            rows={4}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none focus:border-brand-500"
          />
          <div className="mt-4 flex justify-end">
            <button className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-600">
              Publish post
            </button>
          </div>
        </form>

        <section className="grid gap-6">
          {loading && <div className="text-zinc-400">Loading feed...</div>}
          {!loading && posts.length === 0 && <div className="text-zinc-400">No posts yet. Be the first to share!</div>}
          {posts.map((post) => (
            <FeedCard key={post._id} post={post} onLike={toggleLike} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default Feed;

