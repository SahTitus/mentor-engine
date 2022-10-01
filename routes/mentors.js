import express from "express";
import {
  getMentors,
  createMentor,
  getMentor,
  deleteMentor,
  updateMentor,
  disConnect,
  getMentees,
  getMentorsBySearch,
} from "../controllers/mentors.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getMentors);
router.route("/search").get(getMentorsBySearch);
router.route("/").post(createMentor);
router.route("/:id").delete(deleteMentor);
router.route("/:id/update").patch(updateMentor);
router.route("/disConnect").patch(auth, disConnect);

router.route("/:id").get(getMentor);
router.route("/:id/mentees").get(getMentees);

export default router;
