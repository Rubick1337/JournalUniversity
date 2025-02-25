const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const SubjectType = sequelize.define("SubjectType", {
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

  
module.exports = { SubjectType };
  