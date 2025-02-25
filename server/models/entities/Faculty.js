const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Person } = require("./Person");

const Faculty = sequelize.define("Faculty ", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },

  dean_person_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: true,
  },
});

  
module.exports = { Faculty };
  