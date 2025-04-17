const personRouter = require('express').Router();
const personController = require('../controllers/PersonController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const {validateCreate} = require('../middleware/validation/validators/academicSpecialtyValidator') 

personRouter.post(`/create`, personController.create);
personRouter.get(`/getDataForSelect`, personController.getDataForSelect);
personRouter.get(`/getAll`, personController.getAll);
personRouter.delete(`/delete/:personId`, personController.delete);


module.exports = personRouter;