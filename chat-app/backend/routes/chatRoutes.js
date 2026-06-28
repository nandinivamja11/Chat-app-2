const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const Message = require("../models/Message");

// Save message
router.post("/message", auth, async (req, res) => {
  const msg = await Message.create({
    sender: req.user.name,
    message: req.body.message,
  });

  res.json(msg);
});

// Get messages
router.get("/messages", auth, async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

module.exports = router;