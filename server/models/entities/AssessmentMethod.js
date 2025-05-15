const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const AssessmentMethod = sequelize.define("AssessmentMethod", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  min_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  max_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Данные для инициализации
const defaultData = [
  { name: "5-и бальная", min_value: 3, max_value: 5 },
  { name: "Зачет", min_value: 1, max_value: 1 },
  { name: "10-и бальная",min_value: 3, max_value: 10 },
];

// Функция для инициализации данных
const initializeAssessmentMethod = async () => {
  for (const data of defaultData) {
    await AssessmentMethod.create(data);
  }
};

// Экспортируйте модель и инициализацию
module.exports = { AssessmentMethod, initializeAssessmentMethod };
