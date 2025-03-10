const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Person } = require("./Person");
const { Department } = require("./Department");
const { TeachingPosition } = require("./TeachingPosition");

const Teacher = sequelize.define("Teacher", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  person_id: {
    type: DataTypes.UUID,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: false,
  },
  department_id: {
    type: DataTypes.UUID,
    references: {
      model: Department,
      key: "id",
    },
    allowNull: false,
  },
  teaching_position_id: {
    type: DataTypes.UUID,
    references: {
      model: TeachingPosition,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = { Teacher };
