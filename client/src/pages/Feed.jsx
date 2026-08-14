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
        <section className="ui-hero">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
            <div>
              <p className="ui-section-label">Community feed</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Share what you&apos;re watching.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                Post a recommendation, a reaction, or a highlight from your watch room without making the feed feel noisy.
              </p>
            </div>
            <div className="ui-panel p-5">
              <p className="ui-section-label">Posting style</p>
              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Short reactions</span>
                  <span className="text-brand-300">Best for speed</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Screenshot + caption</span>
                  <span className="text-brand-300">More visual</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={createPost} className="ui-surface p-6">
          <p className="ui-section-label">New post</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Add a fresh take</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Post title"
              className="ui-input"
            />
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="Image URL (optional)"
              className="ui-input"
            />
          </div>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write your thoughts..."
            rows={4}
            className="ui-input mt-3 resize-none"
          />
          <div className="mt-4 flex justify-end">
            <button className="ui-button-primary">
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
