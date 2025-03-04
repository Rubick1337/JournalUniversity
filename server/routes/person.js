const personRouter = require('express').Router();
const personController = require('../controllers/PersonController');
// const authMiddleware = require('../middleware/AuthMiddleware')

personRouter.post(`/create`, personController.createPerson);
personRouter.get(`/getDataForSelect`, personController.getDataForSelect);


module.exports = personRouter;