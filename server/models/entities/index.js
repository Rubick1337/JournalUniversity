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


const {Schedule} = require('./Schedule')
const {ScheduleDetails} = require('./ScheduleDetails')
// const { Absenteeism } = require("./Absenteeism");
// const { AcademicPerformance } = require("./AcademicPerformance");
const { Lesson } = require("./Lesson");
const { TypeOfSemester } = require("./TypeOfSemester");
const { StudyPlan } = require("./StudyPlan");
// const { TotalScoreType } = require("./TotalScoreType");

const {Role, initializeRoles} = require('./Role')
const {User} = require('./User')

const { AssessmentMethod, initializeAssessmentMethod } = require('./AssessmentMethod')
const {StudyPlanTopics} = require('./StudyPlanTopics')
const { Grade } = require("./Grade");

const initModels = async () => {
  // await initializeTeachingPositions();
  // await initializeWeekType();
  // await initializePair();
  // await initializeFaculty();
  // await initializeDepartment();
  // await initializeAcademicSpecialty();
  // await initializeAssessmentType();
  // await initializeEducationForm();
  // await initializeSubjectType();
  // await initializeRoles();
  // await initializeAssessmentMethod();
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
Schedule,
ScheduleDetails,
  // Absenteeism,
  // AcademicPerformance,
  // PlannedTask,
  // PlannedTaskTopic,
  // TotalScoreType,
  Role,
  User,
  TypeOfSemester,
  StudyPlan,
  AssessmentMethod,
  StudyPlanTopics,
    Grade,

};

