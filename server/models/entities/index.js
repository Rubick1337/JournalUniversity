const { Person } = require("./Person");
const {
  TeachingPosition,
  initializeTeachingPositions,
} = require("./TeachingPosition");
const { Faculty, initializeFaculty } = require("./Faculty");
const { WeekType, initializeWeekType } = require("./WeekType");
const { Pair, initializePair } = require("./Pair");
const { Department, initializeDepartment } = require("./Department");
const {
  AcademicSpecialty,
  initializeAcademicSpecialty,
} = require("./AcademicSpecialty");
const { Group } = require("./Group");
const { Subgroup } = require("./Subgroup");
const { Student } = require("./Student");
const { Subject } = require("./Subject");
const { SemesterType, initializeSemesterType } = require("./SemesterType");
const {
  AssessmentType,
  initializeAssessmentType,
} = require("./AssessmentType");

const { Curriculum } = require("./Curriculum");
const { Teacher } = require("./Teacher");
const { AcademicBuilding } = require("./AcademicBuilding");
const { Audience } = require("./Audience");

// const { Absenteeism } = require("./Absenteeism");
// const { AcademicPerformance } = require("./AcademicPerformance");
// const { Grade } = require("./Grade");
// const { Lesson } = require("./Lesson");
// const { PlannedTask } = require("./PlannedTask");
// const { PlannedTaskTopic } = require("./PlannedTaskTopic");
// const { Topic } = require("./Topic");
// const { SubjectType } = require("./SubjectType");
// const { TotalScoreType } = require("./TotalScoreType");

const initModels = async () => {
  // await initializeTeachingPositions();
  // await initializeWeekType();
  // await initializePair();
  // await initializeFaculty();
  // await initializeDepartment();
  // await initializeAcademicSpecialty();
  // await initializeSemesterType();
  // await initializeAssessmentType();
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
  Student,
  Subject,
  SemesterType,
  AssessmentType,
  Curriculum,
  Teacher,
  AcademicBuilding,
  Audience
  // Absenteeism,
  // AcademicPerformance,
  // Grade,
  // Lesson,
  // PlannedTask,
  // PlannedTaskTopic,
  // Topic,
  // SubjectType,
  // TotalScoreType,
};
