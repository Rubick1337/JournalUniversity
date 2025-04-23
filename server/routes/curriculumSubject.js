const curriculumSubjectRouter = require('express').Router();
const curriculumSubjectController = require('../controllers/CurriculumSubjectController');
// const authMiddleware = require('../middleware/AuthMiddleware')
//TODO validate
// curriculumSubjectRouter.get(`/getAll`, curriculumSubjectController.getAll);
// curriculumSubjectRouter.get(`/getById/:id`, curriculumSubjectController.getById);
// curriculumSubjectRouter.delete(`/delete/:id`, curriculumSubjectController.delete);
curriculumSubjectRouter.post(`/create/:curriculumId`, curriculumSubjectController.create);
// curriculumSubjectRouter.put(`/update/:id`, curriculumSubjectController.update);
    
module.exports = curriculumSubjectRouter;