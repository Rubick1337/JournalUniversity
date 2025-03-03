const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Person } = require("./Person");
const { Faculty } = require("./Faculty");

const Department = sequelize.define("Department", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },

  chairperson_of_the_department_person_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: true,
  },
  faculty_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Faculty,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = { Department };
