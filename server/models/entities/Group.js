const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Faculty } = require("./Faculty");
const { Person } = require("./Person");
const { Department } = require("./Department");
const { AcademicSpecialty } = require("./AcademicSpecialty");

const Group = sequelize.define("Group", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name: { type: DataTypes.STRING, allowNull: false },
  graduation_year: { type: DataTypes.INTEGER, allowNull: false},
  year_of_beginning_of_study: { type: DataTypes.INTEGER, allowNull: false},

  faculty_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Faculty,
      key: "id",
    },
    allowNull: false,
  },
  class_representative_person_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: true,
  },
  teacher_curator_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Department,
      key: "id",
    },
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
});

  
module.exports = { Group };
  