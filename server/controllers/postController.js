import Post from "../models/Post.js";

const buildPost = (post) => ({
  _id: post._id,
  title: post.title,
  content: post.content,
  image: post.image,
  author: post.author,
  likes: post.likes,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt
});

export const getFeed = async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", "name avatar bio");

  res.json({ posts: posts.map(buildPost) });
};

export const createPost = async (req, res) => {
  const { title, content, image } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const post = await Post.create({
    title,
    content,
    image: image || "",
    author: req.user._id
  });

  const populated = await post.populate("author", "name avatar bio");
  res.status(201).json({ post: buildPost(populated) });
};

export const toggleLikePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const hasLiked = post.likes.some((like) => like.toString() === req.user._id.toString());
  if (hasLiked) {
    post.likes = post.likes.filter((like) => like.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
  const populated = await post.populate("author", "name avatar bio");

  res.json({ post: buildPost(populated) });
};

