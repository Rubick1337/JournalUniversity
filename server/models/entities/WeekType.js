const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const WeekType = sequelize.define("WeekType", {
  name: { type: DataTypes.STRING, primaryKey:true, allowNull: false },
});

// Данные для инициализации
const defaultData = [
    { name: 'Верхняя неделя' },
    { name: 'Нижняя неделя' },
  ];
  
  // Функция для инициализации данных
  const initializeWeekType = async () => {
    for (const data of defaultData) {
      await WeekType.create(data);
    }
  };
module.exports = { WeekType, initializeWeekType };
