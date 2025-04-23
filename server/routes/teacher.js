const teacherRouter = require('express').Router();
const teacherController = require('../controllers/TeacherController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_TEACHER_PARAM = 'teacherId'
//TODO validate
teacherRouter.get(`/getAll`, teacherController.getAll);
teacherRouter.get(`/getById/:${NAME_OF_ID_TEACHER_PARAM}`, teacherController.getById);
teacherRouter.delete(`/delete/:${NAME_OF_ID_TEACHER_PARAM}`, teacherController.delete);
teacherRouter.post(`/create`, teacherController.create);
teacherRouter.put(`/update/:${NAME_OF_ID_TEACHER_PARAM}`, teacherController.update);
    
module.exports = teacherRouter;