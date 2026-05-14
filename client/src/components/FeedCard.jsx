import { motion } from "framer-motion";

const FeedCard = ({ post, onLike }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20"
    >
      {post.image && <img src={post.image} alt={post.title} className="h-56 w-full object-cover" />}
      <div className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 font-bold text-white">
            {post.author?.name?.slice(0, 1)?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="font-semibold text-white">{post.author?.name || "Unknown creator"}</h3>
            <p className="text-xs text-zinc-400">{post.author?.bio || "WatchParty creator"}</p>
          </div>
        </div>

        <h4 className="text-xl font-semibold text-white">{post.title}</h4>
        <p className="mt-3 leading-relaxed text-zinc-300">{post.content}</p>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => onLike?.(post._id)}
            className="rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-200 transition hover:bg-brand-500 hover:text-white"
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

