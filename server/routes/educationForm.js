const educationFormRouter = require('express').Router();
const educationFormController = require('../controllers/EducationFormController');
// const authMiddleware = require('../middleware/AuthMiddleware')
//TODO validate
educationFormRouter.get(`/getAll`, educationFormController.getAll);
educationFormRouter.get(`/getById/:id`, educationFormController.getById);
educationFormRouter.delete(`/delete/:id`, educationFormController.delete);
educationFormRouter.post(`/create`, educationFormController.create);
educationFormRouter.put(`/update/:id`, educationFormController.update);
    
module.exports = educationFormRouter;