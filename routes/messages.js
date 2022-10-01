import express from "express";
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/messages.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/:id").get(getMessages);
router.route("/:id/sendMessage").post(sendMessage);
router.route("/:id/delete").delete(deleteMessage);

export default router;
