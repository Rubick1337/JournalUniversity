const sequelize = require("../../db");
const { ABSENTEEISM } = require("../config");
const { DataTypes } = require("sequelize");

const Absenteeism = sequelize.define("Absenteeism", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  count_excused_hour: {
    type: DataTypes.INTEGER,
    defaultValue: ABSENTEEISM.DEFAULT_COUNT_EXCUSED_HOUR,
    allowNull: true,
  },
  count_unexcused_hour: {
    type: DataTypes.INTEGER,
    defaultValue: ABSENTEEISM.DEFAULT_COUNT_UNEXCUSED_HOUR,
    allowNull: true,
  },
});

const { Lesson } = require("./Lesson");
Absenteeism.belongsTo(Lesson, {
  foreignKey: {
    name: "lesson_id",
    allowNull: false,
  },
  as: "lesson",
});
const { Student } = require("./Student");
Absenteeism.belongsTo(Student, {
  foreignKey: {
    name: "student_id",
    allowNull: false,
  },
  as: "student",
});
module.exports = { Absenteeism };
