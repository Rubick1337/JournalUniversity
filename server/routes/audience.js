const audienceRouter = require("express").Router();
const audienceController = require("../controllers/AudienceController");


audienceRouter.get(`/getAll`, audienceController.getAll);



module.exports = audienceRouter;

