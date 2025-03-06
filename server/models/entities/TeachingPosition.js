const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const TeachingPosition = sequelize.define("TeachingPosition", {
  id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: DataTypes.UUIDV4 },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Данные для инициализации
const defaultPositions = [
  { name: 'Professor' },
  { name: 'Associate Professor' },
  { name: 'Assistant Professor' },
  { name: 'Lecturer' },
  { name: 'Instructor' },
];

// Функция для инициализации данных
const initializeTeachingPositions = async () => {
  for (const position of defaultPositions) {
    await TeachingPosition.create(position);
  }
};

// Экспортируйте модель и инициализацию
module.exports = { TeachingPosition, initializeTeachingPositions };