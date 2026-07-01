const User = require("./User");
const Message = require("./Message");

// associations here
User.hasMany(Message, { foreignKey: "sender", as: "SentMessages" });
User.hasMany(Message, { foreignKey: "receiver", as: "ReceivedMessages" });

Message.belongsTo(User, { foreignKey: "sender", as: "Sender" });
Message.belongsTo(User, { foreignKey: "receiver", as: "Receiver" });

module.exports = { User, Message };