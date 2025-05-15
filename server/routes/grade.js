const gradeRouter = require('express').Router();
const gradeController = require('../controllers/GradeController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_grade_PARAM = 'gradeId'
//TODO validate

// gradeRouter.get(`/getAll`, gradeController.getAll);
// gradeRouter.get(`/getCurrentSubjects`, gradeController.getCurrentSubjects);
// gradeRouter.get(`/getById/:${NAME_OF_ID_grade_PARAM}`, gradeController.getById);
// gradeRouter.delete(`/delete/:${NAME_OF_ID_grade_PARAM}`, gradeController.delete);
gradeRouter.post(`/create`, gradeController.create);
// gradeRouter.put(`/update/:${NAME_OF_ID_grade_PARAM}`, gradeController.update);

module.exports = gradeRouter;