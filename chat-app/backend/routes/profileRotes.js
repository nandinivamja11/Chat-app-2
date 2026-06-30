const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const{
    getprofile,
    updateProfile,
} = require("../controllers/profile.controller");
// const { models } = require("mongoose");

router.get("/", authMiddleware, getprofile);
const upload = require("../middleware/upload");

router.put(
  "/",
  authMiddleware,
  upload.single("profileImage"),
  updateProfile
);
module.exports = router;