const { Op } = require("sequelize");
const Message = require("../models/Message");
const User = require("../models/User");
const sequelize = require("../config/db");

// ======================
// Send Message
// ======================
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, message, replyTo } = req.body;

    console.log("BODY:", req.body);
    console.log("replyTo:", replyTo);

    const sender = Number(req.user.id);
    const receiverId = Number(receiver);

    if (!receiver || !message) {
      return res.status(400).json({
        message: "Receiver and message are required",
      });
    }

    const receiverUser = await User.findByPk(receiverId);

    if (!receiverUser) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const newMessage = await Message.create({
      sender,
      receiver: receiverId,
      message,
      replyTo: replyTo || null,
    });

    const createdMessage = await Message.findByPk(newMessage.id, {
  include: [
    {
      model: Message,
      as: "ReplyMessage",
      required: false,
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "username"],
        },
      ],
    },
  ],
});

// 👇 Return this
return res.status(201).json({
  message: "Message sent successfully",
  data: createdMessage,
});

  } catch (err) {
  console.error("SEND MESSAGE ERROR");
  console.error(err);
  console.error(err.message);
  console.error(err.parent);
  console.error(err.original);

  return res.status(500).json({
    success: false,
    error: err.message,
  });
}
};

// ======================
// Upload Message (File)
// ======================
exports.uploadMessage = async (req, res) => {
  try {
    const sender = Number(req.user.id);
    const receiver = Number(req.body.receiver);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    let type = "file";

    if (req.file.mimetype.startsWith("image/")) {
      type = "image";
    } else if (req.file.mimetype.startsWith("video/")) {
      type = "video";
    } else if (req.file.mimetype.startsWith("audio/")) {
      type = "audio";
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      message: null,
      type,
      fileName: req.file.originalname,
      fileUrl: "/uploads/chat/" + req.file.filename,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ======================
// Get Conversation (FIXED)
// ======================
exports.getConversation = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const senderId = Number(req.user.id);

     const messages = await Message.findAll({
  where: {
    [Op.or]: [
      { sender: senderId, receiver: userId },
      { sender: userId, receiver: senderId },
    ],
  },
  include: [
  {
    model: Message,
    as: "ReplyMessage",
    required: false,
    include: [
      {
        model: User,
        as: "Sender",
        attributes: ["id", "username"],
      },
    ],
  },
],
  order: [["createdAt", "ASC"]],
});

    return res.status(200).json(messages);
  } catch (err) {
  console.error("GET CONVERSATION ERROR:");
  console.error(err);
  console.error(err.stack);

    return res.status(500).json({
      message: err.message,
    });
  }
};

// ======================
// Get My Chats (FIXED + IMPORTANT)
// ======================
exports.getMyChats = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender: userId },
          { receiver: userId },
        ],
      },

      order: [["createdAt", "DESC"]],
    });

    // 🔥 IMPORTANT: reduce duplicate users (chat list fix)
    const chatMap = new Map();

    messages.forEach((msg) => {
      const otherUserId =
        msg.sender === userId ? msg.receiver : msg.sender;

      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, {
          userId: otherUserId,
          lastMessage: msg.message,
          createdAt: msg.createdAt,
        });
      }
    });

    res.status(200).json(Array.from(chatMap.values()));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
exports.markAsSeen = async (req, res) => {  
  const myId = req.user.id;
  const senderId = Number(req.params.senderId);

  await Message.update(
    { isSeen: true },
      {
        where: {
          sender: senderId,
          receiver: myId,
          isSeen: false
        }
      }
    );
    res.json({
      success: true
    });
  };

exports.getUnreadCounts = async (req, res) => {
  try {
    const myId = Number(req.user.id);

    const unread = await Message.findAll({
      where: {
        receiver: myId,
        isSeen: false,
      },
      attributes: [
        "sender",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["sender"],
    });

    res.json(unread);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (Number(message.sender) !== Number(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (type === "everyone") {
      message.message = "This message was deleted";
      message.isDeleted = true;
      message.deletedForEveryone = true;

      // File hoy to pan remove from UI
      message.fileUrl = null;
      message.fileName = null;
      message.mimeType = null;

      await message.save();
    } else {
      await message.destroy();
    }

    return res.json({
     success: true,
     id: message.id,
     type,
     message,
   });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};
exports.editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const msg = await Message.findByPk(id);

    if (!msg) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (Number(msg.sender) !== Number(req.user.id)) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    msg.message = message;
    msg.edited = true;

    await msg.save();

    return res.json({
      success: true,
      data: msg,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};