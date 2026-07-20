const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const groupController = require("../controllers/group.controller");

router.post("/create", authMiddleware, groupController.createGroup);
router.get("/my-groups", authMiddleware, groupController.getMyGroups);

router.post("/message", authMiddleware, groupController.sendGroupMessage);
router.get("/messages/:groupId", authMiddleware, groupController.getGroupMessages);
router.put("/seen/:groupId", authMiddleware, groupController.markGroupSeen);
router.get("/unread", authMiddleware, groupController.getGroupUnreadCounts);

module.exports = router;   