const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const AcademicSpecialty = sequelize.define("AcademicSpecialty", {
  code: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

const defaultData = [
  {
    code: "09.03.01",
    name: "Информатика и вычислительная техника",
  },
  {
    code: "09.03.04",
    name: "Программная инженерия",
  },
];

// Функция для инициализации данных
const initializeAcademicSpecialty = async () => {
  for (const data of defaultData) {
    await AcademicSpecialty.create(data);
  }
};

module.exports = { AcademicSpecialty, initializeAcademicSpecialty };
