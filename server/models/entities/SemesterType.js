const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const SemesterType = sequelize.define("SemesterType", {
  name: { 
    type: DataTypes.STRING, 
    primaryKey: true, 
    allowNull: false 
  },
  startMonth: { 
    type: DataTypes.INTEGER, // 1-12 для месяцев
    allowNull: false 
  },
  startDay: { 
    type: DataTypes.INTEGER, // 1-31 для дней
    allowNull: false 
  },
  endMonth: { 
    type: DataTypes.INTEGER, // 1-12 для месяцев
    allowNull: false 
  },
  endDay: { 
    type: DataTypes.INTEGER, // 1-31 для дней
    allowNull: false 
  }
});

// Данные для инициализации
const defaultData = [
  { name: 'Осенний', startMonth: 9, startDay: 1, endMonth: 1, endDay: 31 },
  { name: 'Весенний', startMonth: 2, startDay: 1, endMonth: 8, endDay: 31 },
];

// Функция для инициализации данных
const initializeSemesterType = async () => {
  for (const data of defaultData) {
    await SemesterType.create(data);
  }
};

module.exports = { SemesterType, initializeSemesterType };