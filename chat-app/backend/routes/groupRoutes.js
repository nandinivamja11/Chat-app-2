const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const chatUpload = require("../middleware/chatUpload");
const { createGroup, getMyGroups, sendGroupMessage, getGroupMessages, markGroupSeen,
  getGroupUnreadCounts, uploadGroupFile, updateGroupPhoto, updateGroupName, 
  deleteGroupMessage, editGroupMessage,  forwardGroupMessage, } = require("../controllers/group.controller")

router.post("/create", authMiddleware, chatUpload.single("groupImage"), createGroup);
router.get("/my-groups", authMiddleware, getMyGroups);

router.post("/message", authMiddleware, sendGroupMessage);
router.get("/messages/:groupId", authMiddleware, getGroupMessages);
router.put("/seen/:groupId", authMiddleware, markGroupSeen);
router.get("/unread", authMiddleware, getGroupUnreadCounts);
router.post("/upload", authMiddleware, chatUpload.single("file"), uploadGroupFile);
router.put("/photo/:groupId", authMiddleware, chatUpload.single("groupImage"), updateGroupPhoto);
router.put("/name/:groupId", authMiddleware, updateGroupName);
router.delete("/message/delete/:id", authMiddleware, deleteGroupMessage);
router.put("/edit/:id", authMiddleware, editGroupMessage);
router.post("/forward", authMiddleware, forwardGroupMessage);

module.exports = router;   
