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

// const { Absenteeism } = require("./Absenteeism");
// const { AcademicPerformance } = require("./AcademicPerformance");
// const { Curriculum } = require("./Curriculum");
// const { Grade } = require("./Grade");
// const { Group } = require("./Group");
// const { Lesson } = require("./Lesson");
// const { PlannedTask } = require("./PlannedTask");
// const { PlannedTaskTopic } = require("./PlannedTaskTopic");
// const { Student } = require("./Student");
// const { Subgroup } = require("./Subgroup");
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

  // Absenteeism,
  // AcademicPerformance,
  // Curriculum,
  // Grade,
  // Group,
  // Lesson,
  // PlannedTask,
  // PlannedTaskTopic,
  // Student,
  // Subgroup,
  // Subject,
  // Teacher,
  // Topic,
  // AssessmentType,
  // SubjectType,
  // TotalScoreType,
};
