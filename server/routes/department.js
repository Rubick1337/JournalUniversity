const departmentRouter = require('express').Router();
const departmentController = require('../controllers/DepartmentController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_DEPARTMENT_PARAM = 'departmentId'

departmentRouter.get(`/getAll`, departmentController.getAll);
departmentRouter.get(`/getById/:${NAME_OF_ID_DEPARTMENT_PARAM}`, departmentController.getById);
departmentRouter.delete(`/delete/:${NAME_OF_ID_DEPARTMENT_PARAM}`, departmentController.delete);
departmentRouter.post(`/create`, departmentController.create);
departmentRouter.put(`/update/:${NAME_OF_ID_DEPARTMENT_PARAM}`, departmentController.update);
    
module.exports = departmentRouter;