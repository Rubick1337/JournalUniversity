const sequelize = require("../../db");
const { DataTypes } = require("sequelize");


const Schedule = sequelize.define("Schedule", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: "Название расписания"
  },
  start_date: { 
    type: DataTypes.DATE, 
    allowNull: false,
    comment: "Дата, с которой расписание начинает действовать"
  },
});

const {TypeOfSemester} = require('./TypeOfSemester')
Schedule.belongsTo(TypeOfSemester, {
  foreignKey: {
    name: 'type_of_semester_id',
    allowNull: false
  },
  as: 'typeOfSemester',
  comment: "Ссылка на тип семестра, к которому относится расписание"
});


module.exports = { Schedule };
