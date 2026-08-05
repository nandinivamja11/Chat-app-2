const { Op } = require("sequelize");
const Message = require("../models/Message");
const GroupMessage = require("../models/GroupMessage");
const User = require("../models/User");
const sequelize = require("../config/db");
const MessageReaction = require("../models/MessageReaction");

// ======================
// Send Message
// ======================
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, message, replyTo } = req.body;

    const sender = Number(req.user.id);
    const receiverId = Number(receiver);

    if (!receiver || !message) {
      return res.status(400).json({ message: "Receiver and message are required" });
    }

    const receiverUser = await User.findByPk(receiverId);

    if (!receiverUser) {
      return res.status(404).json({ message: "Receiver not found" });
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

    return res.status(201).json({ message: "Message sent successfully", data: createdMessage });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

// ======================
// Upload Message (File)
// ======================
exports.uploadMessage = async (req, res) => {
  try {
    const sender = Number(req.user.id);
    const receiver = Number(req.body.receiver);

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let type = "file";
    if (req.file.mimetype.startsWith("image/")) type = "image";
    else if (req.file.mimetype.startsWith("video/")) type = "video";
    else if (req.file.mimetype.startsWith("audio/")) type = "audio";

    const newMessage = await Message.create({
      sender,
      receiver,
      message: null,
      type,
      fileName: req.file.originalname,
      fileUrl: "/uploads/chat/" + req.file.filename,
      mimeType: req.file.mimetype,
    });

    return res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

// ======================
// Get Conversation
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
  {
    model: require("../models").MessageReaction,
    as: "reactions",
    include: [
      {
        model: require("../models").User,
        as: "user",
        attributes: ["id", "username"],
      },
    ],
  },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.error("GET CONVERSATION ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ======================
// Get My Chats
// ======================
exports.getMyChats = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const messages = await Message.findAll({ where: { [Op.or]: [{ sender: userId }, { receiver: userId }] }, order: [["createdAt", "DESC"]] });

    const chatMap = new Map();
    messages.forEach((msg) => {
      const otherUserId = msg.sender === userId ? msg.receiver : msg.sender;
      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, { userId: otherUserId, lastMessage: msg.message, createdAt: msg.createdAt });
      }
    });

    return res.status(200).json(Array.from(chatMap.values()));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.markAsSeen = async (req, res) => {
  const myId = req.user.id;
  const senderId = Number(req.params.senderId);

  await Message.update({ isSeen: true }, { where: { sender: senderId, receiver: myId, isSeen: false } });
  return res.json({ success: true });
};

exports.getUnreadCounts = async (req, res) => {
  try {
    const myId = Number(req.user.id);
    const unread = await Message.findAll({ where: { receiver: myId, isSeen: false }, attributes: ["sender", [sequelize.fn("COUNT", sequelize.col("id")), "count"]], group: ["sender"] });
    return res.json(unread);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const message = await Message.findByPk(id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (Number(message.sender) !== Number(req.user.id)) return res.status(403).json({ message: "Unauthorized" });

    if (type === "everyone") {
      message.message = "This message was deleted";
      message.isDeleted = true;
      message.deletedForEveryone = true;
      message.fileUrl = null;
      message.fileName = null;
      message.mimeType = null;
      await message.save();
    } else {
      await message.destroy();
    }

    return res.json({ success: true, id: message.id, type, message });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    let msg = await Message.findByPk(id);
    if (!msg) msg = await GroupMessage.findByPk(id);
    if (!msg) return res.status(404).json({ success: false, message: "Message not found" });

    msg.message = message;
    msg.edited = true;
    await msg.save();
    return res.json({ success: true, data: msg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.forwardMessage = async (req, res) => {
  try {
    const sender = req.user.id;
    const { messageId, receiver, sourceType } = req.body;

    let oldMessage = null;
    if (sourceType === "group") oldMessage = await GroupMessage.findByPk(messageId);
    else oldMessage = await Message.findByPk(messageId);

    if (!oldMessage) return res.status(404).json({ message: "Message not found" });

    const newMessage = await Message.create({ sender, receiver, message: oldMessage.message, type: oldMessage.type, fileUrl: oldMessage.fileUrl, fileName: oldMessage.fileName, mimeType: oldMessage.mimeType, replyTo: null, forwarded: true, forwardFrom: oldMessage.id });

    return res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

// ======================
// Message Reactions
// ======================
exports.reactToMessage = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { messageId, emoji } = req.body;

    console.log("[reactToMessage] userId:", userId, "messageId:", messageId, "emoji:", emoji);

    let message = await Message.findByPk(messageId);
    let isGroupMessage = false;

    if (!message) {
      const gm = await GroupMessage.findByPk(messageId);
      if (gm) {
        isGroupMessage = true;
        message = gm;
        console.log("[reactToMessage] Found GroupMessage for id:", messageId);
      }
    }

    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    if (!isGroupMessage) {
      // private message reaction
      let reaction = await MessageReaction.findOne({ where: { messageId, userId } });
      if (reaction) {
        reaction.emoji = emoji;
        await reaction.save();
      } else {
        reaction = await MessageReaction.create({ messageId, userId, emoji });
      }

      const reactions = await MessageReaction.findAll({ where: { messageId }, include: [{ model: User, as: "user", attributes: ["id", "username"] }] });
      console.log("[reactToMessage] reactions count:", reactions.length);
      req.io.emit("reaction_updated", { messageId, reactions, isGroup: false });
      return res.json({ success: true, data: reaction });
    } else {
      // group message reaction
      const { GroupMessageReaction } = require("../models");
      let greaction = await GroupMessageReaction.findOne({ where: { groupMessageId: messageId, userId } });
      if (greaction) {
        greaction.emoji = emoji;
        await greaction.save();
      } else {
        greaction = await GroupMessageReaction.create({ groupMessageId: messageId, userId, emoji });
      }

      const reactions = await GroupMessageReaction.findAll({ where: { groupMessageId: messageId }, include: [{ model: User, as: "user", attributes: ["id", "username"] }] });
      console.log("[reactToMessage] group reactions count:", reactions.length);
      req.io.emit("reaction_updated", { messageId, reactions, isGroup: true });
      return res.json({ success: true, data: greaction });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeReaction = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { messageId } = req.params;

    // Try private message reaction delete first
    const deleted = await MessageReaction.destroy({ where: { messageId, userId } });

    if (deleted) {
      const reactions = await MessageReaction.findAll({ where: { messageId }, include: [{ model: User, as: "user", attributes: ["id", "username"] }] });
      req.io.emit("reaction_updated", { messageId, reactions, isGroup: false });
      return res.json({ success: true });
    }

    // Fallback to group message reactions
    const { GroupMessageReaction } = require("../models");
    await GroupMessageReaction.destroy({ where: { groupMessageId: messageId, userId } });
    const reactions = await GroupMessageReaction.findAll({ where: { groupMessageId: messageId }, include: [{ model: User, as: "user", attributes: ["id", "username"] }] });
    req.io.emit("reaction_updated", { messageId, reactions, isGroup: true });
    return res.json({ success: true });
  } catch (error) {
    console.error("Error removing reaction:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessageReactions = async (req, res) => {
  try {
    const { messageId } = req.params;

    let reactions = await MessageReaction.findAll({ where: { messageId }, include: [{ model: User, as: "user", attributes: ["id", "username"] }] });
    if (reactions && reactions.length > 0) return res.json({ success: true, data: reactions, isGroup: false });

    const { GroupMessageReaction } = require("../models");
    reactions = await GroupMessageReaction.findAll({ where: { groupMessageId: messageId }, include: [{ model: User, as: "user", attributes: ["id", "username"] }] });
    return res.json({ success: true, data: reactions, isGroup: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};