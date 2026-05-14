import User from "../models/User.js";

const buildUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const searchUsers = async (req, res) => {
  const q = req.query.q || "";

  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } }
    ]
  }).limit(20);

  res.json({ users: users.map(buildUser) });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
};

