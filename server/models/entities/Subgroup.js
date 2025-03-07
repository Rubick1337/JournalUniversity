const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Group } = require("./Group");

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
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Group,
      key: "id",
    },
  },
  // leader_id: {
  //   type: DataTypes.UUID,
  //   references: {
  //     model: Student,
  //     key: "id",
  //   },
  //   allowNull: true,
  // },
});

module.exports = { Subgroup };
