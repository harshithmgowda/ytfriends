import { motion } from "framer-motion";

const FeedCard = ({ post, onLike }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="ui-card group"
    >
      {post.image && (
        <div className="relative">
          <img src={post.image} alt={post.title} className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 font-bold text-white shadow-glow">
            {post.author?.name?.slice(0, 1)?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="font-semibold text-white">{post.author?.name || "Unknown creator"}</h3>
            <p className="text-xs text-zinc-400">{post.author?.bio || "WatchParty creator"}</p>
          </div>
        </div>

        <h4 className="text-xl font-semibold text-white">{post.title}</h4>
        <p className="mt-3 leading-relaxed text-zinc-300">{post.content}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => onLike?.(post._id)}
            className="ui-button-secondary px-4 py-2 text-sm"
          >
            Like • {post.likes?.length || 0}
          </button>
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default FeedCard;
