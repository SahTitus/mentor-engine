import Mentor from "../model/mentor.js";
import User from "../model/user.js";
import mongoose from "mongoose";

export const getMentors = async (req, res) => {
  const mentors = await Mentor.find();
  if (!mentors) {
    return res.status(204).json({ message: "No mentors found" });
  }
  res.json(mentors);
};

export const getMentor = async (req, res) => {
  const mentorId = req?.params?.id;
  if (!mentorId) {
    return res.status(400).json({ message: "Mentor ID is required." });
  }
  const mentor = await Mentor.findOne({ _id: mentorId }).exec();
  if (!mentor) {
    return res.status(400).json({ message: `Mentor ID ${mentorId} not found` });
  }
  res.json(mentor);
};

export const createMentor = async (req, res) => {
  const mentor = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(mentor.id))
    return res.status(400).send({ message: `User ID ${id} not found` });

    const user = await User.findOne({ _id: mentor.id }).exec();

    const result = await Mentor.create({
      ...mentor,
      creator: req.userId,
      createdAt: new Date().toISOString(),
    });

user.isMentor = true


  const updatedUser = await User.findByIdAndUpdate(mentor.id, user, { new: true });
  console.log(updatedUser)


    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

export const updateMentor = async (req, res) => {
  const { id } = req.params;
  const mentorBody = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `Mentor ID ${id} not found` });

  const mentor = await Mentor.findOne({ _id: id }).exec();

  if (mentor) mentor = mentorBody;

  const updatedMentor = await Mentor.save();

  res.json(updatedMentor);
};

export const deleteMentor = async (req, res) => {
  const { id } = req.params;
  console.log("Eko o");

   await Mentor.findOne({ _id: id }).exec();
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `mentor ID ${id} not found` });

  await Mentor.deleteOne({ _id: id });
  res.json({ message: "mentor deleted successfully" });
};

export const likeMentor = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `Mentor ID ${id} not found` });

  const mentor = await Mentor.findById(id);

  const index = Mentor.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    Mentor.likes.push(req.userId);
  } else {
    Mentor.likes = Mentor.likes.filter((id) => id !== String(req.userId));
  }

  const updatedMentor = await Mentor.findByIdAndUpdate(id, mentor, { new: true });

  res.json(updatedMentor);
};
