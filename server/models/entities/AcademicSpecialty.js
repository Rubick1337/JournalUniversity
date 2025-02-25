const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const AcademicSpecialty = sequelize.define("AcademicSpecialty", {
  code: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  specialty_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { AcademicSpecialty };
