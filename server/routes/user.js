const userRouter = require('express').Router();
const userController = require('../controllers/UserController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_TEACHER_POSITION_PARAM = 'id'
//TODO validate
// userRouter.get(`/getAll`, userController.getAll);
// userRouter.get(`/getById/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, userController.getById);
// userRouter.delete(`/delete/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, userController.delete);
userRouter.post(`/create`, userController.create);
userRouter.post(`/login`, userController.login);
userRouter.post(`/logout`, userController.logout);
// userRouter.put(`/update/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, userController.update);
    
module.exports = userRouter;