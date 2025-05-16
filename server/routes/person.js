const personRouter = require('express').Router();
const personController = require('../controllers/PersonController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const {validateCreate, validateUpdate} = require('../middleware/validation/validators/personValidator') 


//<== CRUD базовый ==>
//TODO валидация при создании
personRouter.post(`/create`, personController.create);
//TODO валидация query параметров
personRouter.get(`/getAll`, personController.getAll);

personRouter.get(`/getAllByFullName`, personController.getAllByFullName);
//TODO валидация параметров
personRouter.delete(`/delete/:personId`, personController.delete);
//TODO валидация параметров
personRouter.put('/update/:personId',validateUpdate, personController.update)


module.exports = personRouter;