const User = require("./User");
const Message = require("./Message");
const Group = require("./Group");
const GroupMember = require("./GroupMember");

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

module.exports = { User, Message, Group, GroupMember };