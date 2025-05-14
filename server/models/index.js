const { Op, Sequelize } = require("sequelize");
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
  Pair,
  Schedule,
ScheduleDetails,
Role,
User,
  //   Absenteeism,
  //   AcademicPerformance,
  //   Grade,
  //   GradeTopic,
  //   PlannedTask,
  //   PlannedTaskTopic,
  //   SubgroupStudent,

  //   TotalScoreType
} = require("./entities");

// Define associations
Faculty.belongsTo(Person, {
  foreignKey: "dean_person_id",
  as: "dean",
});

Person.hasMany(Faculty, {
  foreignKey: "dean_person_id",
  as: "faculties",
});

//Department
Person.hasOne(Department, {
  foreignKey: "chairperson_of_the_department_person_id",
});
Department.belongsTo(Faculty, { foreignKey: "faculty_id", as: "faculty" });
Department.belongsTo(Person, {
  foreignKey: "chairperson_of_the_department_person_id",
  as: "head",
});

Faculty.hasMany(Department, { foreignKey: "faculty_id" });
Department.hasMany(Group, { foreignKey: "department_id" });

//Subject
Department.hasMany(Subject, {
  foreignKey: "department_id",
  as: "subjects", // явно указываем псевдоним для ассоциации
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Subject.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department", // явно указываем псевдоним
  targetKey: "id", // явно указываем целевой ключ (опционально)
});

// Group
Faculty.hasMany(Group, {
  foreignKey: "faculty_id",
  as: "groups",
});
Group.belongsTo(Faculty, {
  foreignKey: "faculty_id",
  as: "faculty",
});
Person.hasMany(Group, {
  foreignKey: "class_representative_person_id",
  as: "representedGroups",
});
Group.belongsTo(Person, {
  foreignKey: "class_representative_person_id",
  as: "classRepresentative",
});

Person.hasMany(Group, {
  foreignKey: "teacher_curator_id",
  as: "curatedGroups",
});
Group.belongsTo(Person, {
  foreignKey: "teacher_curator_id",
  as: "teacherCurator",
});

Department.hasMany(Group, {
  foreignKey: "department_id",
  as: "groups",
});
Group.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

AcademicSpecialty.hasMany(Group, {
  foreignKey: "specialty_code",
  as: "groups",
});
Group.belongsTo(AcademicSpecialty, {
  foreignKey: "specialty_code",
  as: "academicSpecialty",
});

//Subgroup
Group.hasMany(Subgroup, { 
  foreignKey: "group_id", 
  as: "subgroups"
});
Subgroup.belongsTo(Group, { foreignKey: "group_id",
  as: "group"
 });

 Person.hasMany(Subgroup, { 
  foreignKey: "leader_id", 
  as: "subgroups"
});
Subgroup.belongsTo(Person, { foreignKey: "leader_id",
  as: "leader"
 });

//Student
Person.hasMany(Student, { foreignKey: "person_id", as: "studentRecords" });
Student.belongsTo(Person, { foreignKey: "person_id", as:"person" });
Group.hasMany(Student, { foreignKey: "group_id", as: "groupStudents" });
Student.belongsTo(Group, { foreignKey: "group_id", as:"group" });
Subgroup.hasMany(Student, { foreignKey: "subgroup_id", as:"subgroupStudents" });
Student.belongsTo(Subgroup, { foreignKey: "subgroup_id",as:"subgroup" });
Person.hasMany(Student, { foreignKey: "perent_person_id", as:"parentStudents" });
Student.belongsTo(Person, { foreignKey: "perent_person_id", as:"perent" });

//Teacher
Person.hasMany(Teacher, {
  foreignKey: "person_id",
  as: "teachers",
});
Teacher.belongsTo(Person, {
  foreignKey: "person_id",
  as: "person",
});

Department.hasMany(Teacher, {
  foreignKey: "department_id",
  as: "teachers",
});
Teacher.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

TeachingPosition.hasMany(Teacher, {
  foreignKey: "teaching_position_id",
  as: "teachers",
});
Teacher.belongsTo(TeachingPosition, {
  foreignKey: "teaching_position_id",
  as: "teachingPosition",
});

//Curriculum
AcademicSpecialty.hasMany(Curriculum, {
  foreignKey: "specialty_code",
  as: "AcademicSpecialty",
});
Curriculum.belongsTo(AcademicSpecialty, {
  foreignKey: "specialty_code",
  as: "AcademicSpecialty",
});

EducationForm.hasMany(Curriculum, {
  foreignKey: "education_form_id",
  as: "EducationForm",
});
Curriculum.belongsTo(EducationForm, {
  foreignKey: "education_form_id",
  as: "EducationForm",
});

// CurriculumSubject associations
Curriculum.hasMany(CurriculumSubject, {
  foreignKey: "curriculum_id",
  as: "curriculum",
});

CurriculumSubject.belongsTo(Curriculum, {
  foreignKey: "curriculum_id",
  as: "curriculum",
});

Subject.hasMany(CurriculumSubject, {
  foreignKey: "subject_id",
  as: "subject",
});

CurriculumSubject.belongsTo(Subject, {
  foreignKey: "subject_id",
  as: "subject",
});

AssessmentType.hasMany(CurriculumSubject, {
  foreignKey: "assessment_type_id",
  as: "assessmentType",
});

CurriculumSubject.belongsTo(AssessmentType, {
  foreignKey: "assessment_type_id",
  as: "assessmentType",
});

//Topic
Subject.hasMany(Topic, {
  foreignKey: "subject_id",
  as: "subjectForTopic",
});
Topic.belongsTo(Subject, {
  foreignKey: "subject_id",
  as: "subjectForTopic",
});

//Lesson
Group.hasMany(Lesson, {
  foreignKey: "group_id",
  as: "GroupForLesson",
})
Lesson.belongsTo(Group, {
  foreignKey: "group_id",
  as: "GroupForLesson",
})
Subgroup.hasMany(Lesson, {
  foreignKey: "subgroup_id",
  as: "SubgroupForLesson",
})
Lesson.belongsTo(Subgroup, {
  foreignKey: "subgroup_id",
  as: "SubgroupForLesson",
})
Teacher.hasMany(Lesson, {
  foreignKey: "teacher_person_id",
  as: "TeacherForLesson",
})
Lesson.belongsTo(Teacher, {
  foreignKey: "teacher_person_id",
  as: "TeacherForLesson",
})
Topic.hasMany(Lesson, {
  foreignKey: "topic_id",
  as: "TopicForLesson",
})
Lesson.belongsTo(Topic, {
  foreignKey: "topic_id",
  as: "TopicForLesson",
})
Audience.hasMany(Lesson, {
  foreignKey: "audience_id",
  as: "AudienceForLesson",
})
Lesson.belongsTo(Audience, {
  foreignKey: "audience_id",
  as: "AudienceForLesson",
})
SubjectType.hasMany(Lesson, {
  foreignKey: "subject_type_id",
  as: "SubjectTypeForLesson",
})
Lesson.belongsTo(SubjectType, {
  foreignKey: "subject_type_id",
  as: "SubjectTypeForLesson",
})
Subject.hasMany(Lesson, {
  foreignKey: "subject_id",
  as: "SubjectForLesson",
})
Lesson.belongsTo(Subject, {
  foreignKey: "subject_id",
  as: "SubjectForLesson",
})

Pair.hasMany(Lesson, {
  foreignKey: "pair_id",
  as: "PairForLesson",
})
Lesson.belongsTo(Pair, {
  foreignKey: "pair_id",
  as: "PairForLesson",
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
  Pair,
    Schedule,
ScheduleDetails,
Role,
User
  //   Absenteeism,
  //   AcademicPerformance,
  //   Grade,
  //   GradeTopic,
  //   PlannedTask,
  //   PlannedTaskTopic,
  //   SubgroupStudent,

  //   TotalScoreType,
};
