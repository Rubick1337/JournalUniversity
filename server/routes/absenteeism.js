

const absenteeismRouter = require('express').Router();
const absenteeismController = require('../controllers/AbsenteeismController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_absenteeism_PARAM = 'absenteeismId'
//TODO validate

absenteeismRouter.get(`/getAll`, absenteeismController.getAll);
absenteeismRouter.get(`/getById/:${NAME_OF_ID_absenteeism_PARAM}`, absenteeismController.getById);
absenteeismRouter.delete(`/delete/:${NAME_OF_ID_absenteeism_PARAM}`, absenteeismController.delete);
absenteeismRouter.post(`/create`, absenteeismController.create);
absenteeismRouter.put(`/update/:${NAME_OF_ID_absenteeism_PARAM}`, absenteeismController.update);

absenteeismRouter.get(`/getForStudent`, absenteeismController.getForStudent);


module.exports = absenteeismRouter;