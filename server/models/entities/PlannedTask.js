const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Group } = require("./Group");
const { Subgroup } = require("./Subgroup");
const { Subject } = require("./Subject");
const { Student } = require("./Student");

const PlannedTask = sequelize.define("PlannedTask ", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: true },
  description: { type: DataTypes.STRING, allowNull: true },

  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
    },
    allowNull: true,
  },
  //TODO ПФК
  subgroup_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subgroup,
      key: "id",
    },
    allowNull: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: "id",
    },
    allowNull: true,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = { PlannedTask };
