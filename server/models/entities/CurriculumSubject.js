const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { Curriculum } = require("./Curriculum");
const { Subject } = require("./Subject");
const { AssessmentType } = require("./AssessmentType");

const CurriculumSubject = sequelize.define("CurriculumSubject", {
  curriculum_id: {
    type: DataTypes.UUID,
    references: {
        model: Curriculum,
        key: "id",
      },
    primaryKey: true,
  },
  subject_id: {
    type: DataTypes.UUID,
    references: {
        model: Subject,
        key: "id",
      },
    primaryKey: true,
  },
  assessment_type_id: {
    type: DataTypes.UUID,
    references: {
      model: AssessmentType,
      key: 'id',
    },
    primaryKey: true,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, 
  },
});

module.exports = { CurriculumSubject };
