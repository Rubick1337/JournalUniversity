const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Person } = require("./Person");
const { Faculty } = require("./Faculty");

const Department = sequelize.define("Department", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },

  chairperson_of_the_department_person_id: {
    type: DataTypes.UUID,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: true,
  },
  faculty_id: {
    type: DataTypes.UUID,
    references: {
      model: Faculty,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = { Department };
