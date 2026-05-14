import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
  const isHost = useMemo(() => room?.host?._id === user?._id, [room, user]);

  const loadRoom = async () => {
    try {
      const { data } = await API.get(`/rooms/${roomKey}`);
      setRoom(data.room);
      setVideoUrl(data.room.videoUrl || videoUrl);
      setCurrentTime(data.room.currentTime || 0);
      setIsPlaying(Boolean(data.room.isPlaying));
    } catch {
      setRoom({
        roomKey,
        title: "Watch Together",
        host: user,
        participants: [user],
        videoUrl,
        currentTime,
        isPlaying
      });
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

      if (payload.isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }

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

  const onReady = (event) => {
    playerRef.current = event.target;
    if (currentTime > 0) {
      event.target.seekTo(currentTime, true);
    }
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const broadcastState = async (nextPlaying = isPlaying, overrideUrl = videoUrl) => {
    if (!playerRef.current) return;
    const time = playerRef.current.getCurrentTime();
    setCurrentTime(time);
    setIsPlaying(nextPlaying);

    await API.put(`/rooms/${roomKey}/state`, {
      videoUrl: overrideUrl,
      currentTime: time,
      isPlaying: nextPlaying,
      title: room?.title
    });

    socket.emit("video-sync", {
      roomId: roomKey,
      videoUrl: overrideUrl,
      currentTime: time,
      isPlaying: nextPlaying
    });
  };

  const applyVideoUrl = async () => {
    if (!isHost) return;
    const nextId = getYouTubeId(videoUrl);
    if (playerRef.current) {
      playerRef.current.loadVideoById(nextId, 0);
    }
    setVideoUrl(nextId);
    await broadcastState(false, nextId);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const { data } = await API.post("/messages/send", {
        roomId: roomKey,
        message: message.trim(),
        receiver: null
      });

      if (data?.message) {
        setMessages((prev) => (prev.some((item) => item._id === data.message._id) ? prev : [...prev, data.message]));
      }
      setMessage("");
    } catch {
      socket.emit("send-message", {
        roomId: roomKey,
        sender: user?._id,
        receiver: null,
        message: message.trim()
      });
      setMessage("");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <section className="mb-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-xl shadow-black/20 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Private watch room</p>
        <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-white">{room?.title || "Watch Together"}</h1>
          <p className="text-sm text-zinc-400">
            Room key: <span className="font-semibold text-brand-300">{roomKey}</span>
          </p>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <section className="flex min-h-[calc(100vh-180px)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="border-b border-white/10 p-4">
            <h2 className="text-lg font-semibold text-white">Chat</h2>
            <p className="text-sm text-zinc-400">Simple live chat for everyone in the room.</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {loadingMessages && <p className="text-sm text-zinc-400">Loading chat...</p>}
            {!loadingMessages && messages.length === 0 && <p className="text-sm text-zinc-400">No messages yet.</p>}
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id || msg.createdAt}
                message={msg}
                isSelf={String(msg.sender?._id || msg.sender) === String(user?._id)}
              />
            ))}
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none focus:border-brand-500"
                placeholder="Type a message"
              />
              <button
                onClick={sendMessage}
                className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600"
              >
                Send
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Video</h2>
              <p className="text-sm text-zinc-400">Watch the YouTube video here.</p>
            </div>
            <div className="text-sm text-zinc-400">
              {isPlaying ? "Playing" : "Paused"} • {room?.participants?.length || 0} people
            </div>
          </div>

          <VideoPlayer videoUrl={videoUrl} onReady={onReady} className="rounded-[1.5rem]" />

          {isHost && (
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none focus:border-brand-500"
                placeholder="YouTube URL or ID"
              />
              <button onClick={() => broadcastState(true, videoUrl)} className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600">
                Play
              </button>
              <button onClick={() => broadcastState(false, videoUrl)} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10">
                Pause
              </button>
              <button onClick={applyVideoUrl} className="rounded-2xl border border-brand-500/30 bg-brand-500/10 px-5 py-3 font-semibold text-brand-200 hover:bg-brand-500 hover:text-white">
                Load
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Room;

