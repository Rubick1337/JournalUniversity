const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Person } = require("./Person");

const Faculty = sequelize.define("Faculty", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING(255), allowNull: false },

  dean_person_id: {
    type: DataTypes.UUID,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: true,
  },
});

const defaultData = [
  {
    name: "ИЭФ",
    full_name: "Инженерно-экономический",
  },

  {
    name: "АМ",
    full_name: "Автомеханический факультет",
  },

  {
    name: "МС",
    full_name: "Машиностроительный факультет",
  },

  {
    name: "ЭТ",
    full_name: "Электротехнический факультет",
  },

  {
    name: "УИ",
    full_name: "Факультет управления и инноваций",
  },

  {
    name: "СТ",
    full_name: "Строительный факультет:",
  },
];
// Функция для инициализации данных
const initializeFaculty = async () => {
  for (const data of defaultData) {
    await Faculty.create(data);
  }
};

module.exports = { Faculty, initializeFaculty };
