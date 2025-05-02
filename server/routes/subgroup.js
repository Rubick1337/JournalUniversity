const subgroupRouter = require('express').Router();
const subgroupController = require('../controllers/SubgroupController');
// const authMiddleware = require('../middleware/AuthMiddleware')
const NAME_OF_ID_subgroup_PARAM = 'subgroupId'
//TODO validate

subgroupRouter.get(`/getAll`, subgroupController.getAll);
subgroupRouter.get(`/getById/:${NAME_OF_ID_subgroup_PARAM}`, subgroupController.getById);
subgroupRouter.delete(`/delete/:${NAME_OF_ID_subgroup_PARAM}`, subgroupController.delete);
subgroupRouter.post(`/create`, subgroupController.create);
subgroupRouter.put(`/update/:${NAME_OF_ID_subgroup_PARAM}`, subgroupController.update);
    
module.exports = subgroupRouter;