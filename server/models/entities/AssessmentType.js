const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const AssessmentType = sequelize.define("AssessmentType", {
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

module.exports = { AssessmentType };