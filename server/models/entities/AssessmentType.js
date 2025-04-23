const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const AssessmentType = sequelize.define("AssessmentType", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});
// Данные для инициализации
const defaultData = [
  { name: "экзамен" },
  { name: "зачет" },
  { name: "дифференцированный зачет" },
  { name: "курсовой проект" },
  { name: "курсовая работа" },
];

// Функция для инициализации данных
const initializeAssessmentType = async () => {
  for (const data of defaultData) {
    await AssessmentType.create(data);
  }
};
module.exports = { AssessmentType,initializeAssessmentType };