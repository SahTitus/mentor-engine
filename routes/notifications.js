import express from "express";
import {
sendRequest,
getNotifications,
deleteRequest,
acceptRequest, 
cancelRequest
} from "../controllers/notifications.js";

const router = express.Router();

router.route("/:id").get(getNotifications);
router.route("/sendRequest").post(sendRequest);
router.route("/acceptRequest").patch(acceptRequest);
router.route("/cancelRequest").patch(cancelRequest); 
router.route("/:id/deleteNotification").delete(deleteRequest);

export default router;