import express from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { connectDB } from "./config/connectDb.js";
import dotenv from "dotenv";
import credentials from "./middleware/credentials.js";
import mentorRoutes from "./routes/mentors.js";
import messagesRoutes from "./routes/messages.js";
import userRoutes from "./routes/users.js";
import notificationsRoutes from "./routes/notifications.js";
import chatRoomsRoutes from "./routes/chatRooms.js";


const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors(corsOptions));
app.use(credentials);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());



app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/mentors", mentorRoutes);
app.use("/user", userRoutes);
app.use("/rooms", chatRoomsRoutes);
app.use("/messages", messagesRoutes);
app.use("/notifications", notificationsRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected ");
  app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`));
});