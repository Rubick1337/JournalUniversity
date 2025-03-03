const { Person } = require("./Person");
const { TeachingPosition, initializeTeachingPositions } = require("./TeachingPosition");

// const { Absenteeism } = require("./Absenteeism");
// const { AcademicPerformance } = require("./AcademicPerformance");
// const { AcademicSpecialty } = require("./AcademicSpecialty");
// const { Curriculum } = require("./Curriculum");
// const { Department } = require("./Department");
// const { Faculty } = require("./Faculty");
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
  await initializeTeachingPositions();
};
module.exports = {
  initModels,
  Person,
  TeachingPosition,

  // Absenteeism,
  // AcademicPerformance,
  // AcademicSpecialty,
  // Curriculum,
  // Department,
  // Faculty,
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
