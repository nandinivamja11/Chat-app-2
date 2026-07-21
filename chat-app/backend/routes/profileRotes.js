const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getprofile, updateProfile, changePassword } = require("../controllers/profile.controller");
const upload = require("../middleware/profileupload");

router.get("/", authMiddleware, getprofile);

router.put(
  "/",
  authMiddleware,
  upload.single("profileImage"),
  updateProfile
);
router.put(
   "/change-password",
   authMiddleware,
   changePassword
);

module.exports = router;
