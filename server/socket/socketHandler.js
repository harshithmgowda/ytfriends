import Message from "../models/Message.js";
import Room from "../models/Room.js";
import { encryptMessage } from "../utils/encrypt.js";
import { decryptMessage } from "../utils/decrypt.js";

const socketHandler = (io) => {
  const roomState = new Map();

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join-room", async ({ roomId, user }) => {
      if (!roomId) return;
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.user = user;

      const room = await Room.findOne({ roomKey: roomId }).populate("host", "name email");
      if (room) {
        socket.emit("room-state", {
          roomId: room.roomKey,
          roomKey: room.roomKey,
          videoUrl: room.videoUrl,
          currentTime: room.currentTime,
          isPlaying: room.isPlaying,
          hostId: room.host?._id?.toString() || room.host?.toString()
        });
      }

      socket.to(roomId).emit("user-joined", {
        user,
        socketId: socket.id
      });
    });

    socket.on("leave-room", ({ roomId }) => {
      if (roomId) {
        socket.leave(roomId);
      }
    });

    socket.on("send-message", async (data, callback) => {
      try {
        const encryptedText = encryptMessage(data.message || "");
        const encryptedImage = data.image ? encryptMessage(data.image) : "";

        const newMessage = await Message.create({
          sender: data.sender,
          receiver: data.receiver,
          roomId: data.roomId,
          encryptedText,
          encryptedImage
        });

        const payload = {
          _id: newMessage._id,
          sender: data.sender,
          receiver: data.receiver,
          roomId: data.roomId,
          message: decryptMessage(encryptedText),
          image: data.image || "",
          createdAt: newMessage.createdAt
        };

        io.to(data.roomId).emit("receive-message", payload);
        if (callback) callback({ ok: true, message: payload });
      } catch (error) {
        if (callback) callback({ ok: false, error: error.message });
      }
    });

    socket.on("video-sync", async (payload) => {
      if (!payload?.roomId) return;

      roomState.set(payload.roomId, payload);

      await Room.findOneAndUpdate(
        { roomKey: payload.roomId },
        {
          $set: {
            videoUrl: payload.videoUrl,
            currentTime: payload.currentTime ?? 0,
            isPlaying: Boolean(payload.isPlaying)
          }
        },
        { new: true }
      );

      socket.to(payload.roomId).emit("sync-update", payload);
    });

    socket.on("request-sync", async ({ roomId }) => {
      if (!roomId) return;
      const cached = roomState.get(roomId);
      if (cached) {
        socket.emit("sync-update", cached);
        return;
      }

      const room = await Room.findOne({ roomKey: roomId });
      if (room) {
        socket.emit("sync-update", {
          roomId: room.roomKey,
          videoUrl: room.videoUrl,
          currentTime: room.currentTime,
          isPlaying: room.isPlaying
        });
      }
    });

    socket.on("typing", ({ roomId, user, isTyping }) => {
      if (roomId) {
        socket.to(roomId).emit("typing", { user, isTyping });
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected", socket.id);
    });
  });
};

export default socketHandler;

