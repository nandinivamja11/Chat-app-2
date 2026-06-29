const User = require("../models/User.js")

//get profile

exports.getprofile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password -otp");
        if(!user){
            return res.status(400).json({
                message:"User not found",
            });
        }
        res.status(200).json(user);
    }catch (err) {
     console.error(err);
     res.status(500).json({
        message: err.message,
     });
    }
};

//update profile
exports.updateProfile = async (req, res) => {
  try {
    console.log("========= UPDATE =========");
    console.log("User:", req.user);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { username, bio } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (username) user.username = username;

    if (bio !== undefined) user.bio = bio;

    if (req.file) {
      user.profileImage = "/uploads/" + req.file.filename;
    }

    await user.save();

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