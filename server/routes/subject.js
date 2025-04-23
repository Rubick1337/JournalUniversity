const subjectRouter = require('express').Router();
const subjectController = require('../controllers/SubjectController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_SUBJECT_PARAM = 'subjectId'

//TODO validate params
subjectRouter.get(`/getAll`, subjectController.getAll);
subjectRouter.get(`/getById/:${NAME_OF_ID_SUBJECT_PARAM}`, subjectController.getById);
subjectRouter.delete(`/delete/:${NAME_OF_ID_SUBJECT_PARAM}`, subjectController.delete);
subjectRouter.post(`/create`, subjectController.create);
subjectRouter.put(`/update/:${NAME_OF_ID_SUBJECT_PARAM}`, subjectController.update);

module.exports = subjectRouter;