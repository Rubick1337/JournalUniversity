const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Person } = require("./Person");

const Faculty = sequelize.define("Faculty", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },

  dean_person_id: {
    type: DataTypes.UUID,
    references: {
      model: Person,
      key: "id",
    },
    allowNull: true,
  },
});

  
module.exports = { Faculty };
  