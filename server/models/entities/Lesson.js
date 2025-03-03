const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Group } = require("./Group");
const { Subject } = require("./Subject");
// const { Subgroup } = require("./Subgroup");
const { Person } = require("./Person");
const { Topic } = require("./Topic");

const Lesson = sequelize.define("Lesson", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
    },
    primaryKey: true,
  },

  date: { type: DataTypes.DATE, allowNull: false },
  number_semester: { type: DataTypes.INTEGER, allowNull: false },
  has_marked_absences : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: "id",
    },
    allowNull: false,
  },
  teacher_person_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: false,
  },
  topic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Topic,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = { Lesson };
