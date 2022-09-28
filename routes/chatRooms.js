import express from "express";
import {
createRoom,
getRooms,
getRoom,
} from "../controllers/room.js";

const router = express.Router();

router.route("/:id").get(getRooms);
router.route("/createRoom").post(createRoom);
router.route("/:id/getRoom").get(getRoom);
// router.route("/:id").delete(removeMentee);

export default router;
