import mongoose from "mongoose";

const mentorSchema = mongoose.Schema({
  email: String,
  fullName: String,
  religion: String,
  image: String,
  dbirth: String,
  education: String,
  school: String,
  fieldExp: String,
  password: String, 
  isMentor: Boolean,
  likes: {
    type: [String],
    default: [],
  },
  
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Mentor", mentorSchema);


