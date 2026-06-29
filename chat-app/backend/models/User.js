// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     bio: {
//       type: String,
//       default: "",
//     },

//     profileImage: {
//       type: String,
//       default: "",
//     },
    
//     otp: {
//     type: String,
//     default: "",
//     },

//     isVerified: {
//     type: Boolean,
//     default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("User", userSchema);

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    bio: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },

    profileImage: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    otp: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

module.exports = User;