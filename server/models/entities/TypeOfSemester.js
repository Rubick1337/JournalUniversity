const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
//TODO инициализация по умолчанию
const TypeOfSemester = sequelize.define("TypeOfSemester", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  start: { type: DataTypes.DATE, allowNull: false },
  end: { type: DataTypes.DATE, allowNull: false },
}, {timestamps: false});

module.exports = { TypeOfSemester };
