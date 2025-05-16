const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const ScheduleDetails = sequelize.define("ScheduleDetails", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: "Уникальный идентификатор записи расписания",
  },
}, {timestamps: false});
const { Schedule } = require("./Schedule");
ScheduleDetails.belongsTo(Schedule, {
  foreignKey: {
    name: "schedule_id",
    allowNull: false,
  },
  as: "schedule",
  comment: "Ссылка на привязанное расписание",
});


const { Pair } = require("./Pair");
ScheduleDetails.belongsTo(Pair, {
  foreignKey: {
    name: "pair_id",
    allowNull: false,
  },
  as: "PairInSchedule",
  comment: "Ссылка на пару, к которому относится расписание",
});

const { Group } = require("./Group");
ScheduleDetails.belongsTo(Group, {
  foreignKey: {
    name: "group_id",
    allowNull: false,
  },
  as: "GroupInSchedule",
  comment: "Ссылка на группу, к которому относится расписание",
});

const { Subgroup } = require("./Subgroup");
ScheduleDetails.belongsTo(Subgroup, {
  foreignKey: {
    name: "subgroup_id",
    allowNull: true,
  },
  as: "SubroupInSchedule",
  comment: "Ссылка на подгруппу, к которому относится расписание",
});

const { Subject } = require("./Subject");
ScheduleDetails.belongsTo(Subject, {
  foreignKey: {
    name: "subject_id",
    allowNull: false,
  },
  as: "subject",
  comment: "Ссылка на учебный предмет",
});
const { Audience } = require("./Audience");
ScheduleDetails.belongsTo(Audience, {
  foreignKey: {
    name: "audience_id",
    allowNull: false,
  },
  as: "audience",
  comment: "Ссылка на аудиторию",
});
const { Teacher } = require("./Teacher");
ScheduleDetails.belongsTo(Teacher, {
  foreignKey: {
    name: "teacher_id",
    allowNull: false,
  },
  as: "teacher",
  comment: "Ссылка на преподавателя",
});

const {SubjectType} = require('./SubjectType')
ScheduleDetails.belongsTo(SubjectType, {
  foreignKey: {
    name: "subject_type_id",
    allowNull: false,
  },
  as: "subjectType",
  comment: "Ссылка на тип дисциплины",
});

module.exports = { ScheduleDetails };
