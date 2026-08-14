import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" } }),
};

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

  useEffect(() => { loadRooms(); }, []);

  const activeRooms = rooms.filter((r) => r.isPlaying).length;
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
        {/* Hero */}
        <section className="ui-hero relative overflow-hidden">
          {/* Ambient orbs inside hero */}
          <div
            className="absolute top-0 right-0 h-64 w-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)", filter: "blur(40px)", transform: "translate(30%, -30%)" }}
          />
          <div
            className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.14), transparent 70%)", filter: "blur(32px)", transform: "translateY(40%)" }}
          />

          <div className="relative z-10 grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="ui-badge">Your dashboard</span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Live rooms
                </span>
              </div>

              <div>
                <h1
                  className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
                >
                  Welcome back,{" "}
                  <span
                    style={{
                      background: "linear-gradient(90deg, #c084fc, #93c5fd, #fbbf24)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundSize: "200%",
                      animation: "gradient-pan 6s ease infinite"
                    }}
                  >
                    {user?.name?.split(" ")[0] || "there"}
                  </span>
                  .
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7" style={{ color: "rgba(161,153,195,0.80)" }}>
                  Build a room, jump into a private session, and keep the whole experience feeling clean, fast, and intentionally designed.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={createRoom} className="ui-button-primary px-6 py-3">
                  ▶ Start a room
                </button>
                <button onClick={() => navigate("/feed")} className="ui-button-ghost px-6 py-3">
                  Open feed →
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="ui-panel p-5"
            >
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="ui-stat text-center">
                  <p className="ui-stat-label">Rooms</p>
                  <p className="ui-stat-value">{rooms.length}</p>
                </div>
                <div className="ui-stat text-center">
                  <p className="ui-stat-label">Playing</p>
                  <p
                    className="ui-stat-value"
                    style={{
                      background: "linear-gradient(90deg, #c084fc, #93c5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
                    {activeRooms}
                  </p>
                </div>
              </div>

              <div
                className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="ui-section-label mb-2">Latest room</p>
                {latestRoom ? (
                  <>
                    <p className="text-base font-semibold text-white">{latestRoom.title}</p>
                    <p className="mt-1 text-xs" style={{ color: "rgba(161,153,195,0.65)" }}>
                      #{latestRoom.roomKey} • {latestRoom.isPlaying ? "🟢 Playing" : "⏸ Paused"} • {latestRoom.participants?.length || 0} people
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-white">No rooms yet</p>
                    <p className="mt-1 text-xs" style={{ color: "rgba(161,153,195,0.65)" }}>
                      Create your first private room to start.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Create + Join */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Create */}
          <motion.section
            custom={0} initial="hidden" animate="visible" variants={cardVariants}
            className="ui-surface p-6"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="ui-section-label">Create</p>
                <h2
                  className="mt-1 text-2xl font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
                >
                  Open a private room
                </h2>
              </div>
              <span
                className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium"
                style={{ background: "rgba(168,85,247,0.10)", border: "1px solid rgba(168,85,247,0.20)", color: "#d8b4fe" }}
              >
                🔒 Private
              </span>
            </div>
            <p className="text-sm mb-5" style={{ color: "rgba(161,153,195,0.70)" }}>
              Generate a room key and jump straight into a session.
            </p>
            <div className="space-y-3">
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
              <button onClick={createRoom} className="ui-button-primary w-full py-3">
                Create private room
              </button>
            </div>
          </motion.section>

          {/* Join */}
          <motion.section
            custom={1} initial="hidden" animate="visible" variants={cardVariants}
            className="ui-surface p-6"
          >
            <p className="ui-section-label">Join</p>
            <h2
              className="mt-1 mb-2 text-2xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
            >
              Enter a room key
            </h2>
            <p className="text-sm mb-5" style={{ color: "rgba(161,153,195,0.70)" }}>
              Use the secret key your host shared to enter instantly.
            </p>
            <div className="space-y-3">
              <input
                value={joinKey}
                onChange={(e) => setJoinKey(e.target.value)}
                placeholder="ROOM-KEY"
                className="ui-input font-mono uppercase tracking-widest text-center text-lg"
              />
              <button
                onClick={joinRoom}
                disabled={!joinKey.trim()}
                className="ui-button-blue w-full py-3"
              >
                Join room →
              </button>
            </div>
          </motion.section>
        </div>

        {/* Room list */}
        <motion.section
          custom={2} initial="hidden" animate="visible" variants={cardVariants}
          className="ui-surface p-6"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="ui-section-label">Recent</p>
              <h2
                className="mt-1 text-2xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
              >
                Your rooms
              </h2>
              <p className="mt-1 text-sm" style={{ color: "rgba(161,153,195,0.65)" }}>
                Rooms you created or joined recently.
              </p>
            </div>
            <Link
              to="/feed"
              className="text-sm font-semibold transition-colors hover:text-white shrink-0"
              style={{ color: "#c084fc" }}
            >
              View feed →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading && (
              <div className="col-span-3 flex items-center gap-2 text-sm" style={{ color: "rgba(161,153,195,0.60)" }}>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Loading rooms...
              </div>
            )}
            {!loading && rooms.length === 0 && (
              <div
                className="col-span-3 rounded-2xl border-dashed p-10 text-center"
                style={{ border: "1px dashed rgba(255,255,255,0.08)", color: "rgba(161,153,195,0.50)" }}
              >
                <p className="text-2xl mb-2">🎬</p>
                <p className="text-sm">No rooms yet. Create one to get started.</p>
              </div>
            )}
            {rooms.map((room, index) => (
              <motion.button
                key={room._id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/room/${room.roomKey}`)}
                className="group text-left rounded-2xl p-5 transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.35)";
                  e.currentTarget.style.background = "rgba(168,85,247,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-1.5" style={{ color: "#c084fc" }}>
                      Room {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-lg font-bold text-white leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {room.title}
                    </h3>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={
                      room.isPlaying
                        ? { background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.30)", color: "#d8b4fe" }
                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#71717a" }
                    }
                  >
                    {room.isPlaying ? "🟢 Playing" : "⏸ Paused"}
                  </span>
                </div>
                <div className="h-px mb-3" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="flex items-center justify-between text-xs" style={{ color: "rgba(161,153,195,0.55)" }}>
                  <span className="font-mono tracking-wider">#{room.roomKey}</span>
                  <span>{room.participants?.length || 0} participants</span>
                </div>
                <p className="mt-2 text-xs" style={{ color: "rgba(161,153,195,0.45)" }}>
                  Host: {room.host?.name || "You"}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Dashboard;
