import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  postId: { type: "String", required: true },
  comments: {
    type: [Object],
    id: String,
    creatorName: String,
    userDp: String,
    comment: String,
    image: String,
    likes: {
      type: [String],
      default: [],
    },
    replies: {
      type: [Object],
      id: String,
      creatorName: String,
      userDp: String,
      image: String,
      reply: String,
      likes: {
        type: [String],
        default: [],
      },
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
