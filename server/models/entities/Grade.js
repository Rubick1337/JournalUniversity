const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Grade = sequelize.define("Grade", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  value: { type: DataTypes.INTEGER, allowNull: false },
});

const { Topic } = require("./Topic");
Grade.belongsTo(Topic, {
    foreignKey: {
    name: "topic_id",
    allowNull: false,
  },
  as: "topic",
})
const { Student } = require("./Student");
Grade.belongsTo(Student, {
    foreignKey: {
    name: "student_id",
    allowNull: false,
  },
  as: "student",
})
const { Lesson } = require("./Lesson");
Grade.belongsTo(Lesson, {
    foreignKey: {
    name: "lesson_id",
    allowNull: true,
  },
  as: "lesson",
})



module.exports = { Grade };
