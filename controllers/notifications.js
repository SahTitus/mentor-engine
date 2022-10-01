import Notification from "../model/notification.js";
import Mentor from "../model/mentor.js";
import User from "../model/user.js";
import Room from "../model/room.js";
import mongoose from "mongoose";

export const getNotifications = async (req, res) => {
  const { id } = req.params;

  const notifications = await Notification.find({
    users: {
      $all: [id],
    },
  });
  if (!notifications) {
    return res.status(204).json({ message: "No notifications found" });
  }

  res.json(notifications);
};

export const deleteRequest = async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOne({ _id: id }).exec();
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `Notification ID ${id} not found` });

  await notification.deleteOne({ _id: id });
  res.json({ message: "Notification deleted successfully" });
};

export const sendRequest = async (req, res) => {
  const notification = req.body;
  const id = notification.mentorId;
  const userId = notification.requestId;

  const mentor = await Mentor.findById(id);

  const index = mentor.pendingMentees.findIndex(
    (menteeId) => menteeId === String(userId)
  );

  if (index === -1) {
    mentor.pendingMentees.push(userId);
  } else {
    mentor.pendingMentees = mentor.pendingMentees.filter(
      (menteeId) => menteeId !== String(userId)
    );
  }

  const updatedMentor =await Mentor.findByIdAndUpdate(id, mentor, {
    new: true,
  });

  const result = await Notification.create({
    ...notification,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(updatedMentor);
};

export const cancelRequest = async (req, res) => {
  const ids = req.body;
  const id = ids.mentorId;
  const userId = ids.requestId;

  const mentor = await Mentor.findById(id);

  const index = mentor.pendingMentees.findIndex(
    (menteeId) => menteeId === String(userId)
  );

  if (index === -1) {
    mentor.pendingMentees.push(userId);
  } else {
    mentor.pendingMentees = mentor.pendingMentees.filter(
      (menteeId) => menteeId !== String(userId)
    );
  }

  await Mentor.findByIdAndUpdate(id, mentor, {
    new: true,
  });
};

export const acceptRequest = async (req, res) => {
  const { mentorId, adminId, menteeId, notificationId } = req.body;

  const mentor = await Mentor.findById(mentorId);
  const mentee = await User.findById(menteeId);
  const notification = await Notification.findById(notificationId);
  const room = await Room.findOne({adminId: adminId});


  const mentorRooms = await Room.find({
    adminId: {
      $all: [adminId],
    },
  });




  const index = mentor.mentees.findIndex((id) => id === String(menteeId));

  if (index === -1) {
    mentor.mentees.push(menteeId);
    mentee.mentors.push(mentorId);
    mentorRooms.map(room => room.users.push(menteeId))
    mentor.pendingMentees = mentor.pendingMentees.filter(
      (id) => id !== String(menteeId)
    );
    if (notificationId) notification.connected = true;
  } else {
    mentor.mentees = mentor.mentees.filter((id) => id !== String(menteeId));
    mentee.mentors = mentee.mentors.filter((id) => id !== mentorId);
    if (notificationId) notification.connected = false;
  }

  const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, mentor, {
    new: true,
  });

  mentorRooms.map(async(room )=> {
    await Room.findByIdAndUpdate(room._id, room, {
      new: true,
    });
  })
  await User.findByIdAndUpdate(menteeId, mentee, {
    new: true,
  });

  if (notificationId) {
    const updatedNoti = await Notification.findByIdAndUpdate(
      notificationId,
      notification,
      {
        new: true,
      }
    );

    res.json(updatedNoti);
  } else {
    res.json(updatedMentor);
  }
};
