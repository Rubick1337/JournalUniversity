const personRouter = require('express').Router();
const personController = require('../controllers/PersonController');
// const authMiddleware = require('../middleware/AuthMiddleware')

personRouter.post(`/create`, personController.create);
personRouter.get(`/getDataForSelect`, personController.getDataForSelect);
personRouter.get(`/getAll`, personController.getAll);


module.exports = personRouter;