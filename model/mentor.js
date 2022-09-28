import mongoose from "mongoose";

const mentorSchema = mongoose.Schema({
  email: String,
  name: String,
  religion: String,
  image: String,
  dbirth: String,
  education: String,
  school: String,
  fieldExp: String,
  password: String, 
  isMentor: Boolean,
  userId: String,
  mentees: {
    type: [String],
    default: [],
  },
  pendingMentees: {
    type: [String],
    default: [],
  },
  
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Mentor", mentorSchema);


