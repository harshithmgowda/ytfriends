import Message from "../models/Message.js";
import Room from "../models/Room.js";
import { encryptMessage } from "../utils/encrypt.js";
import { decryptMessage } from "../utils/decrypt.js";

const buildImageUrl = (req, file) => {
  if (!file) return "";
  return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
};

const serializeMessage = (message) => ({
  _id: message._id,
  sender: message.sender,
  receiver: message.receiver,
  roomId: message.roomId,
  message: decryptMessage(message.encryptedText),
  image: message.encryptedImage ? decryptMessage(message.encryptedImage) : "",
  messageType: message.messageType,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt
});

export const getRoomMessages = async (req, res) => {
  const { roomId } = req.params;
  const messages = await Message.find({ roomId })
    .sort({ createdAt: 1 })
    .populate("sender", "name avatar");

  res.json({ messages: messages.map(serializeMessage) });
};

export const sendMessage = async (req, res) => {
  const { roomId, message = "", receiver = null } = req.body;
  const imageUrl = buildImageUrl(req, req.file);

  if (!roomId) {
    return res.status(400).json({ message: "roomId is required" });
  }

  const hasText = Boolean(message.trim());
  const hasImage = Boolean(imageUrl);

  if (!hasText && !hasImage) {
    return res.status(400).json({ message: "Message text or image is required" });
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    receiver,
    roomId,
    encryptedText: hasText ? encryptMessage(message) : "",
    encryptedImage: hasImage ? encryptMessage(imageUrl) : "",
    messageType: hasText && hasImage ? "mixed" : hasImage ? "image" : "text"
  });

  await Room.findOneAndUpdate({ roomKey: roomId }, { $addToSet: { participants: req.user._id } });

  res.status(201).json({ message: serializeMessage(newMessage) });
};

