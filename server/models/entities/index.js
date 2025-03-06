const { Person } = require("./Person");
const {
  TeachingPosition,
  initializeTeachingPositions,
} = require("./TeachingPosition");
const { Faculty, initializeFaculty } = require("./Faculty");
const { WeekType, initializeWeekType } = require("./WeekType");
const { Pair, initializePair } = require("./Pair");
const { Department, initializeDepartment } = require("./Department");
const { AcademicSpecialty, initializeAcademicSpecialty } = require("./AcademicSpecialty");
const { Group } = require("./Group");
const { Subgroup } = require("./Subgroup");

// const { Absenteeism } = require("./Absenteeism");
// const { AcademicPerformance } = require("./AcademicPerformance");
// const { Curriculum } = require("./Curriculum");
// const { Grade } = require("./Grade");
// const { Lesson } = require("./Lesson");
// const { PlannedTask } = require("./PlannedTask");
// const { PlannedTaskTopic } = require("./PlannedTaskTopic");
// const { Student } = require("./Student");
// const { Subject } = require("./Subject");
// const { Teacher } = require("./Teacher");
// const { Topic } = require("./Topic");
// const { AssessmentType } = require("./AssessmentType");
// const { SubjectType } = require("./SubjectType");
// const { TotalScoreType } = require("./TotalScoreType");

const initModels = async () => {
  // await initializeTeachingPositions();
  // await initializeWeekType();
  // await initializePair();
  // await initializeFaculty();
  // await initializeDepartment();
  // await initializeAcademicSpecialty();
  
  
};
module.exports = {
  initModels,
  Person,
  TeachingPosition,
  Faculty,
  WeekType,
  Pair,
  Department,
  AcademicSpecialty,
  Group,
  Subgroup,

  // Absenteeism,
  // AcademicPerformance,
  // Curriculum,
  // Grade,
  // Lesson,
  // PlannedTask,
  // PlannedTaskTopic,
  // Student,
  // Subject,
  // Teacher,
  // Topic,
  // AssessmentType,
  // SubjectType,
  // TotalScoreType,
};
