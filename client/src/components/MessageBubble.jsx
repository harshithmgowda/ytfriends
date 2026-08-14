const MessageBubble = ({ message, isSelf, onImageClick }) => {
  const senderName = isSelf ? "You" : message.sender?.name || "Member";
  const senderInitial = senderName?.slice(0, 1)?.toUpperCase() || "M";

  return (
    <div className={`flex gap-2.5 ${isSelf ? "justify-end" : "justify-start"}`}>
      {!isSelf && (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white self-end"
          style={{
            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            boxShadow: "0 2px 10px rgba(168,85,247,0.35)"
          }}
        >
          {senderInitial}
        </div>
      )}

      <div className={`flex max-w-[75%] flex-col gap-1 ${isSelf ? "items-end" : "items-start"}`}>
        <p className="text-[11px] font-medium px-1" style={{ color: "rgba(161,153,195,0.55)" }}>
          {senderName}
        </p>

        <div
          className="rounded-2xl px-4 py-3 text-sm shadow-lg"
          style={
            isSelf
              ? {
                  background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                  boxShadow: "0 4px 20px rgba(168,85,247,0.30)",
                  borderBottomRightRadius: "4px",
                  color: "#fff"
                }
              : {
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  borderBottomLeftRadius: "4px",
                  color: "#e4e0f0"
                }
          }
        >
          {message.message && (
            <p className="whitespace-pre-wrap leading-relaxed">{message.message}</p>
          )}
          {message.image && (
            <button
              type="button"
              onClick={() => onImageClick?.(message.image)}
              className="mt-2 overflow-hidden rounded-xl border border-white/10 block"
            >
              <img src={message.image} alt="Shared" className="max-h-60 w-full object-cover" />
            </button>
          )}
          <div
            className="mt-1.5 text-[10px] font-medium uppercase tracking-widest"
            style={{ color: isSelf ? "rgba(255,255,255,0.45)" : "rgba(161,153,195,0.40)" }}
          >
            {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {isSelf && (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white self-end"
          style={{
            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            boxShadow: "0 2px 10px rgba(168,85,247,0.35)"
          }}
        >
          {senderInitial}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
