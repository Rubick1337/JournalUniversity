const groupRouter = require('express').Router();
const groupController = require('../controllers/GroupController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_group_PARAM = 'groupId'
//TODO validate

groupRouter.get(`/getAll`, groupController.getAll);
groupRouter.get(`/getCurrentSubjects`, groupController.getCurrentSubjects);
groupRouter.get(`/getById/:${NAME_OF_ID_group_PARAM}`, groupController.getById);
groupRouter.delete(`/delete/:${NAME_OF_ID_group_PARAM}`, groupController.delete);
groupRouter.post(`/create`, groupController.create);
groupRouter.put(`/update/:${NAME_OF_ID_group_PARAM}`, groupController.update);

module.exports = groupRouter;