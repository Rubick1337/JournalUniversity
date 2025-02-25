const sequelize = require("../../db");
const { ABSENTEEISM } = require("../config");
const { DataTypes } = require("sequelize");

const { Group } = require("./Group");
const { Lesson } = require("./Lesson");
const { Student } = require("./Student");

const Absenteeism = sequelize.define("Absenteeism", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
    },
    allowNull: false,
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Lesson,
      key: "id",
    },
    allowNull: false,
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: "id",
    },
    allowNull: false,
  },
  count_excused_hour: {
    type: DataTypes.INTEGER,
    defaultValue: ABSENTEEISM.DEFAULT_COUNT_EXCUSED_HOUR,
    allowNull: true,
  },
  count_unexcused_hour: {
    type: DataTypes.INTEGER,
    defaultValue: ABSENTEEISM.DEFAULT_COUNT_UNEXCUSED_HOUR,
    allowNull: true,
  },
});

module.exports = { Absenteeism };
