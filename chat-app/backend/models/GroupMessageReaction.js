const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GroupMessageReaction = sequelize.define(
  "GroupMessageReaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    groupMessageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    emoji: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: "group_message_reactions",
    timestamps: true,
  }
);

module.exports = GroupMessageReaction;
