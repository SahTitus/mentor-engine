import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    senderName: {
        type: String,

    },
    recipientId: {
        type: String,

    },
    roomId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Message', messageSchema);