import crypto from "crypto";
import Room from "../models/Room.js";

const generateRoomKey = () => crypto.randomBytes(4).toString("hex").toUpperCase();

const buildRoomResponse = (room) => ({
  _id: room._id,
  roomKey: room.roomKey,
  title: room.title,
  host: room.host,
  participants: room.participants,
  videoUrl: room.videoUrl,
  currentTime: room.currentTime,
  isPlaying: room.isPlaying,
  createdAt: room.createdAt,
  updatedAt: room.updatedAt
});

export const createRoom = async (req, res) => {
  const { title, videoUrl } = req.body;

  let roomKey = generateRoomKey();
  let exists = await Room.findOne({ roomKey });
  while (exists) {
    roomKey = generateRoomKey();
    exists = await Room.findOne({ roomKey });
  }

  const room = await Room.create({
    roomKey,
    title: title || `${req.user.name}'s Watch Room`,
    host: req.user._id,
    participants: [req.user._id],
    videoUrl: videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  });

  res.status(201).json({ room: buildRoomResponse(room) });
};

export const joinRoom = async (req, res) => {
  const { roomKey } = req.body;

  if (!roomKey) {
    return res.status(400).json({ message: "roomKey is required" });
  }

  const room = await Room.findOne({ roomKey }).populate("host", "name email avatar").populate("participants", "name email avatar");
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const alreadyParticipant = room.participants.some((participant) => participant._id?.toString() === req.user._id.toString());
  if (!alreadyParticipant) {
    room.participants.push(req.user._id);
    await room.save();
  }

  res.json({ room: buildRoomResponse(room) });
};

export const getRoomByKey = async (req, res) => {
  const room = await Room.findOne({ roomKey: req.params.roomKey }).populate("host", "name email avatar").populate("participants", "name email avatar");

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  res.json({ room: buildRoomResponse(room) });
};

export const getMyRooms = async (req, res) => {
  const rooms = await Room.find({
    $or: [{ host: req.user._id }, { participants: req.user._id }]
  })
    .sort({ updatedAt: -1 })
    .populate("host", "name email avatar");

  res.json({ rooms: rooms.map(buildRoomResponse) });
};

export const updateRoomState = async (req, res) => {
  const { roomKey } = req.params;
  const { videoUrl, currentTime, isPlaying, title } = req.body;

  const room = await Room.findOne({ roomKey });
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  if (room.host.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the host can update the room" });
  }

  if (typeof title === "string") room.title = title;
  if (typeof videoUrl === "string") room.videoUrl = videoUrl;
  if (typeof currentTime === "number") room.currentTime = currentTime;
  if (typeof isPlaying === "boolean") room.isPlaying = isPlaying;

  await room.save();

  res.json({ room: buildRoomResponse(room) });
};

export const leaveRoom = async (req, res) => {
  const { roomKey } = req.body;
  const room = await Room.findOne({ roomKey });

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  room.participants = room.participants.filter((id) => id.toString() !== req.user._id.toString());
  await room.save();

  res.json({ message: "Left room" });
};

