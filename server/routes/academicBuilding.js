const academicBuildingRouter = require("express").Router();
const academicBuildingController = require("../controllers/AcademicBuildingController");


academicBuildingRouter.get(`/getAll`, academicBuildingController.getAll);



module.exports = academicBuildingRouter;

