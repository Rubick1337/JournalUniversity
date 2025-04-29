const curriculumSubjectRouter = require('express').Router();
const curriculumSubjectController = require('../controllers/CurriculumSubjectController');
// const authMiddleware = require('../middleware/AuthMiddleware')
//TODO validate
curriculumSubjectRouter.get(`/getAll/:curriculumId`, curriculumSubjectController.getAll);
curriculumSubjectRouter.get(`/getByCompositeId/:curriculumId/:subjectId/:assessmentTypeId/:semester`, curriculumSubjectController.getByCompositeId);
curriculumSubjectRouter.delete(`/delete/:curriculumId/:subjectId/:assessmentTypeId/:semester`, curriculumSubjectController.delete);
curriculumSubjectRouter.post(`/create/:curriculumId`, curriculumSubjectController.create);
curriculumSubjectRouter.put(`/update/:curriculumId/:subjectId/:assessmentTypeId/:semester`, curriculumSubjectController.update);

module.exports = curriculumSubjectRouter;