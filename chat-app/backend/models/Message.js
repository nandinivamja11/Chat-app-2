const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    receiver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
  }
);

// Associations
User.hasMany(Message, {
  foreignKey: "sender",
  as: "SentMessages",
});

User.hasMany(Message, {
  foreignKey: "receiver",
  as: "ReceivedMessages",
});

Message.belongsTo(User, {
  foreignKey: "sender",
  as: "Sender",
});

Message.belongsTo(User, {
  foreignKey: "receiver",
  as: "Receiver",
});

module.exports = Message;   