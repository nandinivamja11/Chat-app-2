const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createGroup } = require("../controllers/group.controller");

router.post("/create", authMiddleware, createGroup);

module.exports = router;