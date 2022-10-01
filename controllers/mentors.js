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

export const getMentorsBySearch = async (req, res) => {
  const { searchQuery } = req.query;

try {
  const name = new RegExp(searchQuery, "i");
  const mentors = await Mentor.find({name});

  res.json(mentors);
} catch (error) {
  return res.status(400).json({ message: error.message});
}


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

export const getMentees = async (req, res) => {
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
      userId: user._id,
      creator: req.userId,
      pendingMentees:[],
      createdAt: new Date().toISOString(),
    });

    user.mentorshipName = mentor.name;
    user.mentorshipDp = mentor.image;
    user.isMentor = true;

    await User.findByIdAndUpdate(mentor.id, user, { new: true });

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

  const updatedMentor = await Mentor.findByIdAndUpdate(id, mentorBody, {new: true});

  res.json(updatedMentor);
};

export const deleteMentor = async (req, res) => {
  const { id } = req.params;

  await Mentor.findOne({ _id: id }).exec();
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `mentor ID ${id} not found` });

  await Mentor.deleteOne({ _id: id });
  res.json({ message: "mentor deleted successfully" });
};

export const disConnect = async (req, res) => {
  const {id, menteeId } = req.body;

  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `Mentor ID ${id} not found` });

  const mentor = await Mentor.findById(id);
  const mentee = await User.findById(menteeId);

  const index = mentor.mentees.findIndex((id) => id === menteeId);

  if (index === -1) {
    mentor.mentees.push(req.userId);
    mentee.mentors.push(id);
  } else {
    mentor.mentees = mentor.mentees.filter(
      (menteId) => menteId !== menteeId
    );
    mentee.mentors = mentee.mentors.filter((id) => id !== id);
  }

  const updatedMentor = await Mentor.findByIdAndUpdate(id, mentor, {
    new: true,
  });
  const updatedMentee = await User.findByIdAndUpdate(menteeId, mentee, {
    new: true,
  });

  res.json({updatedMentee, updatedMentor});
};
