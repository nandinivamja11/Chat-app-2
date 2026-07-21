const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GroupMessage = sequelize.define(
  "GroupMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    type: {
      type: DataTypes.STRING,
      defaultValue: "text",
    },

    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = GroupMessage;