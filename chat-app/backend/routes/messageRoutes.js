const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const chatUpload = require("../middleware/chatUpload");

const {
  sendMessage,
  uploadMessage,
  getConversation,
  getMyChats,
  markAsSeen,
  getUnreadCounts,
  deleteMessage,
  editMessage,
  forwardMessage,
  reactToMessage,
  removeReaction,
  getMessageReactions,
} = require("../controllers/message.controller");

// ================= ROUTES =================

// send message
router.post("/send", authMiddleware, sendMessage);
router.post("/upload", authMiddleware, chatUpload.single("file"),
  uploadMessage);

// get all chats (sidebar list)
router.get("/chats", authMiddleware, getMyChats);

// get conversation between TWO users (IMPORTANT FIX)
router.get("/conversation/:userId", authMiddleware, getConversation);
router.get("/unread", authMiddleware, getUnreadCounts);

router.put("/seen/:senderId", authMiddleware, markAsSeen);
router.delete("/delete/:id", authMiddleware, deleteMessage);
router.put("/edit/:id", authMiddleware, editMessage);
router.post("/forward", authMiddleware, forwardMessage);
// ================= MESSAGE REACTIONS =================

// Add / Update reaction
router.post("/react", authMiddleware, reactToMessage);

// Remove reaction
router.delete("/react/:messageId", authMiddleware, removeReaction);

// Get reactions of a message
router.get("/reactions/:messageId", authMiddleware, getMessageReactions);
router.get("/test", (req, res) => { res.json({ ok: true }); });

module.exports = router;