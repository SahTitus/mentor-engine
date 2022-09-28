import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: "String", required: true },
  email: { type: "String", required: true },
  password: { type: "String", required: true },
  isMentor: Boolean,
  mentors: {
    type: [String],
    default: [],
  },
  id: { type: "String" },
  image: String,
  mentorshipName: String,
  mentorshipDp: String,
});

export default mongoose.model("User", userSchema);
