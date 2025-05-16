const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Group } = require("./Group");
const { Person } = require("./Person");

const Subgroup = sequelize.define("Subgroup", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: "id",
    },
  },
  leader_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: true,
  },
});

module.exports = { Subgroup };
