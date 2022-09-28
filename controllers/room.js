import Room from "../model/room.js";

export const getRooms = async (req, res) => {
  //All the rooms that includes the current user's id
  const { id } = req.params;

  // const chatRooms = await Room.find({
  //   users: {
  //     $in: [id],
  //   },
  // }).sort({ updatedAt: -1 });
  // .populate("users latestMessage");

  const chatRooms = await Room.find({
    users: {
      $all: [id],
    },
  });

  if (!chatRooms) {
    return res.status(200).send({ message: `No data` });
  }

  res.json(chatRooms);
};
export const getRoom = async (req, res) => {
  const { id } = req.params;

  const chatRoom = await Room.findOne({roomId: id});

  if (!chatRoom) {
    return res.status(200).send({ message: `No data` });
  }

  res.json(chatRoom);
};

export const createRoom = async (req, res) => {
  const { mentorId, image, groupName } = req.body;

  const roomId = mentorId + "-" + groupName;
  const roomExists = await Room.findOne({
    roomId: roomId,
  });

  if (roomExists)
    return res.status(400).json({ message: "Room already exists" });

  const room = await Room.create({
    users: [mentorId],
    roomId: roomId,
    roomName: groupName,
    users__profile: [],
    adminId: mentorId,
    image: image,
    isGroup: true,
    latestMsg: {
      msg: "",
    },
  });

  res.status(200).json(room);
};

// export const getRooms = async (req, res) => {
//   const { id } = req.params;

//   const chatRoom = await Room.find({
//     users: {
//       $in: [id],
//     },
//   }).sort({ updatedAt: -1 });
//   // .populate("users latestMessage");

//   console.log(chatRoom);

//   if (!chatRoom) {
//     return res.status(400).send({ message: `chatRooms ID ${id} not found` });
//   }

//   // chatRoom.chatRooms.push({
//   //   ...chatData,
//   //   id: Math.floor(Math.random() * 100) * 149126400,
//   //   createdAt: new Date().toISOString(),
//   // });

//   const updatedChat = await Room.findByIdAndUpdate(chatRoom._id, chatRoom, {
//     new: true,
//   });

//   console.log(updatedChat);

//   res.json(updatedChat);
// };
