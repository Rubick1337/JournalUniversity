const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Person } = require("./Person");
const { Faculty } = require("./Faculty");

const Department = sequelize.define("Department", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },

  chairperson_of_the_department_person_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: true,
  },
  faculty_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Faculty,
      key: "id",
    },
    allowNull: false,
  },
});
 
const defaultData = [
  {
    name: 'АТ',
    full_name: 'Автомобильный транспорт',
    faculty_id: '1b8e0d77-e6e2-4123-845b-83465260d299',
  },
  {
    name: 'ТЭА',
    full_name: 'Техническая эксплуатация автомобилей',
    faculty_id: '1b8e0d77-e6e2-4123-845b-83465260d299',
  },
  {
    name: 'ЛОП',
    full_name: 'Логистика и организация производства',
    faculty_id: '262f1975-56c6-49a6-95aa-e71fadca9b2f',
  },
  {
    name: 'ЭУ',
    full_name: 'Экономика и управление',
    faculty_id: '262f1975-56c6-49a6-95aa-e71fadca9b2f',
  },
  {
    name: 'ЭПА',
    full_name: 'Электропривод и автоматизация промышленных установок',
    faculty_id: '4b960cec-64de-46d1-9523-6e272468cbe5',
  },
  {
    name: 'ЭСПП',
    full_name: 'Электроснабжение промышленных предприятий',
    faculty_id: '4b960cec-64de-46d1-9523-6e272468cbe5',
  },
  {
    name: 'БУА',
    full_name: 'Бухгалтерский учет и аудит',
    faculty_id: '79211b97-157b-4120-b424-8f111ecf024b',
  },
  {
    name: 'ПГС',
    full_name: 'Промышленное и гражданское строительство',
    faculty_id: '8390cdb6-dcba-42e9-9767-19d5f2752153',
  },
  {
    name: 'АГ',
    full_name: 'Архитектура и градостроительство',
    faculty_id: '8390cdb6-dcba-42e9-9767-19d5f2752153',
  },
  {
    name: 'ТМ',
    full_name: 'Технология машиностроения',
    faculty_id: '8c4a2018-9d5b-47ec-9230-c5446f84a938',
  },
  {
    name: 'МРСИ',
    full_name: 'Металлорежущие станки и инструменты',
    faculty_id: '8c4a2018-9d5b-47ec-9230-c5446f84a938',
  },
  {
    name: 'ПОИТ',
    full_name: 'Программное обеспечение информационных технологий',
    faculty_id: '4b960cec-64de-46d1-9523-6e272468cbe5',
  },
];



// Функция для инициализации данных
const initializeDepartment = async () => {
  for (const data of defaultData) {
    await Department.create(data);
  }
};


module.exports = { Department,initializeDepartment };
