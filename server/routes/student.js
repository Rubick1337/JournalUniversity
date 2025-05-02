const studentRouter = require('express').Router();
const studentController = require('../controllers/StudentController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_student_PARAM = 'studentId'
//TODO validate

studentRouter.get(`/getAll`, studentController.getAll);
studentRouter.get(`/getById/:${NAME_OF_ID_student_PARAM}`, studentController.getById);
studentRouter.delete(`/delete/:${NAME_OF_ID_student_PARAM}`, studentController.delete);
studentRouter.post(`/create`, studentController.create);
studentRouter.put(`/update/:${NAME_OF_ID_student_PARAM}`, studentController.update);
    
module.exports = studentRouter;