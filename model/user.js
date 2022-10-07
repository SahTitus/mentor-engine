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
  image: {
    type: String,
  },
  mentorshipName: String,
  mentorshipDp: String,
  department: String,
  age: String,
  religion: String,
  program: String,
  rationale: String,
});

export default mongoose.model("User", userSchema);
