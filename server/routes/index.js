const { message } = require('../error/ApiError');

const router = require('express').Router();


router.get('/',(req,res) => {
    res.status(200).json({message: 'homepage'})
})

function initializeRoute(route, routeName) {
    const newRouter = require(`./${route}`);
    router.use(`/${routeName}`, newRouter);
}


initializeRoute('person', 'person');
initializeRoute('group', 'group');
initializeRoute('subgroup', 'subgroup');
initializeRoute('academicSpecialty', 'academicSpecialty');
initializeRoute('faculty', 'faculty');
initializeRoute('department', 'department');
initializeRoute('subject', 'subject');
initializeRoute('teacherPosition', 'teacherPosition');
initializeRoute('teacher', 'teacher');
initializeRoute('educationForm', 'educationForm');
initializeRoute('curriculum', 'curriculum');
initializeRoute('assessmentType', 'assessmentType');
initializeRoute('curriculumSubject', 'curriculumSubject');
initializeRoute('subjectType', 'subjectType');
initializeRoute('topic', 'topic');
initializeRoute('student', 'student');
initializeRoute('user', 'user');
initializeRoute('lesson', 'lesson');
initializeRoute('schedule', 'schedule');
initializeRoute('studyPlan', 'studyPlan');
initializeRoute('grade', 'grade');
initializeRoute('absenteeism', 'absenteeism');
initializeRoute('typeOfSemester', 'typeOfSemester');


initializeRoute('audience', 'audience');
initializeRoute('academicBuilding', 'academicBuilding');


module.exports = router;