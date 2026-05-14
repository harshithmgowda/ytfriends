import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import MessageBubble from "../components/MessageBubble";
import socket from "../socket/socket";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRoom = useMemo(() => searchParams.get("room") || "demo-room", [searchParams]);
  const [roomId, setRoomId] = useState(initialRoom);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [imageData, setImageData] = useState("");
  const fileInputRef = useRef(null);

  const loadHistory = async (targetRoom) => {
    try {
      const { data } = await API.get(`/messages/room/${targetRoom}`);
      setMessages(data.messages || []);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    if (!roomId) return;
    setMessages([]);
    socket.emit("join-room", { roomId, user });
    loadHistory(roomId);
    setSearchParams({ room: roomId });
  }, [roomId]);

  useEffect(() => {
    const onMessage = (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    const onTyping = ({ user: typing, isTyping }) => {
      setTypingUser(isTyping ? typing?.name || "Someone" : "");
    };

    socket.on("receive-message", onMessage);
    socket.on("typing", onTyping);

    return () => {
      socket.off("receive-message", onMessage);
      socket.off("typing", onTyping);
    };
  }, [roomId]);

  const handleFile = (file) => {
    if (!file) {
      setImageData("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageData(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const sendMessage = () => {
    if (!message.trim() && !imageData) return;

    socket.emit(
      "send-message",
      {
        roomId,
        sender: user?._id,
        receiver: null,
        message: message.trim(),
        image: imageData
      },
      () => {}
    );

    setMessage("");
    setImageData("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onTyping = (value) => {
    setMessage(value);
    socket.emit("typing", { roomId, user, isTyping: value.length > 0 });
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
      <Sidebar />

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Encrypted chat</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Room chat</h1>
          <p className="mt-2 text-zinc-400">Messages and images are encrypted before storage.</p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="flex-1 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white uppercase outline-none focus:border-brand-500"
              placeholder="Room key"
            />
            <button
              onClick={() => loadHistory(roomId)}
              className="rounded-2xl border border-brand-500/30 bg-brand-500/10 px-5 py-3 font-semibold text-brand-200 transition hover:bg-brand-500 hover:text-white"
            >
              Join room
            </button>
          </div>
          {typingUser && <p className="mt-3 text-sm text-brand-300">{typingUser} is typing...</p>}
        </div>

        <div className="flex h-[calc(100vh-320px)] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((msg) => (
              <MessageBubble key={msg._id || msg.createdAt} message={msg} isSelf={String(msg.sender) === String(user?._id)} />
            ))}
            {messages.length === 0 && <div className="text-zinc-400">No messages yet. Say hello.</div>}
          </div>

          {imageData && (
            <div className="border-t border-white/10 px-6 py-4">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950/80 p-3">
                <img src={imageData} alt="Preview" className="h-16 w-16 rounded-xl object-cover" />
                <button onClick={() => setImageData("")} className="text-sm text-red-300 hover:text-red-200">
                  Remove image
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-white/10 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-400 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <input
                value={message}
                onChange={(e) => onTyping(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none focus:border-brand-500"
                placeholder="Type message"
              />
              <button
                onClick={sendMessage}
                className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

