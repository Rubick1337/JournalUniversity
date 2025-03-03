const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Topic } = require("./Topic");
const { Student } = require("./Student");
const { Lesson } = require("./Lesson");
const { Group } = require("./Group");
const { PlannedTask } = require("./PlannedTask");

const Grade = sequelize.define("Grade", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  topic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Topic,
      key: "id",
    },
    primaryKey: true,
  },

  value: { type: DataTypes.INTEGER, allowNull: false },

  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
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
  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
    },
    allowNull: false,
  },
  planned_task_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PlannedTask,
      key: "id",
    },
    allowNull: true,
  },
  planned_task_date_pass: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = { Grade };
