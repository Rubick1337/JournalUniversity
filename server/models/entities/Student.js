const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { STUDENT } = require("../config");

const { Person } = require("./Person");
const { Group } = require("./Group");
const { Subgroup } = require("./Subgroup");

const Student = sequelize.define("Student", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  count_reprimand: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: STUDENT.DEFAULT_REPRIMANDS,
    validate: { min: STUDENT.MIN_REPRIMANDS, max: STUDENT.MAX_REPRIMANDS },
  },
  icon_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  person_id: {
    type: DataTypes.UUID,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: false,
  },
  group_id: {
    type: DataTypes.UUID,
    references: {
      model: Group,
      key: "id",
    },
    allowNull: false,
  },
  subgroup_id: {
    type: DataTypes.UUID,
    references: {
      model: Subgroup,
      key: "id",
    },
    allowNull: false,
  },
  perent_person_id: {
    type: DataTypes.UUID,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: true,
  },
});

module.exports = { Student };
