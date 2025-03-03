const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Pair = sequelize.define("Pair", {
  id: { type: DataTypes.UUID, primaryKey: true },
  weekday_number: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  start: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
  end: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
  break_start: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
  break_end: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
});

const defaultClasses = [
  { weekday_number: 1, start: '08:30', end: '09:15', break_start: '09:20', break_end: '10:05' },
  { weekday_number: 1, start: '10:25', end: '11:10', break_start: '11:15', break_end: '12:00' },
  { weekday_number: 1, start: '12:30', end: '13:15', break_start: '13:20', break_end: '14:05' },
  { weekday_number: 1, start: '14:20', end: '15:05', break_start: '15:10', break_end: '15:55' },
  { weekday_number: 1, start: '16:05', end: '16:50', break_start: '16:55', break_end: '17:40' },

  { weekday_number: 2, start: '08:30', end: '09:15', break_start: '09:20', break_end: '10:05' },
  { weekday_number: 2, start: '10:25', end: '11:10', break_start: '11:15', break_end: '12:00' },
  { weekday_number: 2, start: '12:30', end: '13:15', break_start: '13:20', break_end: '14:05' },
  { weekday_number: 2, start: '14:20', end: '15:05', break_start: '15:10', break_end: '15:55' },
  { weekday_number: 2, start: '16:05', end: '16:50', break_start: '16:55', break_end: '17:40' },

  { weekday_number: 3, start: '08:30', end: '09:15', break_start: '09:20', break_end: '10:05' },
  { weekday_number: 3, start: '10:25', end: '11:10', break_start: '11:15', break_end: '12:00' },
  { weekday_number: 3, start: '12:30', end: '13:15', break_start: '13:20', break_end: '14:05' },
  { weekday_number: 3, start: '14:20', end: '15:05', break_start: '15:10', break_end: '15:55' },
  { weekday_number: 3, start: '16:05', end: '16:50', break_start: '16:55', break_end: '17:40' },

  { weekday_number: 4, start: '08:30', end: '09:15', break_start: '09:20', break_end: '10:05' },
  { weekday_number: 4, start: '10:25', end: '11:10', break_start: '11:15', break_end: '12:00' },
  { weekday_number: 4, start: '12:30', end: '13:15', break_start: '13:20', break_end: '14:05' },
  { weekday_number: 4, start: '14:20', end: '15:05', break_start: '15:10', break_end: '15:55' },
  { weekday_number: 4, start: '16:05', end: '16:50', break_start: '16:55', break_end: '17:40' },

  { weekday_number: 1, start: '08:30', end: '09:15', break_start: '09:20', break_end: '10:05' },
  { weekday_number: 1, start: '10:25', end: '11:10', break_start: '11:15', break_end: '12:00' },
  { weekday_number: 1, start: '12:30', end: '13:15', break_start: '13:20', break_end: '14:05' },
  { weekday_number: 1, start: '14:20', end: '15:05', break_start: '15:10', break_end: '15:55' },
  { weekday_number: 1, start: '16:05', end: '16:50', break_start: '16:55', break_end: '17:40' },
];

// Функция для инициализации данных
const initializeClasses = async () => {
  for (const classData of defaultClasses) {
    await Person.create(classData);
  }
};

// Экспортируйте модель и инициализацию
module.exports = { Pair, initializeClasses };