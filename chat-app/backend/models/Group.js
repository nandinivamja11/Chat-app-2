const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

const Group = sequelize.define(
    "Group",
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        groupImage:{
            type: DataTypes.STRING,
            allowNull:true,
        },
        createdBy:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps:true,
    }
);
module.exports = Group;