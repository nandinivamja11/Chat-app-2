const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GroupMember = sequelize.define("GroupMember", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = GroupMember;