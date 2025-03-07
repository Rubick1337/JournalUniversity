const subgroupRouter = require('express').Router();
const subgroupController = require('../controllers/SubgroupController');
// const authMiddleware = require('../middleware/AuthMiddleware')

subgroupRouter.get(`/getStudentFIO`, subgroupController.getStudentsFIOBySubgroupId);


module.exports = subgroupRouter;