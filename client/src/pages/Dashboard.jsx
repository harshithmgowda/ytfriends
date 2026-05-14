import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinKey, setJoinKey] = useState("");
  const [createForm, setCreateForm] = useState({ title: "", videoUrl: "" });

  const loadRooms = async () => {
    try {
      const { data } = await API.get("/rooms/my");
      setRooms(data.rooms || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const createRoom = async () => {
    const { data } = await API.post("/rooms/create", createForm);
    navigate(`/room/${data.room.roomKey}`);
  };

  const joinRoom = async () => {
    const { data } = await API.post("/rooms/join", { roomKey: joinKey.trim().toUpperCase() });
    navigate(`/room/${data.room.roomKey}`);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
      <Sidebar />

      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Your dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-white">Welcome, {user?.name}</h1>
              <p className="mt-2 max-w-2xl text-zinc-400">
                Create a private room, drop in a secret key, and watch YouTube together with real-time chat.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Rooms joined</p>
                <p className="mt-2 text-3xl font-bold text-white">{rooms.length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Status</p>
                <p className="mt-2 text-3xl font-bold text-brand-300">Live</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Create a room</h2>
            <p className="mt-2 text-sm text-zinc-400">Generate a private room key and start watching immediately.</p>
            <div className="mt-5 space-y-3">
              <input
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="Room title"
                className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
              <input
                value={createForm.videoUrl}
                onChange={(e) => setCreateForm({ ...createForm, videoUrl: e.target.value })}
                placeholder="YouTube URL or video ID"
                className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none focus:border-brand-500"
              />
              <button
                onClick={createRoom}
                className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600"
              >
                Create private room
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Join with a secret key</h2>
            <p className="mt-2 text-sm text-zinc-400">Enter the room key your host shared with you.</p>
            <div className="mt-5 space-y-3">
              <input
                value={joinKey}
                onChange={(e) => setJoinKey(e.target.value)}
                placeholder="ROOMKEY"
                className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white uppercase outline-none focus:border-brand-500"
              />
              <button
                onClick={joinRoom}
                disabled={!joinKey.trim()}
                className="w-full rounded-2xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 font-semibold text-brand-200 transition hover:bg-brand-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Join room
              </button>
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Your rooms</h2>
              <p className="mt-1 text-sm text-zinc-400">Rooms you created or joined recently.</p>
            </div>
            <Link to="/feed" className="text-sm font-medium text-brand-300 hover:text-brand-200">
              View feed →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading && <div className="text-zinc-400">Loading rooms...</div>}
            {!loading && rooms.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/50 p-8 text-zinc-400">
                No rooms yet. Create one to get started.
              </div>
            )}
            {rooms.map((room) => (
              <motion.button
                key={room._id}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/room/${room.roomKey}`)}
                className="text-left rounded-3xl border border-white/10 bg-zinc-950/70 p-5 transition hover:border-brand-500/40 hover:bg-zinc-900"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-brand-300">#{room.roomKey}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{room.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">Host: {room.host?.name || "You"}</p>
                <p className="mt-4 text-sm text-zinc-500">
                  {room.isPlaying ? "Playing" : "Paused"} • {room.participants?.length || 0} participants
                </p>
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

