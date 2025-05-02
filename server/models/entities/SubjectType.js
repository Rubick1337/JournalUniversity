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

// Данные для инициализации
const defaultValues = [
  { name: "практика" },
  { name: "лабораторная работа" },
  { name: "лекция" },
];

// Функция для инициализации данных
const initializeSubjectType = async () => {
  for (const thisValue of defaultValues) {
    await SubjectType.create(thisValue);
  }
};

module.exports = { SubjectType,initializeSubjectType };
