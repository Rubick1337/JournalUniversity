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
  CurriculumSubject,
  Topic,
  SubjectType,

  //   Absenteeism,
  //   AcademicPerformance,
  //   Grade,
  //   GradeTopic,
  //   Lesson,
  //   PlannedTask,
  //   PlannedTaskTopic,
  //   SubgroupStudent,

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
Department.belongsTo(Person, { foreignKey: 'chairperson_of_the_department_person_id', as: 'head' });

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

// Group 
Faculty.hasMany(Group, { 
  foreignKey: "faculty_id",
  as: "groups"
});
Group.belongsTo(Faculty, { 
  foreignKey: "faculty_id",
  as: "faculty" 
});
Person.hasMany(Group, { 
  foreignKey: "class_representative_person_id",
  as: "representedGroups"
});
Group.belongsTo(Person, { 
  foreignKey: "class_representative_person_id",
  as: "classRepresentative"
});

Person.hasMany(Group, { 
  foreignKey: "teacher_curator_id",
  as: "curatedGroups"
});
Group.belongsTo(Person, { 
  foreignKey: "teacher_curator_id",
  as: "teacherCurator"
});

Department.hasMany(Group, {
  foreignKey: "department_id",
  as: "groups" 
});
Group.belongsTo(Department, { 
  foreignKey: "department_id",
  as: "department"
});

AcademicSpecialty.hasMany(Group, { 
  foreignKey: "specialty_code",
  as: "groups"
});
Group.belongsTo(AcademicSpecialty, { 
  foreignKey: "specialty_code",
  as: "academicSpecialty"
});


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

// CurriculumSubject associations
Curriculum.hasMany(CurriculumSubject, {
  foreignKey: 'curriculum_id',
  as: 'curriculum'
});

CurriculumSubject.belongsTo(Curriculum, {
  foreignKey: 'curriculum_id',
  as: 'curriculum'
});

Subject.hasMany(CurriculumSubject, {
  foreignKey: 'subject_id',
  as: 'subject'
});

CurriculumSubject.belongsTo(Subject, {
  foreignKey: 'subject_id',
  as: 'subject'
});

AssessmentType.hasMany(CurriculumSubject, {
  foreignKey: 'assessment_type_id',
  as: 'assessmentType'
});

CurriculumSubject.belongsTo(AssessmentType, {
  foreignKey: 'assessment_type_id',
  as: 'assessmentType'
});


//Topic
Subject.hasMany(Topic, {
  foreignKey: "subject_id",
  as: "subjectForTopic"
})
Topic.belongsTo(Subject, {
  foreignKey: "subject_id",
  as: "subjectForTopic"
})


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
  CurriculumSubject,
  Topic,
  SubjectType,
  //   Absenteeism,
  //   AcademicPerformance,
  //   Grade,
  //   GradeTopic,
  //   Lesson,
  //   PlannedTask,
  //   PlannedTaskTopic,
  //   SubgroupStudent,

  //   TotalScoreType,
};
