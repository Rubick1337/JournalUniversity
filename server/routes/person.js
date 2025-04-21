const personRouter = require('express').Router();
const personController = require('../controllers/PersonController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const {validateCreate, validateUpdate} = require('../middleware/validation/validators/personValidator') 


//<== CRUD базовый ==>
//TODO валидация при создании
personRouter.post(`/create`, personController.create);
//TODO валидация query параметров
personRouter.get(`/getAll`, personController.getAll);
//TODO валидация параметров
personRouter.delete(`/delete/:personId`, personController.delete);
//TODO валидация параметров
personRouter.put('/update/:personId', personController.update)



personRouter.get(`/getDataForSelect`, personController.getDataForSelect);

module.exports = personRouter;