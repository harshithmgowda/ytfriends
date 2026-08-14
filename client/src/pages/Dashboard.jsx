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

  const activeRooms = rooms.filter((room) => room.isPlaying).length;
  const latestRoom = rooms[0];

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
        <section className="ui-hero">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="ui-badge">Your dashboard</span>
                <span className="ui-chip border-brand-500/20 bg-brand-500/10 text-brand-200">Live rooms</span>
              </div>
              <div className="max-w-2xl">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Welcome back, {user?.name?.split(" ")[0] || "there"}.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-300">
                  Build a room, jump into a private session, and keep the whole experience feeling clean, fast, and intentionally designed.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={createRoom} className="ui-button-primary">
                  Start a room
                </button>
                <button
                  onClick={() => navigate("/feed")}
                  className="ui-button-ghost"
                >
                  Open feed
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="ui-panel p-5"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="ui-stat">
                  <p className="ui-stat-label">Rooms joined</p>
                  <p className="ui-stat-value">{rooms.length}</p>
                </div>
                <div className="ui-stat">
                  <p className="ui-stat-label">Playing now</p>
                  <p className="ui-stat-value text-brand-300">{activeRooms}</p>
                </div>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-zinc-950/70 p-4">
                <p className="ui-section-label">Latest room</p>
                {latestRoom ? (
                  <>
                    <p className="mt-2 text-lg font-semibold text-white">{latestRoom.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      #{latestRoom.roomKey} • {latestRoom.isPlaying ? "Playing" : "Paused"} • {latestRoom.participants?.length || 0} people
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-lg font-semibold text-white">No rooms yet</p>
                    <p className="mt-1 text-sm text-zinc-400">Create your first private room to start a session.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="ui-surface p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="ui-section-label">Create</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Open a private room</h2>
              </div>
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 sm:block">
                Private by default
              </div>
            </div>
            <p className="mt-3 max-w-xl text-sm text-zinc-400">Generate a room key and jump straight into a session without extra setup.</p>
            <div className="mt-5 space-y-3">
              <input
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="Room title"
                className="ui-input"
              />
              <input
                value={createForm.videoUrl}
                onChange={(e) => setCreateForm({ ...createForm, videoUrl: e.target.value })}
                placeholder="YouTube URL or video ID"
                className="ui-input"
              />
              <button
                onClick={createRoom}
                className="ui-button-primary w-full"
              >
                Create private room
              </button>
            </div>
          </section>

          <section className="ui-surface p-6">
            <p className="ui-section-label">Join</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Enter a room key</h2>
            <p className="mt-3 max-w-xl text-sm text-zinc-400">Use the secret key your host shared to enter the session instantly.</p>
            <div className="mt-5 space-y-3">
              <input
                value={joinKey}
                onChange={(e) => setJoinKey(e.target.value)}
                placeholder="ROOMKEY"
                className="ui-input uppercase"
              />
              <button
                onClick={joinRoom}
                disabled={!joinKey.trim()}
                className="ui-button-secondary w-full"
              >
                Join room
              </button>
            </div>
          </section>
        </div>

        <section className="ui-surface p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="ui-section-label">Recent</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Your rooms</h2>
              <p className="mt-1 text-sm text-zinc-400">Rooms you created or joined recently.</p>
            </div>
            <Link to="/feed" className="text-sm font-medium text-brand-300 hover:text-brand-200">
              View feed →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading && <div className="text-zinc-400">Loading rooms...</div>}
            {!loading && rooms.length === 0 && (
              <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-zinc-950/50 p-8 text-zinc-400">
                No rooms yet. Create one to get started.
              </div>
            )}
            {rooms.map((room, index) => (
              <motion.button
                key={room._id}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/room/${room.roomKey}`)}
                className="group text-left rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-5 transition hover:border-brand-500/40 hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-brand-300">Room {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{room.title}</h3>
                  </div>
                  <span className={`ui-chip ${room.isPlaying ? "border-brand-500/30 bg-brand-500/10 text-brand-200" : ""}`}>
                    {room.isPlaying ? "Playing" : "Paused"}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
                  <span>#{room.roomKey}</span>
                  <span>{room.participants?.length || 0} participants</span>
                </div>
                <div className="mt-4 h-px bg-white/10" />
                <p className="mt-4 text-sm text-zinc-500">Host: {room.host?.name || "You"}</p>
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
