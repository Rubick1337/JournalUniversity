const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Department } = require("./Department");

const Subject = sequelize.define("Subject", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  name: { type: DataTypes.STRING(255), allowNull: false },

  department_id: {
    type: DataTypes.UUID,
    references: {
      model: Department,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = { Subject };
