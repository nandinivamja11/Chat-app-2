// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");
// const{ sendMessage, getConversation, getMyChats, } = require("../controllers/message.controller");

// router.post("/send", authMiddleware, sendMessage);
// router.get("/", authMiddleware, getMyChats);
// router.get("/:userId", authMiddleware, getConversation);

// module.exports = router;

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendMessage,
  getConversation,
  getMyChats,
} = require("../controllers/message.controller"); // athva message.controller

router.post("/send", authMiddleware, sendMessage);

router.get("/", authMiddleware, getMyChats);

router.get("/:userId", authMiddleware, getConversation);

module.exports = router;