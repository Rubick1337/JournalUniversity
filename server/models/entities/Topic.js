const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Subject } = require("./Subject");

const Topic = sequelize.define("Topic", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: "id",
    },
    allowNull: false,
  },
});

  
module.exports = { Topic };
  