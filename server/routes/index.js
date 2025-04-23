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


module.exports = router;