const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

const TeachingPosition = sequelize.define("TeachingPosition", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Данные для инициализации
const defaultPositions = [
  { id: uuidv4(), name: 'Professor' },
  { id: uuidv4(), name: 'Associate Professor' },
  { id: uuidv4(), name: 'Assistant Professor' },
  { id: uuidv4(), name: 'Lecturer' },
  { id: uuidv4(), name: 'Instructor' },
];

// Функция для инициализации данных
const initializeTeachingPositions = async () => {
  for (const position of defaultPositions) {
    await TeachingPosition.create(position);
  }
};

// Экспортируйте модель и инициализацию
module.exports = { TeachingPosition, initializeTeachingPositions };