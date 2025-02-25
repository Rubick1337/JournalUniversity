const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { ACADEMIC_PERFORMANCE } = require("../config");

const { Student } = require("./Student");
const { Subject } = require("./Subject");
const { TotalScoreType } = require("./TotalScoreType");

const AcademicPerformance = sequelize.define("AcademicPerformance", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: "id",
    },
    allowNull: false,
  },
  semester_number: {
    type: DataTypes.INTEGER,
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
  module1_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: ACADEMIC_PERFORMANCE.MODULE_FIRST.MIN_VALUE,
      max: ACADEMIC_PERFORMANCE.MODULE_FIRST.MAX_VALUE,
    },
  },
  module2_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: ACADEMIC_PERFORMANCE.MODULE_SECOND.MIN_VALUE,
      max: ACADEMIC_PERFORMANCE.MODULE_SECOND.MAX_VALUE,
    },
  },
  exam_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    min: ACADEMIC_PERFORMANCE.EXAM_SCORE.MIN_VALUE,
    max: ACADEMIC_PERFORMANCE.EXAM_SCORE.MAX_VALUE,
  },
  total_grade_id: {
    type: DataTypes.INTEGER,
    references: {
      model: TotalScoreType,
      key: "id",
    },
    allowNull: true,
  },
});

module.exports = { AcademicPerformance };
