const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { CURRICULUM } = require("../config");


const { AcademicSpecialty } = require("./AcademicSpecialty");
const { EducationForm } = require("./EducationForm");

const Curriculum = sequelize.define("Curriculum", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  year_of_specialty_training: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  specialty_code: {
    type: DataTypes.STRING,
    references: {
      model: AcademicSpecialty,
      key: "code"
    },
    allowNull: false,
  },
  education_form_id: {
    type: DataTypes.INTEGER,
    references: {
      model: EducationForm,
      key: "id"
    },
    allowNull: false,
  },
});

module.exports = { Curriculum };