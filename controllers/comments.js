import Comment from "../model/comment.js";
import mongoose from "mongoose";

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { commentData, postId, commentsId } = req.body;

  const comments = await Comment.findOne({ postId: postId }).exec();

  if (!comments) {
    // if (!postId) return res.status(400).send({ message: `Comment ID ${id} not found` });
    const comments = {
      ...commentData,
      id: Math.floor(Math.random() * 100) * 149126400,
      creator: req.userId,
      createdAt: new Date().toISOString(),
    };
    try {
     
      const result = await Comment.create({ comments, postId: postId });
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
    }
  } else {
    const comment = await Comment.findOne({ postId: postId }).exec();

    if (!comment) return res.status(400).send({ message: `Comment ID ${id} not found` });

    comment.comments.push({
      ...commentData,
      id: Math.floor(Math.random() * 100) * 149126400,
      createdAt: new Date().toISOString(),
    });
  
    const updatedComment = await Comment.findByIdAndUpdate(commentsId, comment, {
      new: true,
    });
  
    res.json(updatedComment);
  }

  
};

// export const updateComments = async (req, res) => {
//   const { id } = req.params;
//   const { commentData, postId } = req.body;
//   console.log(Math.floor(Math.random() * 100) * 149126400);

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(400).send({ message: `Comment ID ${id} not found` });

//   const comment = await Comment.findOne({ postId: postId }).exec();

//   comment.comments.push({
//     ...commentData,
//     id: Math.floor(Math.random() * 100) * 149126400,
//     createdAt: new Date().toISOString(),
//   });

//   const updatedComment = await Comment.findByIdAndUpdate(id, comment, {
//     new: true,
//   });

//   res.json(updatedComment);
// };

export const getComment = async (req, res) => {
  const commentId = req?.params?.id;
  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required." });
  }
  const comment = await Comment.findOne({ postId: commentId }).exec();
  if (!comment) {
    return res
      .status(201)
      .json({ message: `No comments yet on post id ${commentId}` });
  }
  res.json(comment);
};


export const likeComment = async (req, res) => {
  const { id } = req.params;
  const { commentId } = req.body;

  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `Comment ID ${id} not found` });

  const comment = await Comment.findOne({ _id: id }).exec();

  const foundComment = comment.comments.find(
    (comment) => comment.id === commentId
  );

  if (!foundComment)
  return res.status(400).send({ message: `Comment ID ${commentId} not found` });

  const index = foundComment.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    foundComment.likes.push(req.userId);
  } else {
    foundComment.likes = foundComment.likes.filter(
      (id) => id !== String(req.userId)
    );
  }

  const updatedComment = await Comment.findByIdAndUpdate(id, comment, {
    new: true,
  });

  res.json(updatedComment);
};

// export const updateMycomment = async (req, res) => {
//   const { id } = req.params;
//   const commentBody = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(400).send({ message: `Comment ID ${id} not found` });

//   const comment = await Comment.findOne({ _id: id }).exec();

//   if (comment) comment = commentBody;

//   const updatedComment = await comment.save();

//   res.json(updatedComment);
// };
