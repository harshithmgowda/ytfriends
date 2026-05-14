import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomKey: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Watch Room"
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    videoUrl: {
      type: String,
      default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    currentTime: {
      type: Number,
      default: 0
    },
    isPlaying: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Room", roomSchema);

