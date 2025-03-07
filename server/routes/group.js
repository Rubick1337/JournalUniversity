const groupRouter = require('express').Router();
const groupController = require('../controllers/GroupController');
// const authMiddleware = require('../middleware/AuthMiddleware')

groupRouter.get(`/getSubgroups`, groupController.getSubgroupsByGroupId);


module.exports = groupRouter;