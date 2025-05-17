const audienceRouter = require("express").Router();
const audienceController = require("../controllers/AudienceController");


audienceRouter.get(`/getAll`, audienceController.getAll);
audienceRouter.post(`/create`, audienceController.create);



module.exports = audienceRouter;

