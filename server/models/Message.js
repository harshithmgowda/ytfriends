import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    roomId: {
      type: String,
      required: true,
      index: true
    },
    encryptedText: {
      type: String,
      default: ""
    },
    encryptedImage: {
      type: String,
      default: ""
    },
    messageType: {
      type: String,
      enum: ["text", "image", "mixed"],
      default: "text"
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Message", messageSchema);

