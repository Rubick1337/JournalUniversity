const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
//TODO инициализация по умолчанию
const Role = sequelize.define(
  "Role",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: false }
);


// Данные для инициализации
const defaultData = [
  { name: "Админ" },
  { name: "Студент" },
  { name: "Преподователь" },
  { name: "Учебный отдел" },
  { name: "Деканат" },
  { name: "Родитель" },
];

const initializeRoles = async () => {
  for (const data of defaultData) {
    await Role.create(data);
  }
};


module.exports = { Role, initializeRoles };
