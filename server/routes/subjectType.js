const subjectTypeRouter = require('express').Router();
const subjectTypeController = require('../controllers/SubjectTypeController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_TEACHER_POSITION_PARAM = 'subjectTypeId'
//TODO validate
subjectTypeRouter.get(`/getAll`, subjectTypeController.getAll);
subjectTypeRouter.get(`/getById/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, subjectTypeController.getById);
subjectTypeRouter.delete(`/delete/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, subjectTypeController.delete);
subjectTypeRouter.post(`/create`, subjectTypeController.create);
subjectTypeRouter.put(`/update/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, subjectTypeController.update);
    
module.exports = subjectTypeRouter;