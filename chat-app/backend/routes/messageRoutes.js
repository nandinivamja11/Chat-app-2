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

module.exports = router;