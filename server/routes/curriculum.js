const curriculumRouter = require('express').Router();
const curriculumController = require('../controllers/CurriculumController');
// const authMiddleware = require('../middleware/AuthMiddleware')
//TODO validate
curriculumRouter.get(`/getAll`, curriculumController.getAll);
curriculumRouter.get(`/getById/:id`, curriculumController.getById);
curriculumRouter.get(`/getCurrentCurriculumForStudent`, curriculumController.getCurrentCurriculumForStudent);
curriculumRouter.get(`/getNumberSemesterInCurriculum`, curriculumController.getNumberSemesterInCurriculum);
curriculumRouter.get(`/getStudentSubjects`, curriculumController.getStudentSubjects);
curriculumRouter.delete(`/delete/:id`, curriculumController.delete);
curriculumRouter.post(`/create`, curriculumController.create);
curriculumRouter.put(`/update/:id`, curriculumController.update);
    
module.exports = curriculumRouter;