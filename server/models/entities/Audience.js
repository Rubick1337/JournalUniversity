const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { AcademicBuilding } = require("./AcademicBuilding");

const Audience = sequelize.define("Audience", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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

  // description: { type: DataTypes.STRING(1026), allowNull: false },
}, {timestamps: false});

Audience.belongsTo(AcademicBuilding, {
  foreignKey: {
    name: 'academic_building_id',
    allowNull: false
  },
  as: 'academicBuilding',
  comment: "Ссылка на корпус"
})

module.exports = { Audience };
