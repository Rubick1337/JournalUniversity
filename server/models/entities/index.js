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
const { CurriculumSubject } = require("./CurriculumSubject");
const { Teacher } = require("./Teacher");
const { AcademicBuilding } = require("./AcademicBuilding");
const { Audience } = require("./Audience");
const { EducationForm, initializeEducationForm } = require("./EducationForm");
const { Topic } = require("./Topic");
const { SubjectType, initializeSubjectType } = require("./SubjectType");

// const { Absenteeism } = require("./Absenteeism");
// const { AcademicPerformance } = require("./AcademicPerformance");
// const { Grade } = require("./Grade");
const { Lesson } = require("./Lesson");
// const { PlannedTask } = require("./PlannedTask");
// const { PlannedTaskTopic } = require("./PlannedTaskTopic");
// const { Topic } = require("./Topic");
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
  // await initializeEducationForm();
  // await initializeSubjectType();
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
  Audience,
  EducationForm,
  CurriculumSubject,
  Topic,
    SubjectType,
    Lesson,

  // Absenteeism,
  // AcademicPerformance,
  // Grade,
  // PlannedTask,
  // PlannedTaskTopic,
  // TotalScoreType,
};
