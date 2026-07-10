const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getprofile, updateProfile } = require("../controllers/profile.controller");
const upload = require("../middleware/profileupload");

router.get("/", authMiddleware, getprofile);

router.put(
  "/",
  authMiddleware,
  upload.single("profileImage"),
  updateProfile
);

module.exports = router;
