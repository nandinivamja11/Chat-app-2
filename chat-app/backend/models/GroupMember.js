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

Group.belongsToMany(User, { through: GroupMember });
User.belongsToMany(Group, { through: GroupMember });

module.exports = GroupMember;