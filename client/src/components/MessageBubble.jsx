const MessageBubble = ({ message, isSelf, onImageClick }) => {
  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm shadow-lg ${
          isSelf
            ? "bg-brand-500 text-white rounded-br-md"
            : "border border-white/10 bg-white/5 text-zinc-100 rounded-bl-md"
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
  );
};

export default MessageBubble;

