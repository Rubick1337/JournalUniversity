const topicRouter = require('express').Router();
const topicController = require('../controllers/TopicController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_TEACHER_POSITION_PARAM = 'topicId'
//TODO validate
topicRouter.get(`/getAll`, topicController.getAll);
topicRouter.get(`/getById/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, topicController.getById);
topicRouter.delete(`/delete/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, topicController.delete);
topicRouter.post(`/create`, topicController.create);
topicRouter.put(`/update/:${NAME_OF_ID_TEACHER_POSITION_PARAM}`, topicController.update);
    
module.exports = topicRouter;