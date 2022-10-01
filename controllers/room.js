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
  const mentor = await Mentor.findOne({
    _id: mentorshipId,
  });

  if (roomExists)
    return res.status(400).json({ message: "Room already exists" });
  const members = mentor.mentees;
  members.push(mentorId);

  const room = await Room.create({
    users: members,
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
