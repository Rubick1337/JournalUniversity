const { Op, Sequelize} = require('sequelize')
const {
  initModels,
  Person,
  TeachingPosition,
  Faculty,
  WeekType,
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
  //   Absenteeism,
  //   AcademicPerformance,
  //   Grade,
  //   GradeTopic,
  //   Lesson,
  //   PlannedTask,
  //   PlannedTaskTopic,
  //   SubgroupStudent,
  //   Topic,
  //   SubjectType,
  //   TotalScoreType
} = require("./entities");

// Define associations
Faculty.belongsTo(Person, {
  foreignKey: 'dean_person_id',
  as: 'dean'
});

Person.hasMany(Faculty, {
  foreignKey: 'dean_person_id',
  as: 'faculties'
});

//Department
Person.hasOne(Department, {
  foreignKey: "chairperson_of_the_department_person_id",
});
Department.belongsTo(Faculty, { foreignKey: 'faculty_id', as: 'faculty' });
Department.belongsTo(Person, { foreignKey: 'head_person_id', as: 'head' });

Faculty.hasMany(Department, { foreignKey: "faculty_id" });
Department.hasMany(Group, { foreignKey: "department_id" });

//Subject
Department.hasMany(Subject, {
  foreignKey: "department_id",
  as: 'subjects', // явно указываем псевдоним для ассоциации
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Subject.belongsTo(Department, {
  foreignKey: "department_id",
  as: 'department', // явно указываем псевдоним
  targetKey: 'id' // явно указываем целевой ключ (опционально)
});

//Group
Faculty.hasMany(Group, { foreignKey: "faculty_id" });
Group.belongsTo(Faculty, { foreignKey: "faculty_id" });
Person.hasMany(Group, { foreignKey: "class_representative_person_id" });
Group.belongsTo(Person, { foreignKey: "class_representative_person_id" });
Group.belongsTo(Department, { foreignKey: "department_id" });
AcademicSpecialty.hasMany(Group, { foreignKey: "specialty_code" });
Group.belongsTo(AcademicSpecialty, { foreignKey: "specialty_code" });

//Subgroup
Group.hasMany(Subgroup, { foreignKey: "group_id" });
Subgroup.belongsTo(Group, { foreignKey: "group_id" });

//Student
Person.hasMany(Student, { foreignKey: "person_id" });
Student.belongsTo(Person, { foreignKey: "person_id" });
Group.hasMany(Student, { foreignKey: "group_id" });
Student.belongsTo(Group, { foreignKey: "group_id" });
Subgroup.hasMany(Student, { foreignKey: "subgroup_id" });
Student.belongsTo(Subgroup, { foreignKey: "subgroup_id" });
Person.hasMany(Student, { foreignKey: "perent_person_id" });
Student.belongsTo(Person, { foreignKey: "perent_person_id" });


//Teacher
Person.hasMany(Teacher, { 
  foreignKey: 'person_id',
  as: 'teachers'
});
Teacher.belongsTo(Person, { 
  foreignKey: 'person_id',
  as: 'person'
});

Department.hasMany(Teacher, { 
  foreignKey: 'department_id',
  as: 'teachers' 
});
Teacher.belongsTo(Department, { 
  foreignKey: 'department_id',
  as: 'department'
});

TeachingPosition.hasMany(Teacher, { 
  foreignKey: 'teaching_position_id',
  as: 'teachers' 
});
Teacher.belongsTo(TeachingPosition, { 
  foreignKey: 'teaching_position_id',
  as: 'teachingPosition'
});



//Curriculum
AcademicSpecialty.hasMany(Curriculum, { 
  foreignKey: "specialty_code",
  as: "AcademicSpecialty"   
});
Curriculum.belongsTo(AcademicSpecialty, { 
  foreignKey: "specialty_code",
  as: "AcademicSpecialty"   
});

EducationForm.hasMany(Curriculum, { 
  foreignKey: "education_form_id",
  as: "EducationForm"   
});
Curriculum.belongsTo(EducationForm, { 
  foreignKey: "education_form_id",
  as: "EducationForm"   
});

// //TODO связи
// Group.hasMany(Absenteeism, { foreignKey: "group_id" });
// Absenteeism.belongsTo(Group, { foreignKey: "group_id" });

// Lesson.hasMany(Absenteeism, { foreignKey: "lesson_id" });
// Absenteeism.belongsTo(Lesson, { foreignKey: "lesson_id" });

// Student.hasMany(Absenteeism, { foreignKey: "student_id" });
// Absenteeism.belongsTo(Student, { foreignKey: "student_id" });

// Student.hasMany(AcademicPerformance, { foreignKey: "student_id" });
// AcademicPerformance.belongsTo(Student, { foreignKey: "student_id" });

// Subject.hasMany(AcademicPerformance, { foreignKey: "subject_id" });
// AcademicPerformance.belongsTo(Subject, { foreignKey: "subject_id" });

// TotalScoreType.hasMany(AcademicPerformance, { foreignKey: "total_grade_id" });
// AcademicPerformance.belongsTo(TotalScoreType, { foreignKey: "total_grade_id" });

// Subject.hasMany(Curriculum, { foreignKey: "subject_id" });
// Curriculum.belongsTo(Subject, { foreignKey: "subject_id" });

// Topic.hasMany(Curriculum, { foreignKey: "topic_id" });
// Curriculum.belongsTo(Topic, { foreignKey: "topic_id" });

// AssessmentType.hasMany(Curriculum, { foreignKey: "type_of_assessment_id" });
// Curriculum.belongsTo(AssessmentType, { foreignKey: "type_of_assessment_id" });

// Topic.hasMany(Grade, { foreignKey: "topic_id" });
// Grade.belongsTo(Topic, { foreignKey: "topic_id" });

// // Student и Grade
// Student.hasMany(Grade, { foreignKey: "student_id" });
// Grade.belongsTo(Student, { foreignKey: "student_id" });

// // Lesson и Grade
// Lesson.hasMany(Grade, { foreignKey: "lesson_id" });
// Grade.belongsTo(Lesson, { foreignKey: "lesson_id" });

// // Group и Grade
// Group.hasMany(Grade, { foreignKey: "group_id" });
// Grade.belongsTo(Group, { foreignKey: "group_id" });

// // PlannedTask и Grade
// PlannedTask.hasMany(Grade, { foreignKey: "planned_task_id" });
// Grade.belongsTo(PlannedTask, { foreignKey: "planned_task_id" });

// // Person (учитель-куратор) и Group
// Person.hasMany(Group, { foreignKey: "teacher_curator_id" });
// Group.belongsTo(Person, { foreignKey: "teacher_curator_id" });

// Group.belongsToMany(Lesson, { through: 'GroupLesson', foreignKey: 'group_id' });
// Lesson.belongsToMany(Group, { through: 'GroupLesson', foreignKey: 'lesson_id' });

// Subject.hasMany(Lesson, { foreignKey: 'subject_id' });
// Lesson.belongsTo(Subject, { foreignKey: 'subject_id' });

// Person.hasMany(Lesson, { foreignKey: 'teacher_person_id' });
// Lesson.belongsTo(Person, { foreignKey: 'teacher_person_id' });

// Topic.hasMany(Lesson, { foreignKey: 'topic_id' });
// Lesson.belongsTo(Topic, { foreignKey: 'topic_id' });

// Group.belongsToMany(PlannedTask, { through: 'GroupPlannedTask', foreignKey: 'group_id' });
// PlannedTask.belongsToMany(Group, { through: 'GroupPlannedTask', foreignKey: 'planned_task_id' });

// Subgroup.belongsToMany(PlannedTask, { through: 'SubgroupPlannedTask', foreignKey: 'subgroup_id' });
// PlannedTask.belongsToMany(Subgroup, { through: 'SubgroupPlannedTask', foreignKey: 'planned_task_id' });

// // Subject и PlannedTask (ноль или многие ко многим)
// Subject.belongsToMany(PlannedTask, { through: 'SubjectPlannedTask', foreignKey: 'subject_id' });
// PlannedTask.belongsToMany(Subject, { through: 'SubjectPlannedTask', foreignKey: 'planned_task_id' });

// // Student и PlannedTask (ноль или многие ко многим)
// Student.belongsToMany(PlannedTask, { through: 'StudentPlannedTask', foreignKey: 'student_id' });
// PlannedTask.belongsToMany(Student, { through: 'StudentPlannedTask', foreignKey: 'planned_task_id' });

// // PlannedTask и PlannedTaskTopic
// PlannedTask.hasMany(PlannedTaskTopic, { foreignKey: 'planned_task_id' });
// PlannedTaskTopic.belongsTo(PlannedTask, { foreignKey: 'planned_task_id' });

// // Topic и PlannedTaskTopic
// Topic.hasMany(PlannedTaskTopic, { foreignKey: 'topic_id' });
// PlannedTaskTopic.belongsTo(Topic, { foreignKey: 'topic_id' });

// // Subject и PlannedTaskTopic
// Subject.hasMany(PlannedTaskTopic, { foreignKey: 'subject_id' });
// PlannedTaskTopic.belongsTo(Subject, { foreignKey: 'subject_id' });

// // Student и Subgroup (лидер)
// Student.hasOne(Subgroup, { foreignKey: 'leader_id' });
// Subgroup.belongsTo(Student, { foreignKey: 'leader_id' });


// // Subject и Topic
// Subject.hasMany(Topic, { foreignKey: 'subject_id' });
// Topic.belongsTo(Subject, { foreignKey: 'subject_id' });

// // SubjectType и Topic
// SubjectType.hasMany(Topic, { foreignKey: 'subject_type_id' });
// Topic.belongsTo(SubjectType, { foreignKey: 'subject_type_id' })

module.exports = {
  initModels,
  Op,
  Sequelize,
  Person,
  TeachingPosition,
  Faculty,
  WeekType,
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

  //   Absenteeism,
  //   AcademicPerformance,
  //   Grade,
  //   GradeTopic,
  //   Lesson,
  //   PlannedTask,
  //   PlannedTaskTopic,
  //   SubgroupStudent,
  //   Topic,
  //   SubjectType,
  //   TotalScoreType,
};
