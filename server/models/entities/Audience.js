const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { AcademicBuilding } = require("./AcademicBuilding");

const Audience = sequelize.define("Audience", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  number: { type: DataTypes.INTEGER, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  academic_building_id: {
    type: DataTypes.INTEGER,
    references: {
      model: AcademicBuilding,
      key: "id",
    },
    allowNull: false,
  },

  description: { type: DataTypes.STRING(1026), allowNull: false },
});

module.exports = { Audience };
