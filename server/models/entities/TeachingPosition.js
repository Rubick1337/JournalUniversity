const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const TeachingPosition = sequelize.define("TeachingPosition", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

  
module.exports = { TeachingPosition };
  