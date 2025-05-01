const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { Curriculum } = require("./Curriculum");
const { Subject } = require("./Subject");
const { AssessmentType } = require("./AssessmentType");

const CurriculumSubject = sequelize.define("CurriculumSubject", {
  curriculum_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Curriculum,
      key: "id",
    },
    primaryKey: true,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: "id",
    },
    primaryKey: true,
  },
  assessment_type_id: {
    type: DataTypes.INTEGER,
    references: {
      model: AssessmentType,
      key: "id",
    },
    primaryKey: true,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  all_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lecture_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lab_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  practice_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

}, {
  timestamps: false,
  tableName: 'CurriculumSubjects',
});

module.exports = { CurriculumSubject };
