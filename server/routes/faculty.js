const facultyRouter = require('express').Router();
const facultyController = require('../controllers/FacultyController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_FACULTY_PARAM = 'facultyId'

//TODO validate params
facultyRouter.get(`/getAll`, facultyController.getAll);
facultyRouter.get(`/getById/:${NAME_OF_ID_FACULTY_PARAM}`, facultyController.getById);
facultyRouter.delete(`/delete/:${NAME_OF_ID_FACULTY_PARAM}`, facultyController.delete);
facultyRouter.post(`/create`, facultyController.create);
facultyRouter.put(`/update/:${NAME_OF_ID_FACULTY_PARAM}`, facultyController.update);

module.exports = facultyRouter;