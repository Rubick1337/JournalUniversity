const sequelize = require("../../db");
const { DataTypes } = require("sequelize");


const StudyPlan = sequelize.define("StudyPlan", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: "Название рабочей программы"
  },
  start_date: { 
    type: DataTypes.DATE, 
    allowNull: false,
    comment: "Дата, с которой расписание начинает действовать"
  },
});

const {Subject} = require('./Subject')
StudyPlan.belongsTo(Subject, {
  foreignKey: {
    name: 'subject_id',
    allowNull: false
  },
  as: 'subject',
  comment: "Ссылка на дисциплину"
});
const {AcademicSpecialty} = require('./AcademicSpecialty')
StudyPlan.belongsTo(AcademicSpecialty, {
  foreignKey: {
    name: 'academic_specialty_code',
    allowNull: false
  },
  as: 'academicSpecialty',
  comment: "Ссылка на специальность"
});


module.exports = { StudyPlan };
