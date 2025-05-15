const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const StudyPlanTopics = sequelize.define(
  "StudyPlanTopics",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: "Уникальный идентификатор записи рабочей программы",
    },
    week_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Номер недели",
    },
    number_of_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    with_defense: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    ranking_scores: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  { timestamps: false }
);

const { StudyPlan } = require("./StudyPlan");
StudyPlanTopics.belongsTo(StudyPlan, {
  foreignKey: {
    name: "study_plan_id",
    allowNull: false,
  },
  as: "studyPlan",
  comment: "Ссылка на рабочую программу",
});

const { Topic } = require("./Topic");
StudyPlanTopics.belongsTo(Topic, {
  foreignKey: {
    name: "topic_id",
    allowNull: false,
  },
  as: "topic",
  comment: "Ссылка на рабочую программу",
});

const { SubjectType } = require("./SubjectType");
StudyPlanTopics.belongsTo(SubjectType, {
  foreignKey: {
    name: "subject_type_id",
    allowNull: false,
  },
  as: "subjectType",
});

const { AssessmentMethod } = require("./AssessmentMethod");
StudyPlanTopics.belongsTo(AssessmentMethod, {
  foreignKey: {
    name: "assessment_method_id",
    allowNull: false,
  },
  as: "assessmentMethod",
});


module.exports = { StudyPlanTopics };
