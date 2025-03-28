const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Timesheet = sequelize.define("Timesheet", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  surname: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  middlename: { type: DataTypes.STRING, allowNull: true },
  phone_number: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
});

module.exports = { Timesheet };
