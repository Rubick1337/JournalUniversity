const teacherPositionRouter = require('express').Router();
const teacherPositionController = require('../controllers/TeacherPositionController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_TEACHER_POSITION_PARAM = 'teacherPositionId'
//TODO validate
teacherPositionRouter.get(`/getAll`, teacherPositionController.getAll);
teacherPositionRouter.get(`/getById/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, teacherPositionController.getById);
teacherPositionRouter.delete(`/delete/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, teacherPositionController.delete);
teacherPositionRouter.post(`/create`, teacherPositionController.create);
teacherPositionRouter.put(`/update/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, teacherPositionController.update);
    
module.exports = teacherPositionRouter;