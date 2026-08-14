import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const onMessage = (data) => {
      if (data.roomId === roomId) setMessages((prev) => [...prev, data]);
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
    if (!file) { setImageData(""); return; }
    const reader = new FileReader();
    reader.onload = () => setImageData(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const sendMessage = () => {
    if (!message.trim() && !imageData) return;
    socket.emit("send-message", { roomId, sender: user?._id, receiver: null, message: message.trim(), image: imageData }, () => {});
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-3xl flex flex-col"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.30)",
          height: "calc(100vh - 140px)"
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(168,85,247,0.04)" }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="ui-section-label mb-1">Encrypted chat</p>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
              >
                Room chat
              </h1>
              <p className="mt-1 text-sm" style={{ color: "rgba(161,153,195,0.65)" }}>
                Messages are encrypted before storage. Keep the vibe clean.
              </p>
            </div>
            <span
              className="self-start inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium lg:self-auto"
              style={{ background: "rgba(168,85,247,0.10)", border: "1px solid rgba(168,85,247,0.25)", color: "#d8b4fe" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
              Live messages
            </span>
          </div>

          {/* Room switcher */}
          <div className="mt-4 flex gap-3">
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="ui-input flex-1 font-mono uppercase tracking-widest"
              placeholder="ROOM KEY"
              style={{ maxWidth: "240px" }}
            />
            <button onClick={() => loadHistory(roomId)} className="ui-button-secondary shrink-0">
              Switch room
            </button>
          </div>

          {typingUser && (
            <p className="mt-3 flex items-center gap-2 text-sm" style={{ color: "#c084fc" }}>
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
              {typingUser} is typing...
            </p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.10))", border: "1px solid rgba(168,85,247,0.20)" }}
              >
                💬
              </div>
              <p className="text-sm font-medium text-white">No messages yet</p>
              <p className="text-xs" style={{ color: "rgba(161,153,195,0.50)" }}>Say hello to start the conversation.</p>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble
              key={msg._id || msg.createdAt}
              message={msg}
              isSelf={String(msg.sender) === String(user?._id)}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Image preview */}
        {imageData && (
          <div className="px-5 py-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div
              className="inline-flex items-center gap-3 rounded-2xl p-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <img src={imageData} alt="Preview" className="h-14 w-14 rounded-xl object-cover" />
              <div>
                <p className="text-xs font-medium text-white">Image ready to send</p>
                <button
                  onClick={() => setImageData("")}
                  className="mt-1 text-xs transition-colors hover:text-white"
                  style={{ color: "#f87171" }}
                >
                  Remove ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input bar */}
        <div
          className="p-4 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.20)" }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="ui-input text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
              style={{
                background: "rgba(168,85,247,0.06)",
                "--file-button-bg": "#a855f7"
              }}
            />
            <div className="flex flex-1 gap-2">
              <input
                value={message}
                onChange={(e) => onTyping(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="ui-input flex-1"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="ui-button-primary shrink-0 px-5"
                style={{ minWidth: "80px" }}
              >
                Send ↑
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;
