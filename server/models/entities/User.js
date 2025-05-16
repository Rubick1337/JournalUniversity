const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
//TODO инициализация по умолчанию
const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  },
  { timestamps: false }
);

const { Role } = require("./Role");
User.belongsTo(Role, {
  foreignKey: {
    name: "role_id",
    allowNull: false,
  },
  as: "role",
  comment: "Ссылка на роль, к которому относится пользователь",
});

const { Student } = require("./Student");
User.belongsTo(Student, {
  foreignKey: {
    name: "student_id",
    allowNull: true,
  },
  as: "student",
  comment: "Ссылка на студента",
});

const { Teacher } = require("./Teacher");
User.belongsTo(Teacher, {
  foreignKey: {
    name: "teacher_id",
    allowNull: true,
  },
  as: "teacher",
  comment: "Ссылка на препода",
});
module.exports = { User };
