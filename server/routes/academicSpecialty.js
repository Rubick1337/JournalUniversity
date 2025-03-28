const academicSpecialtyRouter = require('express').Router();
const academicSpecialtyController = require('../controllers/AcademicSpecialtyController');
// const authMiddleware = require('../middleware/AuthMiddleware')

academicSpecialtyRouter.get(`/getData`, academicSpecialtyController.getAcademicSpecialties);
academicSpecialtyRouter.post(`/create`, academicSpecialtyController.createAcademicSpecialties);
academicSpecialtyRouter.delete(`/delete`, academicSpecialtyController.deleteAcademicSpecialties);
academicSpecialtyRouter.put(`/update`, academicSpecialtyController.updateAcademicSpecialties);


module.exports = academicSpecialtyRouter;