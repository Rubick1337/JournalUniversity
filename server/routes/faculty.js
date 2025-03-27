const facultyRouter = require('express').Router();
const facultyController = require('../controllers/FacultyController');
// const authMiddleware = require('../middleware/AuthMiddleware')

facultyRouter.get(`/getAll`, facultyController.getAll);
facultyRouter.get(`/getById`, facultyController.getById);
facultyRouter.delete(`/delete`, facultyController.delete);
facultyRouter.post(`/create`, facultyController.create);
facultyRouter.put(`/update`, facultyController.update);

module.exports = facultyRouter;