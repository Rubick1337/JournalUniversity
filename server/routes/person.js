const personRouter = require('express').Router();
const personController = require('../controllers/PersonController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const {validateCreate, validateUpdate} = require('../middleware/validation/validators/personValidator') 

personRouter.post(`/create`, personController.create);
personRouter.get(`/getAll`, personController.getAll);
personRouter.delete(`/delete/:personId`, personController.delete);
personRouter.put('/update/:personId', validateUpdate, personController.update)
personRouter.get(`/getDataForSelect`, personController.getDataForSelect);

module.exports = personRouter;