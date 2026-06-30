// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const sendOTP = require("../utils/sendOTP");

// // =======================
// // Register
// // =======================
// exports.register = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check empty fields
//     if (!username || !email || !password) {
//       return res.status(400).json({
//         message: "Please fill all fields",
//       });
//     }

//     // Check existing user
//     const existingUser = await                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "Email already exists",
//       });
//     }

//     // // Hash password
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     // // Save user
//     // const user = await User.create({
//     //   username,
//     //   email,
//     //   password: hashedPassword,
//     // });

//     // res.status(201).json({
//     //   message: "User registered successfully",
//     //   user,
//     // });

// // Hash password
// const hashedPassword = await bcrypt.hash(password, 10);

// // Generate OTP
// const otp = Math.floor(100000 + Math.random() * 900000).toString();

// // Save user
// const user = await User.create({
//   username,
//   email,
//   password: hashedPassword,
//   otp,
//   isVerified: false,
// });

// console.log("Generated OTP:", otp);

// // Send OTP email
// await sendOTP(email, otp);

// res.status(201).json({
//   message: "OTP sent successfully",
// });
//   }
//    catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// // =======================
// // Login
// // =======================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check fields
//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Please fill all fields",
//       });
//     }

//     // Find user
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         message: "User not found",
//       });
//     }
//     if (!user.isVerified) {
//       return res.status(400).json({
//         message: "Please verify your email first.",
//       });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         message: "Invalid password",
//       });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       {
//         id: user._id,
//         username: user.username,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user,
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };
// exports.verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({
//         message: "Invalid OTP",
//       });
//     }

//     user.isVerified = true;
//     user.otp = "";

//     await user.save();

//     res.json({
//       message: "Email verified successfully",
//     });
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// exports.resendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         message: "Please provide your email",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     user.isVerified = false;

//     await user.save();
//     await sendOTP(email, otp);

//     res.status(200).json({
//       message: "OTP resent successfully",
//     });
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOTP = require("../utils/sendOTP");

// =======================
// Register
// =======================
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
    });

    await sendOTP(email, otp);

    return res.status(201).json({
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

// =======================
// Login
// =======================
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

// =======================
// Verify OTP
// =======================
exports.verifyOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await user.update({
      otp: "",
      isVerified: true,
    });

    return res.status(200).json({
      message: "Email verified successfully",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

// =======================
// Resend OTP
// =======================
exports.resendOTP = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide your email",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await user.update({
      otp,
      isVerified: false,
    });

    await sendOTP(email, otp);

    return res.status(200).json({
      message: "OTP resent successfully",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id },
    }).select("-password -otp");

    res.status(200).json(users);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};