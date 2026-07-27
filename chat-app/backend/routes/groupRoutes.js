const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const chatUpload = require("../middleware/chatUpload");
const { createGroup, getMyGroups, sendGroupMessage, getGroupMessages, markGroupSeen,
  getGroupUnreadCounts, uploadGroupFile, updateGroupPhoto } = require("../controllers/group.controller")

router.post("/create", authMiddleware, createGroup);
router.get("/my-groups", authMiddleware, getMyGroups);

router.post("/message", authMiddleware, sendGroupMessage);
router.get("/messages/:groupId", authMiddleware, getGroupMessages);
router.put("/seen/:groupId", authMiddleware, markGroupSeen);
router.get("/unread", authMiddleware, getGroupUnreadCounts);
router.post("/upload", authMiddleware, chatUpload.single("file"), uploadGroupFile);
router.put("/photo/:groupId", authMiddleware, chatUpload.single("groupImage"), updateGroupPhoto);

module.exports = router;   
