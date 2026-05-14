import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
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

  useEffect(() => {
    loadRoom();
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

    socket.on("sync-update", onSync);
    socket.on("room-state", onSync);

    return () => {
      socket.off("sync-update", onSync);
      socket.off("room-state", onSync);
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

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
      <Sidebar />

      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Private watch room</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{room?.title || "Watch Together 🎬"}</h1>
          <p className="mt-2 text-zinc-400">Room key: <span className="font-semibold text-brand-300">{roomKey}</span></p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <VideoPlayer videoUrl={videoUrl} onReady={onReady} className="rounded-[1.5rem]" />

            {isHost && (
              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none focus:border-brand-500"
                  placeholder="YouTube URL or ID"
                />
                <button onClick={() => broadcastState(true, videoUrl)} className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600">
                  Play
                </button>
                <button onClick={() => broadcastState(false, videoUrl)} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10">
                  Pause
                </button>
                <button onClick={applyVideoUrl} className="rounded-2xl border border-brand-500/30 bg-brand-500/10 px-5 py-3 font-semibold text-brand-200 hover:bg-brand-500 hover:text-white">
                  Load video
                </button>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Room details</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
                <p className="text-zinc-500">Status</p>
                <p className="mt-1 text-lg font-semibold text-white">{isPlaying ? "Playing" : "Paused"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
                <p className="text-zinc-500">Host</p>
                <p className="mt-1 text-lg font-semibold text-white">{room?.host?.name || "You"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
                <p className="text-zinc-500">Participants</p>
                <p className="mt-1 text-lg font-semibold text-white">{room?.participants?.length || 0}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4 text-sm text-brand-100">
              Open the chat tab in another panel or browser window for live conversation while the room syncs.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Room;

