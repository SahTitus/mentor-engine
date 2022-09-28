import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  id: String,

  requestId: {
    type: String,
  },
  users: {
    type: [String],
    default: [],
  },
  mentorId: { type: String },
  image: String,
  name: String,
  connected: Boolean,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Notification", notificationSchema);
