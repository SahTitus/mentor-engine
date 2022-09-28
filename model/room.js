import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  id: String,
  roomId: {
    type: String,
    required: true,
  },
  adminId: {
    type: String,
  },
  users: {
    type: [String],
    default: [],
  },
  isGroup: Boolean,
  image: String,
  roomName: String,
  users__profile: {
    type: [Object],
    id: { type: "String",  },
    name: { type: "String",  },
    image: { type: "String" },
  },
  latestMsg:  {
    type: Object,
    msg: { type: "String",  },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Room", roomSchema);
