

const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const AcademicBuilding = sequelize.define("AcademicBuilding", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING(255), allowNull: false },
  address: { type: DataTypes.STRING(255), allowNull: false },
},
{timestamps: false});

module.exports = { AcademicBuilding };
