const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendMessage,
  getConversation,
  getMyChats,
  markAsSeen,
  getUnreadCounts,
} = require("../controllers/message.controller");

// ================= ROUTES =================

// send message
router.post("/send", authMiddleware, sendMessage);

// get all chats (sidebar list)
router.get("/chats", authMiddleware, getMyChats);

// get conversation between TWO users (IMPORTANT FIX)
router.get("/conversation/:userId", authMiddleware, getConversation);
router.get("/unread", authMiddleware, getUnreadCounts);

router.put("/seen/:senderId", authMiddleware, markAsSeen);

module.exports = router;