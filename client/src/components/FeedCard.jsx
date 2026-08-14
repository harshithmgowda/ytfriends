import { motion } from "framer-motion";

const FeedCard = ({ post, onLike }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-3xl"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        backdropFilter: "blur(16px)"
      }}
    >
      {/* Image */}
      {post.image && (
        <div className="relative overflow-hidden h-52">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,5,17,0.80) 0%, rgba(7,5,17,0.20) 50%, transparent 100%)" }} />
          {/* Play overlay hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(168,85,247,0.85)", boxShadow: "0 4px 20px rgba(168,85,247,0.5)" }}
            >
              <span className="text-white text-sm ml-0.5">▶</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              boxShadow: "0 2px 12px rgba(168,85,247,0.35)"
            }}
          >
            {post.author?.name?.slice(0, 1)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{post.author?.name || "Unknown creator"}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(161,153,195,0.60)" }}>
              {post.author?.bio || "WatchParty creator"}
            </p>
          </div>
        </div>

        <h4
          className="text-xl font-bold text-white mb-2 leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {post.title}
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(161,153,195,0.75)" }}>
          {post.content}
        </p>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => onLike?.(post._id)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.20)",
              color: "#d8b4fe"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(168,85,247,0.18)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.40)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(168,85,247,0.08)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.20)";
            }}
          >
            <span>♥</span>
            <span>{post.likes?.length || 0} likes</span>
          </button>
          <span className="text-[11px] uppercase tracking-[0.25em]" style={{ color: "rgba(161,153,195,0.40)" }}>
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default FeedCard;
