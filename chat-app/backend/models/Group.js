const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  groupImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Group;