const typeOfSemesterRouter = require('express').Router();
const typeOfSemesterController = require('../controllers/TypeOfSemesterController');
// const authMiddleware = require('../middleware/AuthMiddleware')



const ID_FIELD_NAME = "typeOfSemesterId"

typeOfSemesterRouter.get(`/getAll`, typeOfSemesterController.getAll);
typeOfSemesterRouter.get(`/getById/:${ID_FIELD_NAME}`, typeOfSemesterController.getById);
typeOfSemesterRouter.delete(`/delete/:${ID_FIELD_NAME}`, typeOfSemesterController.delete);
typeOfSemesterRouter.post(`/create`, typeOfSemesterController.create);
typeOfSemesterRouter.put(`/update/:${ID_FIELD_NAME}`, typeOfSemesterController.update);

    

module.exports = typeOfSemesterRouter;