const User = require("./User");
const Message = require("./Message");
const Group = require("./Group");
const GroupMember = require("./GroupMember");
const GroupMessage = require("./GroupMessage");
const MessageReaction = require("./MessageReaction");
const GroupMessageReaction = require("./GroupMessageReaction");

// associations here
User.hasMany(Message, { foreignKey: "sender", as: "SentMessages" });
User.hasMany(Message, { foreignKey: "receiver", as: "ReceivedMessages" });

Message.belongsTo(User, { foreignKey: "sender", as: "Sender" });
Message.belongsTo(User, { foreignKey: "receiver", as: "Receiver" });

User.hasMany(Group, { foreignKey: "createdBy", as: "CreatedGroups" });
Group.belongsTo(User, { foreignKey: "createdBy", as: "Creator" });

Group.hasMany(GroupMember, { foreignKey: "groupId", as: "Members" });
GroupMember.belongsTo(Group, { foreignKey: "groupId",});
 
User.hasMany(GroupMember, { foreignKey: "userId" });
GroupMember.belongsTo(User, { foreignKey: "userId" });

Group.hasMany(GroupMessage, { foreignKey: "groupId", as: "Messages" });
GroupMessage.belongsTo(Group, { foreignKey: "groupId" });
GroupMessage.belongsTo(GroupMessage, { foreignKey: "replyTo", as: "ReplyMessage" });

User.hasMany(GroupMessage, { foreignKey: "senderId" });
GroupMessage.belongsTo(User, { foreignKey: "senderId", as: "Sender" });

// ================= MESSAGE REACTIONS =================

// One Message -> Many Reactions
Message.hasMany(MessageReaction, { foreignKey: "messageId", as: "reactions", onDelete: "CASCADE" });

// One Reaction -> One Message
MessageReaction.belongsTo(Message, { foreignKey: "messageId", as: "message" });

// One User -> Many Reactions
User.hasMany(MessageReaction, { foreignKey: "userId", as: "messageReactions" });

// One Reaction -> One User
MessageReaction.belongsTo(User, { foreignKey: "userId", as: "user" });

// ================= GROUP MESSAGE REACTIONS =================

// One GroupMessage -> Many Reactions
GroupMessage.hasMany(GroupMessageReaction, { foreignKey: "groupMessageId", as: "reactions", onDelete: "CASCADE" });

// One Reaction -> One GroupMessage
GroupMessageReaction.belongsTo(GroupMessage, { foreignKey: "groupMessageId", as: "groupMessage" });

// One User -> Many Group Reactions
User.hasMany(GroupMessageReaction, { foreignKey: "userId", as: "groupMessageReactions" });

// One Group Reaction -> One User
GroupMessageReaction.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = { User, Message, Group, GroupMember, GroupMessage, MessageReaction, GroupMessageReaction };