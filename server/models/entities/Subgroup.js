const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Group } = require("./Group");
const { Student } = require("./Student");

const Subgroup = sequelize.define("Subgroup", {
  
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull:false,
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
      model: Student,
      key: "id",
    },
    allowNull: true,
  },
// }, {
//   indexes: [
//     {
//       unique: true,
//       fields: ['name', 'group_id'], // Уникальный индекс для составного ключа
//     }
//   ],
});

module.exports = { Subgroup };