const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
//TODO инициализация по умолчанию
const TypeOfSemester = sequelize.define("TypeOfSemester", {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false},
  start: { type: DataTypes.DATE, allowNull: false},
  end: { type: DataTypes.DATE, allowNull: false},
});

  
module.exports = { TypeOfSemester };
  