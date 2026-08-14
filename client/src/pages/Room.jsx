import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import MessageBubble from "../components/MessageBubble";
import VideoPlayer, { getYouTubeId } from "../components/VideoPlayer";
import socket from "../socket/socket";
import { AuthContext } from "../context/AuthContext";

const Room = () => {
  const { roomKey } = useParams();
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const playerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isHost = useMemo(() => room?.host?._id === user?._id, [room, user]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const loadRoom = async () => {
    try {
      const { data } = await API.get(`/rooms/${roomKey}`);
      setRoom(data.room);
      setVideoUrl(data.room.videoUrl || videoUrl);
      setCurrentTime(data.room.currentTime || 0);
      setIsPlaying(Boolean(data.room.isPlaying));
    } catch {
      setRoom({ roomKey, title: "Watch Together", host: user, participants: [user], videoUrl, currentTime, isPlaying });
    }
  };

  const loadMessages = async () => {
    try {
      const { data } = await API.get(`/messages/room/${roomKey}`);
      setMessages(data.messages || []);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadRoom();
    loadMessages();
    socket.emit("join-room", { roomId: roomKey, user });

    const onSync = (payload) => {
      if (payload.roomId !== roomKey || !playerRef.current) return;
      const nextVideoId = getYouTubeId(payload.videoUrl || videoUrl);
      playerRef.current.loadVideoById(nextVideoId, payload.currentTime || 0);
      if (payload.isPlaying) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
      setVideoUrl(payload.videoUrl || videoUrl);
      setCurrentTime(payload.currentTime || 0);
      setIsPlaying(Boolean(payload.isPlaying));
    };

    const onMessage = (data) => {
      if (data.roomId === roomKey) {
        setMessages((prev) => (prev.some((item) => item._id === data._id) ? prev : [...prev, data]));
      }
    };

    socket.on("sync-update", onSync);
    socket.on("room-state", onSync);
    socket.on("receive-message", onMessage);

    return () => {
      socket.off("sync-update", onSync);
      socket.off("room-state", onSync);
      socket.off("receive-message", onMessage);
    };
  }, [roomKey]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const onReady = (event) => {
    playerRef.current = event.target;
    if (currentTime > 0) event.target.seekTo(currentTime, true);
    if (isPlaying) event.target.playVideo();
  };

  const broadcastState = async (nextPlaying = isPlaying, overrideUrl = videoUrl) => {
    if (!playerRef.current) return;
    const time = playerRef.current.getCurrentTime();
    setCurrentTime(time);
    setIsPlaying(nextPlaying);
    await API.put(`/rooms/${roomKey}/state`, { videoUrl: overrideUrl, currentTime: time, isPlaying: nextPlaying, title: room?.title });
    socket.emit("video-sync", { roomId: roomKey, videoUrl: overrideUrl, currentTime: time, isPlaying: nextPlaying });
  };

  const applyVideoUrl = async () => {
    if (!isHost) return;
    const nextId = getYouTubeId(videoUrl);
    if (playerRef.current) playerRef.current.loadVideoById(nextId, 0);
    setVideoUrl(nextId);
    await broadcastState(false, nextId);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const { data } = await API.post("/messages/send", { roomId: roomKey, message: message.trim(), receiver: null });
      if (data?.message) {
        setMessages((prev) => (prev.some((item) => item._id === data.message._id) ? prev : [...prev, data.message]));
      }
      setMessage("");
    } catch {
      socket.emit("send-message", { roomId: roomKey, sender: user?._id, receiver: null, message: message.trim() });
      setMessage("");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 space-y-5">
      {/* Room header */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="ui-hero relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 h-48 w-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.20), transparent 70%)", filter: "blur(36px)", transform: "translate(30%, -30%)" }}
        />
        <div className="relative z-10 grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:p-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <p className="ui-section-label">Private watch room</p>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{
                  background: isPlaying ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
                  border: isPlaying ? "1px solid rgba(34,197,94,0.30)" : "1px solid rgba(255,255,255,0.08)",
                  color: isPlaying ? "#86efac" : "#71717a"
                }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-zinc-500"}`}
                />
                {isPlaying ? "Live" : "Paused"}
              </span>
            </div>
            <h1
              className="text-2xl font-bold text-white sm:text-3xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
            >
              {room?.title || "Watch Together"}
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: "rgba(161,153,195,0.65)" }}>
              Room key:{" "}
              <span className="font-mono font-semibold" style={{ color: "#c084fc" }}>{roomKey}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <div className="ui-stat text-center px-6">
              <p className="ui-stat-label">People</p>
              <p className="ui-stat-value text-xl">{room?.participants?.length || 0}</p>
            </div>
            <div className="ui-stat text-center px-6">
              <p className="ui-stat-label">Mode</p>
              <p
                className="ui-stat-value text-xl"
                style={isHost ? {
                  background: "linear-gradient(90deg, #c084fc, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                } : { color: "#93c5fd" }}
              >
                {isHost ? "Host" : "Guest"}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main layout: chat left, video right */}
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        {/* Chat panel */}
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="overflow-hidden rounded-3xl flex flex-col"
          style={{
            background: "rgba(8,6,18,0.85)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.30)",
            height: "calc(100vh - 280px)",
            minHeight: "480px"
          }}
        >
          <div
            className="px-5 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(168,85,247,0.04)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Live Chat
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "rgba(161,153,195,0.55)" }}>
                  Everyone in the room
                </p>
              </div>
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ background: "#a855f7", boxShadow: "0 0 8px rgba(168,85,247,0.8)" }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingMessages && (
              <div className="flex items-center gap-2 text-sm py-4" style={{ color: "rgba(161,153,195,0.50)" }}>
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Loading chat...
              </div>
            )}
            {!loadingMessages && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
                <span className="text-2xl">💬</span>
                <p className="text-xs" style={{ color: "rgba(161,153,195,0.45)" }}>No messages yet.</p>
              </div>
            )}
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id || msg.createdAt}
                message={msg}
                isSelf={String(msg.sender?._id || msg.sender) === String(user?._id)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div
            className="p-3 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="ui-input flex-1 text-sm py-2.5"
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className="ui-button-primary px-4 py-2.5 text-sm shrink-0">
                ↑
              </button>
            </div>
          </div>
        </motion.section>

        {/* Video panel */}
        <motion.section
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="overflow-hidden rounded-3xl"
          style={{
            background: "rgba(8,6,18,0.85)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.30)",
            padding: "16px"
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Video player
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "rgba(161,153,195,0.55)" }}>
                {isPlaying ? "▶ Playing" : "⏸ Paused"} · {room?.participants?.length || 0} watching
              </p>
            </div>
            {isHost && (
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(59,130,246,0.12))",
                  border: "1px solid rgba(168,85,247,0.30)",
                  color: "#d8b4fe"
                }}
              >
                🎮 Host controls
              </span>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl">
            <VideoPlayer videoUrl={videoUrl} onReady={onReady} />
          </div>

          {isHost && (
            <div className="mt-4">
              <p className="ui-section-label mb-3">Host controls</p>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="ui-input flex-1 text-sm"
                  placeholder="YouTube URL or video ID"
                />
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => broadcastState(true, videoUrl)} className="ui-button-primary text-sm px-4 py-2.5">
                    ▶ Play
                  </button>
                  <button onClick={() => broadcastState(false, videoUrl)} className="ui-button-ghost text-sm px-4 py-2.5">
                    ⏸
                  </button>
                  <button onClick={applyVideoUrl} className="ui-button-secondary text-sm px-4 py-2.5">
                    Load
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default Room;
