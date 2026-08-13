const MessageBubble = ({ message, isSelf, onImageClick }) => {
  const senderName = isSelf ? "You" : message.sender?.name || "Member";
  const senderInitial = senderName?.slice(0, 1)?.toUpperCase() || "M";

  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] flex-col gap-2 ${isSelf ? "items-end" : "items-start"}`}>
        <div className={`flex items-center gap-2 ${isSelf ? "flex-row-reverse" : ""}`}>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-[10px] font-bold text-white shadow-glow">
            {senderInitial}
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">{senderName}</p>
        </div>
        <div
          className={`rounded-3xl px-4 py-3 text-sm shadow-lg ${
            isSelf
              ? "rounded-br-md bg-brand-500 text-white"
              : "rounded-bl-md border border-white/10 bg-white/5 text-zinc-100"
          }`}
        >
          {message.message && <p className="whitespace-pre-wrap leading-relaxed">{message.message}</p>}
          {message.image && (
            <button
              type="button"
              onClick={() => onImageClick?.(message.image)}
              className="mt-2 overflow-hidden rounded-2xl border border-white/10"
            >
              <img src={message.image} alt="Shared" className="max-h-72 w-full object-cover" />
            </button>
          )}
          <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/50">
            {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
