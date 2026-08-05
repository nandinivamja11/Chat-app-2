const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MessageReaction = sequelize.define(
  "MessageReaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    messageId: {
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
    tableName: "message_reactions",
    timestamps: true,
  }
);

module.exports = MessageReaction;