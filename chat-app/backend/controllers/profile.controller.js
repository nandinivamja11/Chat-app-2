const User = require("../models/User");

// Get Profile
exports.getprofile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password", "otp"],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {

    const { username, bio } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.update({
      username: username || user.username,
      bio: bio !== undefined ? bio : user.bio,
      profileImage: req.file
        ? "/uploads/" + req.file.filename
        : user.profileImage,
    });

    res.status(200).json({
      message: "Profile Updated Successfully",
      user,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};