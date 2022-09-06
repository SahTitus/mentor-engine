import express from "express";
import {
  getMentors,
  createMentor,
  getMentor,
  deleteMentor,
  updateMentor,
  likeMentor,
} from "../controllers/Mentors.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getMentors);
router.route("/").post(createMentor);
router.route("/:id").delete(deleteMentor);
router.route("/:id").patch(updateMentor);
router.route("/:id/likeMentor").patch(likeMentor);

router.route("/:id").get(getMentor);

export default router;
