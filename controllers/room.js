import Room from "../model/room.js";
import Mentor from "../model/mentor.js";
import mongoose from "mongoose";

export const getRooms = async (req, res) => {
  //All the rooms that includes the current user's id
  const { id } = req.params;

  const chatRooms = await Room.find({
    users: {
      $all: [id],
    },
  });

  if (!chatRooms) {
    return res.status(200).send({ message: `No data` });
  }

  res.json(chatRooms);
};
export const getRoom = async (req, res) => {
  const { id } = req.params;

  const chatRoom = await Room.findOne({ roomId: id });

  if (!chatRoom) {
    return res.status(200).send({ message: `No data` });
  }

  res.json(chatRoom);
};

export const createRoom = async (req, res) => {
  const { mentorId, mentorshipId, image, groupName } = req.body;

  const roomId = mentorId + "-" + groupName;
  const roomExists = await Room.findOne({
    roomId: roomId,
  });

  if (roomExists)
    return res.status(400).json({ message: "Room already exists" });

  const room = await Room.create({
    users: [mentorId],
    roomId: roomId,
    roomName: groupName,
    users__profile: [],
    adminId: mentorId,
    image: image,
    isGroup: true,
    latestMsg: {
      msg: "",
    },
  });

  res.status(200).json(room);
};

export const memberAction = async (req, res) => {
  const { roomId, memberId, addId } = req.body;

  if (!roomId) return res.status(400).send({ message: `Room ID is required` });

  const room = await Room.findById(roomId);

  const index = room.users.findIndex((id) => id === memberId);

  if (memberId && index !== -1) {
    room.users = room.users.filter((id) => id !== memberId);
  }

  const addIndex = room.users.findIndex((id) => id === addId);

  if (addId && addIndex === -1) {
    room.users.push(addId);
  }

  const updatedRoom = await Room.findByIdAndUpdate(roomId, room, {
    new: true,
  });

  res.json(updatedRoom);
};

export const deleteRoom = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).send({ room: `Room ID is required` });

  const room = await Room.findOne({ roomId: id }).exec();

  await room.deleteOne({ _id: id });
  res.json({ room: "room deleted successfully" });
};

export const updateRoom = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const room = await Room.findOne({ _id: id }).exec();

  room.roomName = body.roomName;
  room.image = body.image;
  room.roomId = `${id}-${room.roomName}`;

  if (!room) {
    return res.status(400).send({ message: `room ID ${id} not found` });
  }

  const updatedRoom = await Room.findByIdAndUpdate(id, room, {
    new: true,
  });

  res.json(updatedRoom);
};
