const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { CURRICULUM } = require("../config");

// const { Subject } = require("./Subject");
// const { Topic } = require("./Topic");
// const { AssessmentType } = require("./AssessmentType");
const { AcademicSpecialty } = require("./AcademicSpecialty");

const Curriculum = sequelize.define("Curriculum", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  year_of_specialty_training: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  specialty_code: {
    type: DataTypes.STRING,
    references: {
      model: AcademicSpecialty,
      key: "code"
    },
    allowNull: false,
  },

  // subject_id: {
  //   type: DataTypes.UUID,
  //   references: {
  //     model: Subject,
  //     key: "id",
  //   },
  //   primaryKey: true,
  // },
  
  // count_hours: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   validate: {
  //     min: CURRICULUM.COUNT_HOURS.MIN_VALUE 
  //   }
  // },
  // number_semester: {
  //   type: DataTypes.INTEGER,
  //   primaryKey: true,
  //   validate: {
  //     min: CURRICULUM.NUMBER_SEMESTER.MIN_VALUE,
  //     max: CURRICULUM.NUMBER_SEMESTER.MAX_VALUE,      
  //   }
  // },
  // type_of_assessment_id: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: AssessmentType,
  //     key: "id"
  //   },
  //   primaryKey: true,
  // },


});

module.exports = { Curriculum };