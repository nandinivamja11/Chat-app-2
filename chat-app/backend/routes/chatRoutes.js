const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const Message = require("../models/Message");

router.post("/message", auth, async (req, res) => {

  const msg = await Message.create({
    sender: req.user.id,
    receiver: req.body.receiver,
    message: req.body.message,
  });

  res.json(msg);

});

router.get("/messages", auth, async (req, res) => {

  const messages = await Message.findAll({
    order: [["createdAt", "ASC"]],
  });

  res.json(messages);

});

module.exports = router;