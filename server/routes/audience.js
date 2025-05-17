const audienceRouter = require("express").Router();
const audienceController = require("../controllers/AudienceController");


audienceRouter.get(`/getAll`, audienceController.getAll);
audienceRouter.post(`/create`, audienceController.create);

const ID_FIELD_NAME = "audienceId"

audienceRouter.get(`/getAll`, audienceController.getAll);
audienceRouter.get(`/getById/:${ID_FIELD_NAME}`, audienceController.getById);
audienceRouter.delete(`/delete/:${ID_FIELD_NAME}`, audienceController.delete);
audienceRouter.post(`/create`, audienceController.create);
audienceRouter.put(`/update/:${ID_FIELD_NAME}`, audienceController.update);
    

module.exports = audienceRouter;

