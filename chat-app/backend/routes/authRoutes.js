const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/authController");

// 👇 ADD THIS LINE (IMPORTANT)
const authMiddleware = require("../middleware/authMiddleware");

const { register, login, verifyOTP, resendOTP,} = 
require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyOTP);
router.post("/resend-otp", resendOTP);
router.get("/users", authMiddleware, getUsers);

module.exports = router;