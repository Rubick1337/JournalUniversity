const lessonRouter = require('express').Router();
const lessonController = require('../controllers/LessonController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_lesson_PARAM = 'lessonId'
//TODO validate

lessonRouter.get(`/getAll`, lessonController.getAll);
lessonRouter.get(`/getById/:${NAME_OF_ID_lesson_PARAM}`, lessonController.getById);
lessonRouter.get(`/getPairsOnDate`, lessonController.getPairsOnDate);
lessonRouter.delete(`/delete/:${NAME_OF_ID_lesson_PARAM}`, lessonController.delete);
lessonRouter.post(`/create`, lessonController.create);
lessonRouter.put(`/update/:${NAME_OF_ID_lesson_PARAM}`, lessonController.update);

module.exports = lessonRouter;