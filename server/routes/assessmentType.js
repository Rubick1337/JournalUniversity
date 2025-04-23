const assessmentTypeRouter = require('express').Router();
const assessmentTypeController = require('../controllers/AssessmentTypeController');
// const authMiddleware = require('../middleware/AuthMiddleware')
//TODO validate
assessmentTypeRouter.get(`/getAll`, assessmentTypeController.getAll);
assessmentTypeRouter.get(`/getById/:id`, assessmentTypeController.getById);
assessmentTypeRouter.delete(`/delete/:id`, assessmentTypeController.delete);
assessmentTypeRouter.post(`/create`, assessmentTypeController.create);
assessmentTypeRouter.put(`/update/:id`, assessmentTypeController.update);
    
module.exports = assessmentTypeRouter;