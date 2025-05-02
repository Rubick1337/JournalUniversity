const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const { Group } = require("./Group");
const { Subject } = require("./Subject");
const { Subgroup } = require("./Subgroup");
const { Teacher } = require("./Teacher");
const { Topic } = require("./Topic");


const { Audience } = require("./Audience");
const { SubjectType } = require("./SubjectType");

const Lesson = sequelize.define("Lesson", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
    },
    allowNull: false
  },
  subgroup_id: {
    type: DataTypes.UUID,
    references: {
      model: Subgroup,
      key: "id",
    },
    allowNull: true,
  },

  date: { type: DataTypes.DATE, allowNull: false },
  has_marked_absences: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: "id",
    },
    allowNull: false,
  },
  teacher_person_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Teacher,
      key: "id",
    },
    allowNull: false,
  },
  topic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Topic,
      key: "id",
    },
    allowNull: false,
  },
  audience_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Audience,
      key: "id",
    },
    allowNull: false,
  },
  subject_type_id: {
    type: DataTypes.INTEGER,
    references: {
      model: SubjectType,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = { Lesson };
