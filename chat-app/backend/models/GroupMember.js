const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Group = require("./Group");
const User = require("./User");

const GroupMember = sequelize.define("GroupMember", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

Group.hasMany(GroupMember, {
  foreignKey: "groupId",
  as: "Members",
});

GroupMember.belongsTo(Group, {
  foreignKey: "groupId",
});

User.hasMany(GroupMember, {
  foreignKey: "userId",
});

GroupMember.belongsTo(User, {
  foreignKey: "userId",
});

Group.belongsToMany(User, {
  through: GroupMember,
  foreignKey: "groupId",
});

User.belongsToMany(Group, {
  through: GroupMember,
  foreignKey: "userId",
});

module.exports = GroupMember;