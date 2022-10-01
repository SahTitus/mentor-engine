import Room from "../model/room.js";
import Mentor from "../model/mentor.js";
import Message from "../model/message.js";
import User from "../model/user.js";
import mongoose from "mongoose";

export const getMessages = async (req, res) => {
  const roomId = req.params.id

  if (!roomId) {
    return res.status(400).json({ error: "Room id is required" });
  }

  try {
    const messages = await Message.find({ roomId });

    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  const { senderId, recipientId, type, message, roomDbId, senderName, mentor } = req.body.chatData;
  const { id } = req.params;
  const roomId = id;

  try {
    const roomExists = await Room.findOne({
      roomId: roomId,
    });

    if (!roomExists) {
      //Look for those users and add their info to the chatRoom

      const users = await User.find({
       _id:{ $in: [senderId, recipientId]},
      });

      await Room.create({
        roomId: roomId,
        users: [senderId, recipientId],
        type: type,
        users__profile: users,
        latestMsg: {
          msg: message,
          createdAt: new Date().toISOString(),
        } 
      });
    }

    const newMessage = await Message.create({
      message: message,
      image: "",
      senderId: senderId,
      recipientId: recipientId,
      senderName: senderName,
      roomId: roomId,
    });

    roomExists.latestMsg={
      msg: message,
      createdAt: new Date().toISOString(),
      
    },
    await Room.findByIdAndUpdate(roomDbId, roomExists, { new: true });

    return res.status(200).json(newMessage);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  const message = await Message.findOne({ _id: id }).exec();
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `message ID ${id} not found` });

  await message.deleteOne({ _id: id });
  res.json({ message: "message deleted successfully" });
};