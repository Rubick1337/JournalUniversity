const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const EducationForm = sequelize.define("EducationForm", {
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
const defaultPositions = [
  { name: "Бакалавриат" },
  { name: "Магистратура" },
];

// Функция для инициализации данных
const initializeEducationForm = async () => {
  for (const position of defaultPositions) {
    await EducationForm.create(position);
  }
};

// Экспортируйте модель и инициализацию
module.exports = { EducationForm, initializeEducationForm };
